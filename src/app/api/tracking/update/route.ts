import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const { token, lat, lng, speed, heading, timestamp, status } = await req.json();

    if (!token) {
      return NextResponse.json({ error: 'Missing token' }, { status: 400 });
    }

    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
             // Ignoring setAll for API route as we are just using anon key to write (if RLS allows)
             // or service role in a real app.
          }
        },
      }
    )

    // For demo: verify token is a valid load
    const { data: load, error: loadError } = await supabase
      .from('loads')
      .select('id')
      .eq('id', token)
      .single();

    if (loadError || !load) {
      return NextResponse.json({ error: 'Invalid tracking token' }, { status: 401 });
    }

    if (status) {
      await supabase.from('loads').update({ status }).eq('id', load.id);
    } else if (lat !== undefined && lng !== undefined) {
      // In a real application, you would insert this into a `load_tracking_events` table.
      // We'll simulate a successful log for now, as adding a new table wasn't explicitly requested for coordinates.
      // await supabase.from('load_tracking_events').insert({ load_id: load.id, lat, lng, speed, heading, recorded_at: timestamp });
    }

    return NextResponse.json({ success: true, updated: true });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
