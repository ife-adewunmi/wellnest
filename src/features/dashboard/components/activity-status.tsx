import { AlertTriangle, Flag, CheckCircle } from "lucide-react"
import { Card, CardContent } from "@/shared/components/ui/card"

export function ActivityStatus() {
  const activities = [
    {
      icon: AlertTriangle,
      title: "Distress Detected",
      time: "2 days ago",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      iconColor: "text-orange-600",
      titleColor: "text-orange-900",
      timeColor: "text-orange-700",
    },
    {
      icon: Flag,
      title: "Flagged Post",
      time: "3 days ago",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      iconColor: "text-red-600",
      titleColor: "text-red-900",
      timeColor: "text-red-700",
    },
    {
      icon: CheckCircle,
      title: "Normal Activity",
      time: "4 days ago",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      iconColor: "text-green-600",
      titleColor: "text-green-900",
      timeColor: "text-green-700",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {activities.map((activity, index) => {
        const Icon = activity.icon
        return (
          <Card key={index} className={`${activity.borderColor} ${activity.bgColor}`}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Icon className={`h-5 w-5 ${activity.iconColor}`} />
                <div>
                  <p className={`font-medium ${activity.titleColor}`}>{activity.title}</p>
                  <p className={`text-sm ${activity.timeColor}`}>{activity.time}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
