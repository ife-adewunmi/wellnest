import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'

export function RecentPost() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Recent Post</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-r border-l-4 border-blue-400 bg-blue-50 p-4">
          <p className="text-sm leading-relaxed text-gray-700">
            I'm feeling so overwhelmed with everything right now. I don't know how much longer I can
            keep going.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
