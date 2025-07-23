import { db } from "@/shared/db";
import { users } from "@/shared/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from 'next/server';
import { loginSchema } from "@/shared/lib/validations";
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const validationResult = loginSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json({ 
        error: 'Validation failed',
        details: validationResult.error.issues.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      }, { status: 400 });
    }

    const { email, password } = validationResult.data;


    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
    
    if (existingUser.length === 0) {
      return NextResponse.json({ 
        error: 'Invalid credentials',
        details: 'Email or password is incorrect' 
      }, { status: 401 });
    }

    const user = existingUser[0];

    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return NextResponse.json({ 
        error: 'Invalid credentials',
        details: 'Email or password is incorrect' 
      }, { status: 401 });
    }

    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      user: userWithoutPassword
    }, { status: 200 });

  } catch (error) {
    console.error('Failed to authenticate user:', error);
    return NextResponse.json({ 
      error: 'Internal Server Error',
      details: 'An unexpected error occurred during authentication'
    }, { status: 500 });
  }
}
