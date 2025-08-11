import { Lightbulb } from 'lucide-react'
import { Card, CardContent } from '@/shared/components/ui/card'

export function InsightCard() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start space-x-3">
          <Lightbulb className="mt-0.5 h-5 w-5 text-yellow-600" />
          <div>
            <h3 className="mb-1 font-medium text-gray-900">Insight</h3>
            <h4 className="mb-2 font-medium text-gray-800">
              Mood drops below average after 4+ hrs screen-time
            </h4>
            <p className="text-sm text-gray-600">
              Consider discussing healthy screen time habits and alternative activities.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
