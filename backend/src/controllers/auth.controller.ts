import { RequestHandler } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../db';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

export const registerUser:RequestHandler = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // insert into db
    const result = await pool.query(
      `INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username`,
      [username, hashedPassword]
    );

    const newUser = result.rows[0];
    res.status(201).json({ user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error registering user' });
  }
};

export const loginUser: RequestHandler = async (req, res, next): Promise<void> =>{
  try {
    const { username, password } = req.body;

    // find user
    const userResult = await pool.query(
      `SELECT * FROM users WHERE username = $1`,
      [username]
    );
    const user = userResult.rows[0];
    if (!user){ 
      res.status(401).json({ message: 'Invalid credentials' })
      return;
    };

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid credentials' })
      return;
      } ;

    // create token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error logging in' });
  }
};