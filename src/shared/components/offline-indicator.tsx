'use client'

import { useOfflineStorage } from '@/hooks/use-offline-storage'
import { Badge } from '@/components/ui/badge'
import { WifiOff, Clock } from 'lucide-react'

export function OfflineIndicator() {
  const { isOnline, pendingSync } = useOfflineStorage()

  if (isOnline && pendingSync.length === 0) return null

  return (
    <div className="fixed right-4 bottom-4 z-50">
      {!isOnline ? (
        <Badge variant="destructive" className="flex items-center gap-2">
          <WifiOff className="h-3 w-3" />
          Offline
        </Badge>
      ) : pendingSync.length > 0 ? (
        <Badge variant="secondary" className="flex items-center gap-2">
          <Clock className="h-3 w-3" />
          Syncing {pendingSync.length} items...
        </Badge>
      ) : null}
    </div>
  )
}
