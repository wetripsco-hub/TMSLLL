'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Search, CheckCircle, AlertTriangle, XCircle, ShieldAlert } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { CarrierInsert, CarrierRow } from '@/types/database.types'

type VerificationResult = Omit<CarrierInsert, 'is_active_in_directory'>;

export default function CarrierLookupCard({ onCarrierAdded }: { onCarrierAdded?: () => void }) {
  const [identifier, setIdentifier] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<VerificationResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)

  const handleVerify = async () => {
    if (!identifier) return
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const isMC = identifier.toUpperCase().startsWith('MC') || identifier.length === 6 || identifier.length === 7;
      const paramName = isMC ? 'mc_number' : 'dot_number';
      const response = await fetch(`/api/carrier/verify?${paramName}=${identifier}`)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to verify carrier')
      }

      const data = await response.json()
      setResult(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAddCarrier = async () => {
    if (!result) return
    setAdding(true)

    try {
      const supabase = createClient()

      const carrierData: CarrierInsert = {
        ...result,
        is_active_in_directory: true,
      }

      const { error: dbError } = await supabase
        .from('carriers')
        .insert(carrierData)

      if (dbError) {
        // Handle case where it might already exist, or other db error
        throw new Error('Could not add carrier to directory. They might already exist.')
      }

      alert('Carrier added to directory successfully!')
      setResult(null)
      setIdentifier('')
      if (onCarrierAdded) onCarrierAdded()

    } catch (err: any) {
      alert(err.message)
    } finally {
      setAdding(false)
    }
  }

  return (
    <Card className="bg-zinc-900 border-zinc-800 text-white w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-xl">FMCSA Carrier Verification</CardTitle>
        <CardDescription className="text-zinc-400">Enter DOT or MC Number to verify safety status.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="e.g. 1234567 or MC890123"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="bg-zinc-950 border-zinc-800"
            onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
          />
          <Button onClick={handleVerify} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
            {loading ? 'Verifying...' : <><Search className="w-4 h-4 mr-2"/> Verify</>}
          </Button>
        </div>

        {error && (
          <div className="p-3 bg-red-950/50 border border-red-900 text-red-400 rounded-md text-sm flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {result && (
          <div className="mt-4 space-y-4 border border-zinc-800 rounded-md p-4 bg-zinc-950">
            <div>
              <h3 className="font-bold text-lg">{result.company_name}</h3>
              <p className="text-sm text-zinc-400">DOT: {result.dot_number} | MC: {result.mc_number}</p>
            </div>

            <div className="grid grid-cols-2 gap-y-3 text-sm">
              <div>
                <p className="text-zinc-500 mb-1">Operating Status</p>
                {result.operating_status === 'Active' ? (
                  <Badge className="bg-emerald-900/50 text-emerald-400 hover:bg-emerald-900/50 border-emerald-800"><CheckCircle className="w-3 h-3 mr-1"/> Active</Badge>
                ) : result.operating_status === 'Inactive' ? (
                  <Badge className="bg-amber-900/50 text-amber-400 hover:bg-amber-900/50 border-amber-800"><AlertTriangle className="w-3 h-3 mr-1"/> Inactive</Badge>
                ) : (
                  <Badge className="bg-red-900/50 text-red-400 hover:bg-red-900/50 border-red-800"><XCircle className="w-3 h-3 mr-1"/> Unauthorized</Badge>
                )}
              </div>
              <div>
                <p className="text-zinc-500 mb-1">Safety Rating</p>
                {result.safety_rating === 'Satisfactory' ? (
                  <Badge className="bg-emerald-900/50 text-emerald-400 hover:bg-emerald-900/50 border-emerald-800">{result.safety_rating}</Badge>
                ) : result.safety_rating === 'Conditional' ? (
                  <Badge className="bg-amber-900/50 text-amber-400 hover:bg-amber-900/50 border-amber-800">{result.safety_rating}</Badge>
                ) : result.safety_rating === 'Unsatisfactory' ? (
                  <Badge className="bg-red-900/50 text-red-400 hover:bg-red-900/50 border-red-800">{result.safety_rating}</Badge>
                ) : (
                  <Badge className="bg-zinc-800 text-zinc-400 hover:bg-zinc-800 border-zinc-700">None</Badge>
                )}
              </div>
              <div className="col-span-2">
                 <p className="text-zinc-500 mb-1">Insurance</p>
                 <div className="flex items-center gap-2">
                   {result.insurance_on_file ? (
                     <Badge className="bg-emerald-900/50 text-emerald-400 hover:bg-emerald-900/50 border-emerald-800">On File</Badge>
                   ) : (
                     <Badge className="bg-red-900/50 text-red-400 hover:bg-red-900/50 border-red-800">Missing</Badge>
                   )}
                   {result.insurance_expiry_date && (
                     <span className="text-xs text-zinc-400">Exp: {new Date(result.insurance_expiry_date).toLocaleDateString()}</span>
                   )}
                 </div>
              </div>
            </div>

            {(result.operating_status !== 'Active' || result.safety_rating === 'Unsatisfactory' || !result.insurance_on_file) && (
              <div className="p-2 bg-amber-950/30 border border-amber-900/50 text-amber-400/90 rounded text-xs flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <p>Warning: This carrier has compliance issues. Review carefully before adding to directory.</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
      {result && (
        <CardFooter>
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700"
            onClick={handleAddCarrier}
            disabled={adding}
          >
            {adding ? 'Adding...' : 'Add to Carrier Directory'}
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
