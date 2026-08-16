import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import DriverGpsTracker from '@/components/tracking/DriverGpsTracker'

export default async function TrackPage(props: { params: Promise<{ token: string }> }) {
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

  // For demo, the token is just the load ID.
  const { data: load, error: loadError } = await supabase
    .from('loads')
    .select('*')
    .eq('id', params.token)
    .single()

  if (loadError || !load) {
    notFound()
  }

  const { data: stops } = await supabase
    .from('load_stops')
    .select('*')
    .eq('load_id', load.id)
    .order('stop_sequence', { ascending: true })

  return (
    <div className="min-h-screen bg-black">
      <div className="bg-blue-600 w-full p-4 text-center sticky top-0 z-50 shadow-md">
        <h1 className="text-white font-bold text-lg">TMS Live Tracking</h1>
      </div>
      <div className="py-6">
        <DriverGpsTracker load={load} stops={stops || []} token={params.token} />
      </div>
    </div>
  )
}
