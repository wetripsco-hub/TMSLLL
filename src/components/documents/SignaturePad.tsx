'use client'

import { useRef, useState } from 'react'
import SignatureCanvas from 'react-signature-canvas'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2 } from 'lucide-react'

interface SignaturePadProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (signatureBase64: string) => Promise<void>
  title?: string
  description?: string
}

export default function SignaturePad({
  open,
  onOpenChange,
  onSave,
  title = "Sign Document",
  description = "Please provide your signature below to agree to the terms.",
}: SignaturePadProps) {
  const sigCanvas = useRef<SignatureCanvas>(null)
  const [isSaving, setIsSaving] = useState(false)

  const clear = () => {
    sigCanvas.current?.clear()
  }

  const save = async () => {
    if (sigCanvas.current?.isEmpty()) {
      alert("Please provide a signature first.")
      return
    }

    setIsSaving(true)
    try {
      // Get a transparent PNG data URL
      const dataURL = sigCanvas.current?.getTrimmedCanvas().toDataURL('image/png')
      if (dataURL) {
        await onSave(dataURL)
      }
    } catch (error) {
      console.error("Failed to save signature", error)
      alert("Failed to save signature. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(val) => !isSaving && onOpenChange(val)}>
      <DialogContent className="sm:max-w-md bg-zinc-950 border-zinc-800 text-white">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="text-zinc-400">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 border-2 border-dashed border-zinc-700 bg-white rounded-md overflow-hidden touch-none relative h-48">
          <SignatureCanvas
            ref={sigCanvas}
            penColor="black"
            canvasProps={{
              className: "w-full h-full",
              style: { touchAction: 'none' } // Important for mobile devices
            }}
          />
        </div>

        <DialogFooter className="flex sm:justify-between items-center mt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={clear}
            disabled={isSaving}
            className="text-zinc-400 hover:text-white"
          >
            Clear
          </Button>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSaving}
              className="bg-transparent border-zinc-700 text-white hover:bg-zinc-800"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={save}
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isSaving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : 'Sign & Submit'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
