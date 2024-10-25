import React from 'react';
import { CheckCircle, Circle, Trash2, Edit2 } from 'lucide-react';
import { Task } from '../types';

interface TaskListProps {
  tasks: Task[];
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  onEditClick: (task: Task) => void; // Add the edit click prop
}

const TaskList: React.FC<TaskListProps> = ({ tasks, updateTask, deleteTask, onEditClick }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <ul className="space-y-4">
      {tasks.map((task) => (
        <li key={task.id} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button onClick={() => updateTask({ ...task, completed: !task.completed })}>
                {task.completed ? (
                  <CheckCircle className="text-green-500" size={24} />
                ) : (
                  <Circle className="text-gray-400" size={24} />
                )}
              </button>
              <div>
                <h3 className={`text-lg font-semibold ${task.completed ? 'line-through text-gray-400' : ''}`}>
                  {task.title}
                </h3>
                <p className="text-sm text-gray-600">{task.description}</p>
                <div className="flex space-x-2 mt-2">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${getPriorityColor(task.priority)} bg-opacity-20`}>
                    {task.priority}
                  </span>
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                    {task.category}
                  </span>
                  {task.dueDate && (
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-purple-100 text-purple-800">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => onEditClick(task)} // Invoke the edit function with the task
                className="p-1 hover:bg-gray-100 rounded-full transition duration-300"
              >
                <Edit2 size={20} className="text-gray-500" />
              </button>
              <button
                onClick={() => deleteTask(task.id)}
                className="p-1 hover:bg-gray-100 rounded-full transition duration-300"
              >
                <Trash2 size={20} className="text-red-500" />
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default TaskList;
