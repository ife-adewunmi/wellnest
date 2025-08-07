// src/shared/db/seed.ts
import { db } from './index'
import { users } from './schema'
import bcrypt from 'bcryptjs'

async function seed() {
  console.log('🌱 Starting database seeding...')

  try {
    // Hash passwords
    const studentPassword = await bcrypt.hash('student123', 12)
    const counselorPassword = await bcrypt.hash('counselor123', 12)

    // Insert seed users
    const seedUsers = await db
      .insert(users)
      .values([
        {
          email: 'student@wellnest.com',
          firstName: 'John',
          lastName: 'Student',
          role: 'STUDENT',
          password: studentPassword,
          department: 'Computer Science',
          studentId: 'CS2024001',
          level: '300',
          gender: 'Male',
          phoneNumber: '+1234567890',
          emailVerified: true,
          isActive: true,
          settings: {
            notifications: {
              moodDrop: true,
              riskLevelChange: true,
              missedCheckIn: true,
              pushNotification: true,
              emailNotification: true,
              smsNotification: false,
            },
            dashboard: {
              moodTracker: true,
              screenTimeTracker: true,
              socialMediaActivity: true,
              notificationWidget: true,
              upcomingSessions: true,
              studentTable: true,
            },
          },
        },
        {
          email: 'counselor@wellnest.com',
          firstName: 'Dr. Sarah',
          lastName: 'Johnson',
          role: 'COUNSELOR',
          password: counselorPassword,
          department: 'Student Affairs',
          phoneNumber: '+1234567891',
          emailVerified: true,
          isActive: true,
          settings: {
            notifications: {
              moodDrop: true,
              riskLevelChange: true,
              missedCheckIn: true,
              pushNotification: true,
              emailNotification: true,
              smsNotification: true,
            },
            dashboard: {
              moodTracker: true,
              screenTimeTracker: true,
              socialMediaActivity: true,
              notificationWidget: true,
              upcomingSessions: true,
              studentTable: true,
            },
          },
        },
      ])
      .returning()

    console.log('✅ Seed users created:', seedUsers.length)
    console.log('📧 Student login: student@wellnest.com / student123')
    console.log('📧 Counselor login: counselor@wellnest.com / counselor123')
    
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    throw error
  }
}

// Run seed if called directly
if (require.main === module) {
  seed()
    .then(() => {
      console.log('🎉 Database seeding completed!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Database seeding failed:', error)
      process.exit(1)
    })
}

export { seed }
