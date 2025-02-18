import { Request, Response } from 'express';
import { pool } from '../db';

export const getTasks = async (req: Request, res: Response) => {
  try {
    // userId added by auth middleware
    const userId = (req as any).userId;

    const result = await pool.query(
      `SELECT * FROM tasks WHERE "userId" = $1`, 
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching tasks' });
  }
};

export const createTask = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { title, description } = req.body;

    const result = await pool.query(
      `INSERT INTO tasks (title, description, "userId") VALUES ($1, $2, $3) RETURNING *`,
      [title, description, userId]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating task' });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;
    const { title, description, isComplete } = req.body;

    // only update if it belongs to the user
    const result = await pool.query(
      `UPDATE tasks SET title=$1, description=$2, "isComplete"=$3
       WHERE id=$4 AND "userId"=$5
       RETURNING *`,
      [title, description, isComplete, id, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Task not found or not owned by user' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating task' });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;

    const result = await pool.query(
      `DELETE FROM tasks WHERE id=$1 AND "userId"=$2`,
      [id, userId]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Task not found or not owned by user' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting task' });
  }
};