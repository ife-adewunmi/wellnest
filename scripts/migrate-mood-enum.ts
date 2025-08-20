import { db } from '../src/shared/db'
import { sql } from 'drizzle-orm'

async function migrateMoodEnum() {
  console.log('Starting mood enum migration...')

  try {
    // Step 1: Update existing data to map old values to new values
    console.log('Step 1: Converting existing mood data...')
    
    // Map old values to new values
    const mappings = [
      { old: 'VERY_SAD', new: 'SAD' },
      { old: 'ANXIOUS', new: 'BAD' },
      { old: 'STRESSED', new: 'BAD' },
      // Keep existing values that match
      // HAPPY -> HAPPY
      // NEUTRAL -> NEUTRAL  
      // SAD -> BAD (to make room for VERY_SAD -> SAD)
    ]

    // First, let's see what data exists
    const existingData = await db.execute(sql`
      SELECT mood, COUNT(*) as count 
      FROM mood_check_ins 
      GROUP BY mood
    `)
    
    console.log('Existing mood data:', existingData.rows)

    // Update the data
    for (const mapping of mappings) {
      const result = await db.execute(sql`
        UPDATE mood_check_ins 
        SET mood = ${mapping.new}::text 
        WHERE mood = ${mapping.old}::text
      `)
      console.log(`Updated ${mapping.old} -> ${mapping.new}: ${result.rowCount} rows`)
    }

    // Also update SAD -> BAD to make room for VERY_SAD -> SAD
    const sadResult = await db.execute(sql`
      UPDATE mood_check_ins 
      SET mood = 'BAD'::text 
      WHERE mood = 'SAD'::text
    `)
    console.log(`Updated SAD -> BAD: ${sadResult.rowCount} rows`)

    // Step 2: Now update the enum type
    console.log('Step 2: Updating enum type...')
    
    // Convert column to text first
    await db.execute(sql`ALTER TABLE mood_check_ins ALTER COLUMN mood SET DATA TYPE text`)
    
    // Drop old enum
    await db.execute(sql`DROP TYPE IF EXISTS mood_type`)
    
    // Create new enum
    await db.execute(sql`CREATE TYPE mood_type AS ENUM('GOOD', 'HAPPY', 'NEUTRAL', 'BAD', 'SAD')`)
    
    // Convert column back to enum
    await db.execute(sql`
      ALTER TABLE mood_check_ins 
      ALTER COLUMN mood SET DATA TYPE mood_type 
      USING mood::mood_type
    `)

    console.log('Migration completed successfully!')

    // Show final data
    const finalData = await db.execute(sql`
      SELECT mood, COUNT(*) as count 
      FROM mood_check_ins 
      GROUP BY mood
    `)
    
    console.log('Final mood data:', finalData.rows)

  } catch (error) {
    console.error('Migration failed:', error)
    throw error
  }
}

// Run the migration
migrateMoodEnum()
  .then(() => {
    console.log('Migration script completed')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Migration script failed:', error)
    process.exit(1)
  })
