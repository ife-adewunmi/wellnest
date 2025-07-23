import { Badge } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export function DistressScore() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-gray-600">Distress Score</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Medium</h2>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-sm text-gray-600">Current</span>
              <Badge  className="bg-green-100 text-green-800">
                +5%
              </Badge>
            </div>
          </div>

          <div className="space-y-2">
            <div className="h-3 bg-gradient-to-r from-green-400 via-yellow-400 to-red-400 rounded-full"></div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Low</span>
              <span>Medium</span>
              <span>High</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
