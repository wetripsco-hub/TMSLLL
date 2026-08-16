'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { LoadRow } from '@/types/database.types'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import LoadStatusBadge from './LoadStatusBadge'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, FileText, Link2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from 'next/link'

// Quick actions component
function LoadActions({ load }: { load: LoadRow }) {
  return (
    <div className="flex justify-end gap-2">
      <Link href={`/loads/${load.id}`}>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-zinc-400 hover:text-white">
          <span className="sr-only">View Details</span>
          <FileText className="h-4 w-4" />
        </Button>
      </Link>
      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-zinc-400 hover:text-white" onClick={() => {
        navigator.clipboard.writeText(`https://tms.example.com/tracking/${load.reference_number}`);
        alert('Tracking link copied to clipboard!');
      }}>
        <span className="sr-only">Copy Tracking Link</span>
        <Link2 className="h-4 w-4" />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button variant="ghost" className="h-8 w-8 p-0 text-zinc-400 hover:text-white">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-zinc-950 border-zinc-800 text-zinc-300">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem className="focus:bg-zinc-800 focus:text-white cursor-pointer">
            <Link href={`/loads/${load.id}`}>View Details</Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="focus:bg-zinc-800 focus:text-white cursor-pointer">Assign Carrier</DropdownMenuItem>
          <DropdownMenuSeparator className="bg-zinc-800" />
          <DropdownMenuItem className="focus:bg-zinc-800 focus:text-white cursor-pointer">Change Status</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default function LoadTable() {
  const [loads, setLoads] = useState<LoadRow[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<string>('all')
  const supabase = createClient()

  useEffect(() => {
    async function fetchLoads() {
      setLoading(true)
      const { data, error } = await supabase
        .from('loads')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching loads:', error)
      } else {
        setLoads(data || [])
      }
      setLoading(false)
    }

    fetchLoads()
  }, [])

  const filteredLoads = loads.filter(load => {
    if (activeTab === 'all') return true;
    return load.status === activeTab;
  })

  return (
    <div className="w-full space-y-4">
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-zinc-900 border-zinc-800">
          <TabsTrigger value="all" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white">All Loads</TabsTrigger>
          <TabsTrigger value="available" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white">Available</TabsTrigger>
          <TabsTrigger value="dispatched" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white">Dispatched</TabsTrigger>
          <TabsTrigger value="in_transit" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white">In Transit</TabsTrigger>
          <TabsTrigger value="delivered" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white">Delivered</TabsTrigger>
          <TabsTrigger value="invoiced" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white">Invoiced</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="rounded-md border border-zinc-800 bg-zinc-900/50">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-800 hover:bg-transparent">
              <TableHead className="text-zinc-400">Ref #</TableHead>
              <TableHead className="text-zinc-400">Shipper</TableHead>
              <TableHead className="text-zinc-400">Equipment</TableHead>
              <TableHead className="text-zinc-400">Rate</TableHead>
              <TableHead className="text-zinc-400">Status</TableHead>
              <TableHead className="text-right text-zinc-400">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-zinc-500">Loading loads...</TableCell>
              </TableRow>
            ) : filteredLoads.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-zinc-500">No loads found</TableCell>
              </TableRow>
            ) : (
              filteredLoads.map((load) => (
                <TableRow key={load.id} className="border-zinc-800 hover:bg-zinc-800/50">
                  <TableCell className="font-medium text-white">{load.reference_number}</TableCell>
                  <TableCell className="text-zinc-300">{load.shipper_id}</TableCell>
                  <TableCell className="text-zinc-300">{load.equipment_type}</TableCell>
                  <TableCell className="text-emerald-400 font-medium">${load.shipper_rate.toFixed(2)}</TableCell>
                  <TableCell>
                    <LoadStatusBadge status={load.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <LoadActions load={load} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
