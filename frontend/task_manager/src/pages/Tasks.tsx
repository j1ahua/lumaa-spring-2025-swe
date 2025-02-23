import React, { useEffect, useState } from 'react';

interface Task {
  id: number;
  title: string;
  description?: string;
  isComplete: boolean;
  userId?: number;
}

interface TasksProps {
  token: string;
}

const Tasks: React.FC<TasksProps> = ({ token }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // Fetch tasks on component mount
  const fetchTasks = async () => {
    try {
      const res = await fetch('http://localhost:4000/tasks', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!res.ok) {
        const errData = await res.json();
        alert(errData.message || 'Error fetching tasks');
        return;
      }
      const data = await res.json();
      setTasks(data);
    } catch (error) {
      console.error(error);
      alert('Server error fetching tasks');
    }
  };

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Create a new task
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:4000/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ title, description })
      });
      if (!res.ok) {
        const errData = await res.json();
        alert(errData.message || 'Error creating task');
        return;
      }
      const newTask = await res.json();
      setTasks((prev) => [...prev, newTask]);
      setTitle('');
      setDescription('');
    } catch (error) {
      console.error(error);
      alert('Server error creating task');
    }
  };

  // Toggle complete
  const toggleComplete = async (task: Task) => {
    try {
      const res = await fetch(`http://localhost:4000/tasks/${task.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: task.title,
          description: task.description,
          isComplete: !task.isComplete
        })
      });
      if (!res.ok) {
        const errData = await res.json();
        alert(errData.message || 'Error updating task');
        return;
      }
      const updatedTask = await res.json();
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? updatedTask : t))
      );
    } catch (error) {
      console.error(error);
      alert('Server error updating task');
    }
  };

  // Delete task
  const deleteTask = async (taskId: number) => {
    try {
      const res = await fetch(`http://localhost:4000/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!res.ok) {
        const errData = await res.json();
        alert(errData.message || 'Error deleting task');
        return;
      }
      // If successful, remove from local state
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    } catch (error) {
      console.error(error);
      alert('Server error deleting task');
    }
  };

  return (
    <div>
      <h2>Tasks</h2>
      <form onSubmit={handleCreateTask}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
          required
        />
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Task description"
        />
        <button type="submit">Create Task</button>
      </form>

      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <span style={{ textDecoration: task.isComplete ? 'line-through' : 'none' }}>
              {task.title} - {task.description}
            </span>
            <button onClick={() => toggleComplete(task)}>
              {task.isComplete ? 'Uncomplete' : 'Complete'}
            </button>
            <button onClick={() => deleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tasks;