import pool from '../config/db';

export interface User {
  id?: number;
  name: string;
  email: string;
  password: string;
  created_at?: Date;
}

export class UserModel {
  // Create a new user
  static async create(user: User): Promise<User> {
    const [result] = await pool.execute(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [user.name, user.email, user.password]
    );

    const insertedId = (result as any).insertId;
    return { ...user, id: insertedId };
  }

  // Find user by email
  static async findByEmail(email: string): Promise<User | null> {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    const users = Array.isArray(rows) ? (rows as User[]) : [];
    return users[0] ?? null; 
  }

  // Find user by ID
  static async findById(id: number): Promise<User | null> {
    const [rows] = await pool.execute(
      'SELECT id, name, email, created_at FROM users WHERE id = ?',
      [id]
    );

    const users = Array.isArray(rows) ? (rows as User[]) : [];
    return users[0] ?? null; 
  }
}
