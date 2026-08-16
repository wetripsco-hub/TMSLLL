import { Badge } from "@/components/ui/badge"
import { LoadStatus } from "@/types/database.types"

interface LoadStatusBadgeProps {
  status: LoadStatus | string
}

export default function LoadStatusBadge({ status }: LoadStatusBadgeProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available':
        return 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
      case 'dispatched':
        return 'bg-blue-900 text-blue-300 hover:bg-blue-800'
      case 'in_transit':
      case 'in transit':
        return 'bg-amber-900 text-amber-300 hover:bg-amber-800'
      case 'delivered':
        return 'bg-emerald-900 text-emerald-300 hover:bg-emerald-800'
      case 'invoiced':
        return 'bg-purple-900 text-purple-300 hover:bg-purple-800'
      case 'cancelled':
        return 'bg-red-900 text-red-300 hover:bg-red-800'
      default:
        return 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
    }
  }

  const formatStatus = (status: string) => {
    return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  }

  return (
    <Badge className={`${getStatusColor(status)} border-0 font-medium`}>
      {formatStatus(status)}
    </Badge>
  )
}
