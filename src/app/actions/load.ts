'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { LoadInsert, LoadStopInsert } from '@/types/database.types'

export async function createLoad(
  loadData: Omit<LoadInsert, 'reference_number'>,
  stopsData: Omit<LoadStopInsert, 'load_id' | 'stop_sequence'>[]
) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )

  // 1. Generate reference number
  const referenceNumber = `LD-${Math.floor(Math.random() * 100000)}`

  // 2. Insert load
  const { data: load, error: loadError } = await supabase
    .from('loads')
    .insert({ ...loadData, reference_number: referenceNumber })
    .select()
    .single()

  if (loadError) {
    console.error('Error creating load:', loadError)
    throw new Error('Failed to create load')
  }

  // 3. Insert stops
  const stopsToInsert: LoadStopInsert[] = stopsData.map((stop, index) => ({
    ...stop,
    load_id: load.id,
    stop_sequence: index + 1,
  }))

  const { error: stopsError } = await supabase
    .from('load_stops')
    .insert(stopsToInsert)

  if (stopsError) {
    console.error('Error creating stops:', stopsError)
    // Optional: Rollback load creation or let it happen in a transaction via an rpc if you'd write one,
    // but without an RPC this is a sequential insert.
    throw new Error('Failed to create stops')
  }

  return { load, success: true }
}
