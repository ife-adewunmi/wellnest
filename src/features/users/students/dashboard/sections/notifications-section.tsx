import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'

export function StudentNotificationsSection() {
  return (
    <div className="mt-6">
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-500">No notifications yet.</div>
        </CardContent>
      </Card>
    </div>
  )
}
