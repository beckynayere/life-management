import { Pool } from "mysql2/promise";
import bcrypt from "bcryptjs";

export const createUser = async (db: Pool, email: string, password: string) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const [result] = await db.query(
    "INSERT INTO users (email, password) VALUES (?, ?)",
    [email, hashedPassword]
  );
  return result;
};

export const findUserByEmail = async (db: Pool, email: string) => {
  const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
  return Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
};
