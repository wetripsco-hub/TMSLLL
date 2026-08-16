'use client'

import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { createLoad } from '@/app/actions/load'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Trash2, Plus } from 'lucide-react'
import { useMemo } from 'react'
import { LoadStatus, EquipmentType } from '@/types/database.types'

const stopSchema = z.object({
  stop_type: z.enum(['pickup', 'delivery']),
  facility_name: z.string().min(1, 'Required'),
  address: z.string().min(1, 'Required'),
  city: z.string().min(1, 'Required'),
  state: z.string().min(2, 'Required').max(2),
  zip: z.string().min(1, 'Required'),
  appointment_time: z.string().nullable().optional(),
})

const loadSchema = z.object({
  shipper_id: z.string().min(1, 'Required'),
  equipment_type: z.enum(['Dry Van', 'Reefer', 'Flatbed', 'Step Deck', 'Power Only', 'Other'] as const),
  commodity: z.string().min(1, 'Required'),
  weight: z.number().min(1, 'Required'),
  temperature: z.number().optional().nullable(),
  shipper_rate: z.number().min(0),
  carrier_rate: z.number().min(0).optional().nullable(),
  stops: z.array(stopSchema).min(2, 'Must have at least an origin and destination'),
})

type LoadFormValues = z.infer<typeof loadSchema>

