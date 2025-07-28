import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";

export function RecentPost() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Recent Post</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r">
          <p className="text-gray-700 text-sm leading-relaxed">
            I'm feeling so overwhelmed with everything right now. I don't know how much longer I can keep going.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
