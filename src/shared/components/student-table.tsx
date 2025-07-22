"use client"

import * as React from "react"
import { Button } from "./ui/custom-button"
import { interBold, interMedium, interRegular } from "@/fonts"

interface Student {
  id: string
  studentId: string
  lastCheckIn: string
  riskLevel: "High" | "Medium" | "Low"
  mood: string
  screenTime: string
}

export function StudentTable() {
  const allStudents: Student[] = [
    {
      id: "1",
      studentId: "CSC/20/19283",
      lastCheckIn: "1 week",
      riskLevel: "High",
      mood: "Happy",
      screenTime: "2 hours",
    },
    {
      id: "2",
      studentId: "BOT/21/7547",
      lastCheckIn: "2 days",
      riskLevel: "Medium",
      mood: "Neutral",
      screenTime: "4 hours",
    },
    {
      id: "3",
      studentId: "MCB/25/17293",
      lastCheckIn: "3 weeks",
      riskLevel: "High",
      mood: "Sad",
      screenTime: "1 hour",
    },
    {
      id: "4",
      studentId: "BCH/20/92822",
      lastCheckIn: "Yesterday",
      riskLevel: "Medium",
      mood: "Angry",
      screenTime: "5 hours",
    },
    {
      id: "5",
      studentId: "APH/20/8222",
      lastCheckIn: "1 hour",
      riskLevel: "Low",
      mood: "Neutral",
      screenTime: "3 hours",
    },
    {
      id: "6",
      studentId: "EEE/24/87932",
      lastCheckIn: "30 minutes",
      riskLevel: "Low",
      mood: "Happy",
      screenTime: "2 hours",
    },
    {
      id: "7",
      studentId: "PHY/22/45678",
      lastCheckIn: "2 hours",
      riskLevel: "Medium",
      mood: "Worried",
      screenTime: "6 hours",
    },
    {
      id: "8",
      studentId: "CHE/21/98765",
      lastCheckIn: "4 days",
      riskLevel: "High",
      mood: "Depressed",
      screenTime: "8 hours",
    },
    {
      id: "9",
      studentId: "BIO/23/11223",
      lastCheckIn: "6 hours",
      riskLevel: "Low",
      mood: "Content",
      screenTime: "1.5 hours",
    },
    {
      id: "10",
      studentId: "MAT/22/33445",
      lastCheckIn: "3 hours",
      riskLevel: "Medium",
      mood: "Happy",
      screenTime: "2.5 hours",
    },
    {
      id: "11",
      studentId: "ENG/21/55667",
      lastCheckIn: "5 days",
      riskLevel: "High",
      mood: "Stressed",
      screenTime: "7 hours",
    },
    {
      id: "12",
      studentId: "HIS/23/77889",
      lastCheckIn: "1 day",
      riskLevel: "Low",
      mood: "Calm",
      screenTime: "1 hour",
    },
    {
      id: "13",
      studentId: "GEO/24/99001",
      lastCheckIn: "2 weeks",
      riskLevel: "High",
      mood: "Anxious",
      screenTime: "9 hours",
    },
    {
      id: "14",
      studentId: "ART/22/11223",
      lastCheckIn: "4 hours",
      riskLevel: "Medium",
      mood: "Creative",
      screenTime: "3 hours",
    },
    {
      id: "15",
      studentId: "MUS/21/44556",
      lastCheckIn: "6 hours",
      riskLevel: "Low",
      mood: "Joyful",
      screenTime: "2 hours",
    },
  ]

  const [showAll, setShowAll] = React.useState(false)

  // Show first 10 items by default, all items when showAll is true
  const displayedStudents = showAll ? allStudents : allStudents.slice(0, 10)

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case "High":
        return "py-[8px] w-[86px] text-[12px] bg-[#FED7D7B2] rounded-full"
      case "Medium":
        return "py-[8px] w-[86px] text-[12px] bg-[#FEFCBFB2] rounded-full"
      case "Low":
        return "py-[8px] w-[86px] text-[12px] bg-[#C6F6D5B2] rounded-full"
      default:
        return "py-[8px] w-[86px] text-[12px] bg-[#FED7D7B2] rounded-full"
    }
  }

  return (
    <div className="mt-[5rem]">
      <div className="flex flex-row items-center justify-between">
        <h1 className={`${interBold.className} text-[#121417] text-[1.25rem] `}>Student Table</h1>
        <Button variant="ghost" className={`${interMedium.className} text-[#4A5568] text-[0.875rem]`}  onClick={() => setShowAll(!showAll)}>
          {showAll ? "Show less" : "View all"}
        </Button>
      </div>
      <div className="mt-[25px]">
        <div className={`border rounded-[12px] border-[#CBD5E0] overflow-x-auto ${showAll ? "max-h-96 overflow-y-auto" : ""}`}>
          <table className="w-full border rounded-[12px] border-[#CBD5E0]">
            <thead>
              <tr className="border-b border-[#CBD5E0] ">
                <th className={`py-[12px] pl-[2rem] text-left ${interRegular.className} text-[#121417] text-[0.875rem]`}>Student ID</th>
                <th className={`py-[12px]  text-left ${interRegular.className} text-[#121417] text-[0.875rem]`}>Last check-in</th>
                <th className={`py-[12px]  text-left ${interRegular.className} text-[#121417] text-[0.875rem] pl-[11px]`}>Risk level</th>
                <th className={`py-[12px]  text-left ${interRegular.className} text-[#121417] text-[0.875rem]`}>Mood</th>
                <th className={`py-[12px]  text-left ${interRegular.className} text-[#121417] text-[0.875rem]`}>Screen time</th>
              </tr>
            </thead>
            <tbody>
              {displayedStudents.map((student) => (
                <tr key={student.id} className="border-b border-[#CBD5E0]">
                  <td className={`py-[1.625rem] pl-[2rem] ${interRegular.className} text-[#121417] text-[0.875rem]`}>{student.studentId}</td>
                  <td className={`py-[1.625rem]  ${interRegular.className} text-[#61758A] text-[0.875rem]`}>{student.lastCheckIn}</td>
                  <td className="">
                    <span className={`flex justify-center ${interMedium.className} ${getRiskLevelColor(student.riskLevel)} text-[#121417] text-[0.875rem]`} >{student.riskLevel}</span>
                  </td>
                  <td className={`py-[1.625rem]  ${interRegular.className} text-[#61758A] text-[0.875rem]`}>{student.mood}</td>
                  <td className={`py-[1.625rem]  ${interRegular.className} text-[#61758A] text-[0.875rem]`}>{student.screenTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}