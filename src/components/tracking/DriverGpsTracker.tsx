'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MapPin, Navigation, UploadCloud, CheckCircle, Navigation2 } from 'lucide-react'
import { LoadRow, LoadStopRow } from '@/types/database.types'
import { createClient } from '@/lib/supabase/client'

interface TrackerProps {
  load: LoadRow;
  stops: LoadStopRow[];
  token: string;
}

export default function DriverGpsTracker({ load, stops, token }: TrackerProps) {
  const [trackingActive, setTrackingActive] = useState(false)
  const [currentStatus, setCurrentStatus] = useState(load.status)
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null)
  const [uploading, setUploading] = useState(false)
  const supabase = createClient()

  // Start tracking
  useEffect(() => {
    if (!trackingActive) return;

    let watchId: number;

    const updateLocation = async (position: GeolocationPosition) => {
      const { latitude, longitude, speed, heading } = position.coords;
      setLocation({ lat: latitude, lng: longitude });

      try {
        await fetch('/api/tracking/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            token,
            lat: latitude,
            lng: longitude,
            speed,
            heading,
            timestamp: new Date().toISOString()
          })
        });
      } catch (err) {
        console.error('Failed to update location', err);
      }
    };

    if ('geolocation' in navigator) {
      watchId = navigator.geolocation.watchPosition(updateLocation,
        (err) => console.error(err),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    }

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    }
  }, [trackingActive, token]);

  const updateStatus = async (newStatus: string) => {
    setCurrentStatus(newStatus as any);
    // In a real app, update via API. Doing direct supabase call for demo.
    await fetch('/api/tracking/update', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token: load.id, status: newStatus }) });
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      // Create bucket if it doesn't exist, though typically done in setup
      const fileExt = file.name.split('.').pop();
      const fileName = `${load.id}/pod_${Date.now()}.${fileExt}`;

      const { error } = await supabase.storage
        .from('documents')
        .upload(fileName, file);

      if (error) throw error;

      // Save doc record
      const { data: publicUrl } = supabase.storage.from('documents').getPublicUrl(fileName);

      await supabase.from('documents').insert({
        load_id: load.id,
        doc_type: 'bol',
        file_name: `POD_${load.reference_number}`,
        file_url: publicUrl.publicUrl
      });

      alert('POD Uploaded Successfully!');
      updateStatus('delivered');

    } catch (error: any) {
      console.error(error);
      alert('Upload failed: ' + error.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-4">
      {/* Header Info */}
      <Card className="bg-zinc-900 border-zinc-800 text-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl flex justify-between items-center">
            Load #{load.reference_number}
            {trackingActive ? (
               <span className="flex items-center text-xs text-emerald-400 bg-emerald-950/50 px-2 py-1 rounded-full border border-emerald-900">
                 <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-2"></span>
                 Live
               </span>
            ) : (
               <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-1 rounded-full">Offline</span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-zinc-950 p-3 rounded-md border border-zinc-800 text-sm">
            <p className="text-zinc-400 mb-1">Equipment</p>
            <p className="font-medium">{load.equipment_type} - {load.weight} lbs</p>
          </div>

          <Button
            className={`w-full font-bold ${trackingActive ? 'bg-red-600 hover:bg-red-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}
            onClick={() => setTrackingActive(!trackingActive)}
            size="lg"
          >
            {trackingActive ? 'Stop Sharing Location' : 'Start Live Tracking'}
          </Button>

          {location && (
            <p className="text-xs text-zinc-500 text-center">
              Current: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Stops */}
      <Card className="bg-zinc-900 border-zinc-800 text-white">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2"><MapPin className="w-5 h-5 text-blue-400"/> Route Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
           {stops.map((stop, i) => (
             <div key={stop.id} className="relative pl-6 border-l-2 border-zinc-800 pb-4 last:border-0 last:pb-0">
               <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-zinc-900 ${stop.stop_type === 'pickup' ? 'bg-blue-500' : 'bg-emerald-500'}`}></div>
               <h4 className="font-semibold text-md">{stop.facility_name}</h4>
               <p className="text-sm text-zinc-400">{stop.address}</p>
               <p className="text-sm text-zinc-400">{stop.city}, {stop.state} {stop.zip}</p>
               {stop.appointment_time && (
                 <p className="text-xs text-amber-400 mt-1">Appt: {new Date(stop.appointment_time).toLocaleString()}</p>
               )}
             </div>
           ))}
        </CardContent>
      </Card>

      {/* Status Update Actions */}
      <Card className="bg-zinc-900 border-zinc-800 text-white">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2"><Navigation2 className="w-5 h-5 text-amber-400"/> Updates</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            variant="outline"
            className={`w-full justify-start ${currentStatus === 'dispatched' ? 'bg-blue-900/20 border-blue-800 text-blue-400' : 'bg-zinc-950 border-zinc-800 text-zinc-300'}`}
            onClick={() => updateStatus('dispatched')}
          >
            <CheckCircle className="w-4 h-4 mr-3 opacity-50" /> Arrived at Pickup
          </Button>
          <Button
            variant="outline"
            className={`w-full justify-start ${currentStatus === 'in_transit' ? 'bg-amber-900/20 border-amber-800 text-amber-400' : 'bg-zinc-950 border-zinc-800 text-zinc-300'}`}
            onClick={() => updateStatus('in_transit')}
          >
            <Navigation className="w-4 h-4 mr-3 opacity-50" /> Loaded & In Transit
          </Button>
          <Button
            variant="outline"
            className={`w-full justify-start ${currentStatus === 'delivered' ? 'bg-emerald-900/20 border-emerald-800 text-emerald-400' : 'bg-zinc-950 border-zinc-800 text-zinc-300'}`}
            onClick={() => updateStatus('delivered')}
          >
            <MapPin className="w-4 h-4 mr-3 opacity-50" /> Arrived at Delivery
          </Button>

          <div className="pt-4 border-t border-zinc-800 mt-4 relative">
             <Button
               className="w-full bg-purple-600 hover:bg-purple-700 font-bold"
               disabled={uploading}
             >
               {uploading ? 'Uploading...' : <><UploadCloud className="w-4 h-4 mr-2"/> Upload POD & Complete</>}
             </Button>
             <input
               type="file"
               accept="image/*"
               capture="environment"
               className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
               onChange={handleFileUpload}
               disabled={uploading}
             />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
