import { RequestHandler } from 'express';
import { pool } from '../db';

export const getTasks: RequestHandler = async (req, res) => {
  try {
    const userId = (req as any).userId;
    const result = await pool.query(
      `SELECT * FROM tasks WHERE "userId" = $1`,
      [userId]
    );
    // Return tasks to user
    res.json(result.rows);
    return; // function ends
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching tasks' });
    return;
  }

};
export const createTask: RequestHandler = async (req, res) => {
  try {
    // userId set by auth middleware
    const userId = (req as any).userId;
    const { title, description } = req.body;

    // Insert into tasks table
    const result = await pool.query(
      `INSERT INTO tasks (title, description, "userId") 
       VALUES ($1, $2, $3) 
       RETURNING *`,
      [title, description, userId]
    );

    // Return newly created row
    res.status(201).json(result.rows[0]);
    return; // end function (TypeScript likes explicit returns)
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Error creating task' });
    return;
  }
};
export const updateTask: RequestHandler = async (req, res) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params; // /tasks/:id
    const { title, description, isComplete } = req.body;

    // Update row only if it belongs to this user
    const result = await pool.query(
      `UPDATE tasks
       SET title = $1,
           description = $2,
           "isComplete" = $3
       WHERE id = $4
         AND "userId" = $5
       RETURNING *`,
      [title, description, isComplete, id, userId]
    );

    if (result.rowCount === 0) {
      // No row found or user doesn't own it
      res.status(404).json({ message: 'Task not found or not owned by user' });
      return;
    }

    // Return the updated task
    res.json(result.rows[0]);
    return;
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Error updating task' });
    return;
  }
};
export const deleteTask: RequestHandler = async (req, res) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params; // /tasks/:id

    // Delete only if the task belongs to this user
    const result = await pool.query(
      `DELETE FROM tasks
       WHERE id = $1
         AND "userId" = $2`,
      [id, userId]
    );

    if (result.rowCount === 0) {
      res
        .status(404)
        .json({ message: 'Task not found or not owned by user' });
      return;
    }

    res.json({ message: 'Task deleted successfully' });
    return;
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Error deleting task' });
    return;
  }
};