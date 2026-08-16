import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import { LoadRow } from '@/types/database.types'
import LoadStatusBadge from '@/components/loads/LoadStatusBadge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MapPin, FileText, Truck, DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default async function LoadDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
      },
    }
  )

  const { data: load, error: loadError } = await supabase
    .from('loads')
    .select('*')
    .eq('id', params.id)
    .single()

  if (loadError || !load) {
    notFound()
  }

  const { data: stops, error: stopsError } = await supabase
    .from('load_stops')
    .select('*')
    .eq('load_id', load.id)
    .order('stop_sequence', { ascending: true })

  if (stopsError) {
    console.error('Error fetching stops:', stopsError)
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-bold text-white">{load.reference_number}</h1>
            <LoadStatusBadge status={load.status} />
          </div>
          <p className="text-zinc-400">Created on {new Date(load.created_at).toLocaleDateString()}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="bg-transparent border-zinc-700 text-white hover:bg-zinc-800">
            Edit Load
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            Change Status
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Details & Financials */}
        <div className="lg:col-span-2 space-y-6">

          {/* Route & Stops */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="border-b border-zinc-800 pb-4">
              <CardTitle className="text-xl text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-400" />
                Route Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6 relative">
                {stops && stops.length > 0 ? (
                  <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-zinc-800 z-0"></div>
                ) : null}

                {stops?.map((stop, index) => (
                  <div key={stop.id} className="flex gap-4 relative z-10">
                    <div className="flex-shrink-0 mt-1">
                      <div className={`w-12 h-12 rounded-full flex flex-col items-center justify-center border-4 border-zinc-900 ${index === 0 ? 'bg-blue-600/20 text-blue-400' : index === stops.length - 1 ? 'bg-emerald-600/20 text-emerald-400' : 'bg-orange-600/20 text-orange-400'}`}>
                        <span className="text-xs font-bold uppercase">{stop.stop_type.slice(0, 3)}</span>
                        <span className="text-xs">{index + 1}</span>
                      </div>
                    </div>
                    <div className="flex-1 bg-zinc-950 p-4 rounded-lg border border-zinc-800">
                      <h4 className="font-semibold text-white mb-2">{stop.facility_name}</h4>
                      <p className="text-zinc-400 text-sm mb-1">{stop.address}</p>
                      <p className="text-zinc-400 text-sm">{stop.city}, {stop.state} {stop.zip}</p>
                      {stop.appointment_time && (
                        <div className="mt-3 pt-3 border-t border-zinc-800">
                          <p className="text-sm text-zinc-300">
                            <span className="text-zinc-500 mr-2">Appt:</span>
                            {new Date(stop.appointment_time).toLocaleString()}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Financials */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="border-b border-zinc-800 pb-4">
              <CardTitle className="text-xl text-white flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-400" />
                Financial Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800">
                  <p className="text-sm text-zinc-500 mb-1">Shipper Rate</p>
                  <p className="text-2xl font-bold text-white">${load.shipper_rate.toFixed(2)}</p>
                </div>
                <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800">
                  <p className="text-sm text-zinc-500 mb-1">Carrier Rate</p>
                  <p className="text-2xl font-bold text-white">
                    {load.carrier_rate ? `$${load.carrier_rate.toFixed(2)}` : 'N/A'}
                  </p>
                </div>
                <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800">
                  <p className="text-sm text-zinc-500 mb-1">Margin ($)</p>
                  <p className="text-2xl font-bold text-emerald-400">
                    {load.margin_amount !== null ? `$${load.margin_amount.toFixed(2)}` : 'N/A'}
                  </p>
                </div>
                <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800">
                  <p className="text-sm text-zinc-500 mb-1">Margin (%)</p>
                  <p className="text-2xl font-bold text-emerald-400">
                    {load.margin_percentage !== null ? `${load.margin_percentage.toFixed(1)}%` : 'N/A'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Freight Details */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="border-b border-zinc-800 pb-4">
              <CardTitle className="text-lg text-white">Freight Details</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div>
                <p className="text-sm text-zinc-500">Equipment Type</p>
                <p className="font-medium text-white">{load.equipment_type}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-500">Commodity</p>
                <p className="font-medium text-white">{load.commodity}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-zinc-500">Weight</p>
                  <p className="font-medium text-white">{load.weight.toLocaleString()} lbs</p>
                </div>
                <div>
                  <p className="text-sm text-zinc-500">Temp</p>
                  <p className="font-medium text-white">{load.temperature ? `${load.temperature}°F` : 'N/A'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Carrier Info */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="border-b border-zinc-800 pb-4">
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <Truck className="w-5 h-5 text-zinc-400" />
                Carrier Assignment
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {load.carrier_id ? (
                <div>
                  <p className="font-medium text-white mb-1">Carrier ID: {load.carrier_id}</p>
                  <p className="text-sm text-blue-400 hover:underline cursor-pointer">View Carrier Profile</p>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-zinc-500 mb-4">No carrier assigned yet</p>
                  <Button className="w-full bg-zinc-800 hover:bg-zinc-700 text-white">
                    Assign Carrier
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Documents */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="border-b border-zinc-800 pb-4">
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-zinc-400" />
                Documents
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-center py-6 border-2 border-dashed border-zinc-800 rounded-lg">
                <p className="text-zinc-500 mb-2">No documents attached</p>
                <Button variant="link" className="text-blue-400">Upload Rate Con / BOL</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
