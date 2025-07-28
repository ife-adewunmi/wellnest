import { db } from "@/shared/db";
import { users } from "@/shared/db/schema";
import { eq } from "drizzle-orm";
import { createUserSchema } from "@/shared/lib/validations";
import bcrypt from 'bcryptjs';

export interface CreateStudentData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

export interface Student {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  created_at: Date;
  updated_at: Date;
}

export interface StudentResponse {
  success: boolean;
  student?: Student;
  students?: Student[];
  error?: string;
  details?: string | Array<{ field: string; message: string }>;
}

export class StudentService {
  static async createStudent(data: CreateStudentData): Promise<StudentResponse> {
    try {
      const validationResult = createUserSchema.safeParse(data);
      if (!validationResult.success) {
        return {
          success: false,
          error: 'Validation failed',
          details: validationResult.error.issues.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        };
      }

      const { first_name, last_name, email, password } = validationResult.data;

      const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
      if (existingUser.length > 0) {
        return {
          success: false,
          error: 'User already exists',
          details: 'A user with this email address already exists'
        };
      }

      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const result = await db.insert(users).values({
        first_name,
        last_name,
        email,
        password: hashedPassword
      }).returning();

      const { password: _, ...studentWithoutPassword } = result[0];

      const mappedStudent: Student = {
        id: studentWithoutPassword.id.toString(),
        first_name: studentWithoutPassword.first_name,
        last_name: studentWithoutPassword.last_name,
        email: studentWithoutPassword.email,
        created_at: studentWithoutPassword.created_at,
        updated_at: studentWithoutPassword.updated_at
      };

      return {
        success: true,
        student: mappedStudent
      };

    } catch (error) {
      console.error('Failed to create student:', error);
      return {
        success: false,
        error: 'Internal Server Error',
        details: 'An unexpected error occurred while creating the student'
      };
    }
  }

  static async getAllStudents(): Promise<StudentResponse> {
    try {
      const allStudents = await db.select({
        id: users.id,
        first_name: users.first_name,
        last_name: users.last_name,
        email: users.email,
        created_at: users.created_at,
        updated_at: users.updated_at
      }).from(users);

      const mappedStudents: Student[] = allStudents.map(student => ({
        id: student.id.toString(),
        first_name: student.first_name,
        last_name: student.last_name,
        email: student.email,
        created_at: student.created_at,
        updated_at: student.updated_at
      }));

      return {
        success: true,
        students: mappedStudents
      };

    } catch (error) {
      console.error('Failed to fetch students:', error);
      return {
        success: false,
        error: 'Internal Server Error',
        details: 'An unexpected error occurred while fetching students'
      };
    }
  }
}
