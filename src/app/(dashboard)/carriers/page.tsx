'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { CarrierRow } from '@/types/database.types'
import CarrierLookupCard from '@/components/carriers/CarrierLookupCard'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { CheckCircle, AlertTriangle, XCircle, MoreHorizontal } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function CarriersPage() {
  const [carriers, setCarriers] = useState<CarrierRow[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchCarriers = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('carriers')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching carriers:', error)
    } else {
      setCarriers(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchCarriers()
  }, [])

  const toggleCarrierStatus = async (id: string, currentStatus: boolean) => {
    // Optimistic update
    setCarriers(carriers.map(c => c.id === id ? { ...c, is_active_in_directory: !currentStatus } : c))

    const { error } = await supabase
      .from('carriers')
      .update({ is_active_in_directory: !currentStatus })
      .eq('id', id)

    if (error) {
      console.error('Error updating carrier status:', error)
      // Revert on error
      fetchCarriers()
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Carrier Directory</h1>
        <p className="text-zinc-400">Verify FMCSA compliance and manage your active carriers.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <CarrierLookupCard onCarrierAdded={fetchCarriers} />
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-md border border-zinc-800 bg-zinc-900 overflow-hidden">
            <Table>
              <TableHeader className="bg-zinc-950">
                <TableRow className="border-zinc-800 hover:bg-transparent">
                  <TableHead className="text-zinc-400">Company</TableHead>
                  <TableHead className="text-zinc-400">Compliance</TableHead>
                  <TableHead className="text-zinc-400">Insurance Exp.</TableHead>
                  <TableHead className="text-center text-zinc-400">Assigned Loads</TableHead>
                  <TableHead className="text-center text-zinc-400">Active</TableHead>
                  <TableHead className="text-right text-zinc-400">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-zinc-500">Loading directory...</TableCell>
                  </TableRow>
                ) : carriers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-zinc-500">No carriers in directory yet.</TableCell>
                  </TableRow>
                ) : (
                  carriers.map((carrier) => (
                    <TableRow key={carrier.id} className="border-zinc-800 hover:bg-zinc-800/50">
                      <TableCell>
                        <div className="font-medium text-white">{carrier.company_name}</div>
                        <div className="text-xs text-zinc-500">MC: {carrier.mc_number}</div>
                      </TableCell>
                      <TableCell>
                        {carrier.operating_status === 'Active' && carrier.safety_rating === 'Satisfactory' && carrier.insurance_on_file ? (
                           <Badge className="bg-emerald-900/50 text-emerald-400 border-emerald-800"><CheckCircle className="w-3 h-3 mr-1"/> Compliant</Badge>
                        ) : (
                           <Badge className="bg-amber-900/50 text-amber-400 border-amber-800"><AlertTriangle className="w-3 h-3 mr-1"/> Review</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-zinc-300">
                        {carrier.insurance_expiry_date ? new Date(carrier.insurance_expiry_date).toLocaleDateString() : 'Missing'}
                      <TableCell className="text-center text-zinc-300">{carrier.assigned_load_count}</TableCell>
                      </TableCell>
                      <TableCell className="text-center">
                        <Switch
                          checked={carrier.is_active_in_directory}
                          onCheckedChange={() => toggleCarrierStatus(carrier.id, carrier.is_active_in_directory)}
                          className="data-[state=checked]:bg-blue-600"
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <Button variant="ghost" className="h-8 w-8 p-0 text-zinc-400 hover:text-white">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-zinc-950 border-zinc-800 text-zinc-300">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem className="focus:bg-zinc-800 focus:text-white cursor-pointer">View Profile</DropdownMenuItem>
                            <DropdownMenuItem className="focus:bg-zinc-800 focus:text-white cursor-pointer" disabled={!carrier.is_active_in_directory}>Assign to Load</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  )
}
