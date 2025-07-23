import { db } from "@/shared/db";
import { users } from "@/shared/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from 'next/server';
import { createUserSchema } from "@/shared/lib/validations";
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const validationResult = createUserSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json({
        error: 'Validation failed',
        details: validationResult.error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      }, { status: 400 });
    }

    const { first_name, last_name, email, password } = validationResult.data;

    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existingUser.length > 0) {
      return NextResponse.json({
        error: 'User already exists',
        details: 'A user with this email address already exists'
      }, { status: 409 });
    }

    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const result = await db.insert(users).values({
      first_name,
      last_name,
      email,
      password: hashedPassword
    }).returning();

    const { password: _, ...userWithoutPassword } = result[0];

    return NextResponse.json({
      success: true,
      user: userWithoutPassword
    }, { status: 201 });

  } catch (error) {
    console.error('Failed to create user:', error);
    return NextResponse.json({ 
      error: 'Internal Server Error',
      details: 'An unexpected error occurred while creating the user'
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    const allUsers = await db.select({
      id: users.id,
      first_name: users.first_name,
      last_name: users.last_name,
      email: users.email,
      created_at: users.created_at,
      updated_at: users.updated_at
    }).from(users);

    return NextResponse.json({
      success: true,
      users: allUsers
    });

  } catch (error) {
    console.error('Failed to fetch users:', error);
    return NextResponse.json({ 
      error: 'Internal Server Error',
      details: 'An unexpected error occurred while fetching users'
    }, { status: 500 });
  }
}