export default function MultiStopForm() {
  const form = useForm<LoadFormValues>({
    resolver: zodResolver(loadSchema),
    defaultValues: {
      shipper_id: '',
      equipment_type: 'Dry Van',
      commodity: '',
      weight: 0,
      temperature: null,
      shipper_rate: 0,
      carrier_rate: null,
      stops: [
        { stop_type: 'pickup', facility_name: '', address: '', city: '', state: '', zip: '', appointment_time: '' },
        { stop_type: 'delivery', facility_name: '', address: '', city: '', state: '', zip: '', appointment_time: '' },
      ],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'stops',
  })

  const shipperRate = form.watch('shipper_rate')
  const carrierRate = form.watch('carrier_rate')

  const { margin, marginPercentage } = useMemo(() => {
    const sRate = Number(shipperRate) || 0
    const cRate = Number(carrierRate) || 0

    if (sRate === 0) return { margin: 0, marginPercentage: 0 }

    const marg = sRate - cRate
    const margPerc = (marg / sRate) * 100

    return { margin: marg, marginPercentage: margPerc }
  }, [shipperRate, carrierRate])

  const onSubmit = async (data: LoadFormValues) => {
    try {
      const loadData = {
        shipper_id: data.shipper_id,
        equipment_type: data.equipment_type as EquipmentType,
        commodity: data.commodity,
        weight: data.weight,
        temperature: data.temperature || null,
        shipper_rate: data.shipper_rate,
        carrier_rate: data.carrier_rate || null,
        margin_amount: margin,
        margin_percentage: marginPercentage,
        status: 'available' as LoadStatus,
        carrier_id: null,
      }

      await createLoad(loadData, data.stops.map(s => ({...s, appointment_time: s.appointment_time || null})))
      alert('Load created successfully!')
      form.reset()
    } catch (error) {
      console.error('Failed to submit load:', error)
      alert('Error creating load')
    }
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 max-w-4xl mx-auto text-white">
      <h2 className="text-2xl font-bold mb-6">Create New Load</h2>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Load Details Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-zinc-300 border-b border-zinc-800 pb-2">Load Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Shipper ID</Label>
              <Input {...form.register('shipper_id')} className="bg-zinc-950 border-zinc-800" placeholder="SHP-123" />
            </div>

            <div className="space-y-2">
              <Label>Equipment Type</Label>
              <Controller
                control={form.control}
                name="equipment_type"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className="bg-zinc-950 border-zinc-800">
                      <SelectValue placeholder="Select equipment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Dry Van">Dry Van</SelectItem>
                      <SelectItem value="Reefer">Reefer</SelectItem>
                      <SelectItem value="Flatbed">Flatbed</SelectItem>
                      <SelectItem value="Step Deck">Step Deck</SelectItem>
                      <SelectItem value="Power Only">Power Only</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label>Commodity</Label>
              <Input {...form.register('commodity')} className="bg-zinc-950 border-zinc-800" placeholder="e.g. Electronics" />
            </div>

            <div className="space-y-2">
              <Label>Weight (lbs)</Label>
              <Input type="number" {...form.register('weight', { valueAsNumber: true })} className="bg-zinc-950 border-zinc-800" />
            </div>

            <div className="space-y-2">
              <Label>Temperature (F) - Optional</Label>
              <Input type="number" {...form.register('temperature', { valueAsNumber: true })} className="bg-zinc-950 border-zinc-800" />
            </div>
          </div>
        </div>

        {/* Financials Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-zinc-300 border-b border-zinc-800 pb-2">Financials</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="space-y-2">
              <Label>Shipper Rate ($)</Label>
              <Input type="number" step="0.01" {...form.register('shipper_rate', { valueAsNumber: true })} className="bg-zinc-950 border-zinc-800" />
            </div>
            <div className="space-y-2">
              <Label>Carrier Rate ($)</Label>
              <Input type="number" step="0.01" {...form.register('carrier_rate', { valueAsNumber: true })} className="bg-zinc-950 border-zinc-800" />
            </div>
            <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-md flex flex-col justify-center">
              <span className="text-xs text-zinc-400">Margin</span>
              <span className="font-medium text-emerald-400">${margin.toFixed(2)}</span>
            </div>
            <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-md flex flex-col justify-center">
              <span className="text-xs text-zinc-400">Margin %</span>
              <span className="font-medium text-emerald-400">{marginPercentage.toFixed(1)}%</span>
            </div>
          </div>
        </div>

        {/* Stops Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
            <h3 className="text-lg font-semibold text-zinc-300">Route Stops</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ stop_type: 'delivery', facility_name: '', address: '', city: '', state: '', zip: '', appointment_time: '' })}
              className="bg-transparent border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
            >
              <Plus className="w-4 h-4 mr-2" /> Add Stop
            </Button>
          </div>

          <div className="space-y-6">
            {fields.map((field, index) => (
              <div key={field.id} className="p-4 bg-zinc-950 border border-zinc-800 rounded-lg relative">
                {index > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 text-red-400 hover:text-red-300 hover:bg-red-950/30"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}

                <div className="flex items-center gap-2 mb-4">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${index === 0 ? 'bg-blue-600' : index === fields.length - 1 ? 'bg-emerald-600' : 'bg-orange-600'}`}>
                    {index + 1}
                  </div>
                  <Controller
                    control={form.control}
                    name={`stops.${index}.stop_type`}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className="w-[120px] h-8 bg-zinc-900 border-zinc-800 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pickup">Pickup</SelectItem>
                          <SelectItem value="delivery">Delivery</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-zinc-400">Facility Name</Label>
                    <Input {...form.register(`stops.${index}.facility_name`)} className="bg-zinc-900 border-zinc-800" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-zinc-400">Address</Label>
                    <Input {...form.register(`stops.${index}.address`)} className="bg-zinc-900 border-zinc-800" />
                  </div>
                  <div className="grid grid-cols-3 gap-2 md:col-span-2">
                    <div className="space-y-2 col-span-1">
                      <Label className="text-xs text-zinc-400">City</Label>
                      <Input {...form.register(`stops.${index}.city`)} className="bg-zinc-900 border-zinc-800" />
                    </div>
                    <div className="space-y-2 col-span-1">
                      <Label className="text-xs text-zinc-400">State (2-letter)</Label>
                      <Input {...form.register(`stops.${index}.state`)} maxLength={2} className="bg-zinc-900 border-zinc-800 uppercase" />
                    </div>
                    <div className="space-y-2 col-span-1">
                      <Label className="text-xs text-zinc-400">Zip</Label>
                      <Input {...form.register(`stops.${index}.zip`)} className="bg-zinc-900 border-zinc-800" />
                    </div>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-xs text-zinc-400">Appointment Time</Label>
                    <Input type="datetime-local" {...form.register(`stops.${index}.appointment_time`)} className="bg-zinc-900 border-zinc-800 w-full md:w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8">
            Create Load
          </Button>
        </div>
      </form>
    </div>
  )
}
