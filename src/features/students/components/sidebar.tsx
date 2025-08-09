import React from 'react'
import { StudentProfile } from './student-profile'
import { SidebarNavigation } from './sidebar-navigation'

const Sidebar = () => {
  return (
    <div className='w-full max-w-[300px]'>
        <StudentProfile
          name="John Doe"
          studentId="123456"
          department="Computer Science"
          currentSession="2023/2024"
          currentSemester="Semester 1"
          level="Undergraduate"
        />
      
      <SidebarNavigation />
    </div>
  )
}

export default Sidebar
