"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/avatar"
import { Eye, MessageSquare, Calendar } from "lucide-react"

export function StudentsTable() {
  const students = [
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.j@university.edu",
      department: "Computer Science",
      level: "Undergraduate",
      riskLevel: "HIGH",
      lastCheckIn: "2 hours ago",
      moodTrend: "Declining",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: 2,
      name: "Mike Chen",
      email: "mike.c@university.edu",
      department: "Engineering",
      level: "Graduate",
      riskLevel: "MEDIUM",
      lastCheckIn: "1 day ago",
      moodTrend: "Stable",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: 3,
      name: "Emma Wilson",
      email: "emma.w@university.edu",
      department: "Psychology",
      level: "Undergraduate",
      riskLevel: "LOW",
      lastCheckIn: "3 hours ago",
      moodTrend: "Improving",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: 4,
      name: "Alex Brown",
      email: "alex.b@university.edu",
      department: "Business",
      level: "Graduate",
      riskLevel: "MEDIUM",
      lastCheckIn: "5 hours ago",
      moodTrend: "Stable",
      avatar: "/placeholder.svg?height=32&width=32",
    },
  ]

  const getRiskBadgeVariant = (risk: string) => {
    switch (risk) {
      case "HIGH":
        return "destructive"
      case "MEDIUM":
        return "default"
      case "LOW":
        return "secondary"
      default:
        return "secondary"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Students Overview</CardTitle>
        <CardDescription>Monitor and manage your assigned students</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {students.map((student) => (
            <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={student.avatar || "/placeholder.svg"} alt={student.name} />
                  <AvatarFallback>
                    {student.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium">{student.name}</h4>
                  <p className="text-sm text-muted-foreground">{student.email}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs text-muted-foreground">{student.department}</span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">{student.level}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <Badge variant={getRiskBadgeVariant(student.riskLevel) as any}>{student.riskLevel}</Badge>
                  <p className="text-xs text-muted-foreground mt-1">Last: {student.lastCheckIn}</p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Calendar className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
