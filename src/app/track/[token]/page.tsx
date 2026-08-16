import { MapPin } from 'lucide-react';

export default function TrackingPage({ params }: { params: { token: string } }) {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center shadow-xl">
        <MapPin className="h-12 w-12 text-blue-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">Driver Tracking</h1>
        <p className="text-zinc-400 mb-6">Token: {params.token}</p>
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors">
          Share Current Location
        </button>
      </div>
    </div>
  );
}
