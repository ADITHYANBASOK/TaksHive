import { useState, useEffect } from 'react';
import { PlusCircle, Search, SlidersHorizontal } from 'lucide-react';
import TaskList from './components/TaskList';
import FilterSort from './components/FilterSort';
import { Task } from './types';
import TaskForm from './components/TaskForm';

function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [showForm, setShowForm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState({ status: 'all', priority: 'all', category: 'all' });
  const [sortBy, setSortBy] = useState('date');
  const [editingTask, setEditingTask] = useState<Task | null>(null); // State to track the task being edited

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (task: Task) => {
    setTasks([...tasks, task]);
    setShowForm(false);
  };

  const updateTask = (updatedTask: Task) => {
    setTasks(tasks.map(task => (task.id === updatedTask.id ? updatedTask : task)));
    setShowForm(false);
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const filteredTasks = tasks.filter(task => {
    return (
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filter.status === 'all' ||
        (filter.status === 'completed' && task.completed) ||
        (filter.status === 'active' && !task.completed)) &&
      (filter.priority === 'all' || task.priority === filter.priority) &&
      (filter.category === 'all' || task.category === filter.category)
    );
  }).sort((a, b) => {
    if (sortBy === 'date') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (sortBy === 'priority') return b.priority.localeCompare(a.priority);
    if (sortBy === 'category') return a.category.localeCompare(b.category);
    return 0;
  });

  const handleEditClick = (task: Task) => {
    setEditingTask(task);  // Set the task to be edited
    setShowForm(true);     // Show the form
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 flex flex-col items-center p-8">
      <div className="w-full sm:w-10/12 bg-white rounded-lg shadow-xl overflow-hidden">
        <header className="bg-indigo-600 text-white p-6">
          <h1 className="text-3xl font-bold">TaskHive</h1>
          <p className="mt-2 text-indigo-200">Organize your tasks in one hive with style and simplicity.</p>
        </header>

        <main className="p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 space-y-4 sm:space-y-0">
            {/* Search Box */}
            <div className="relative w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search tasks..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            </div>

            {/* Buttons */}
            <div className="flex space-x-4 justify-center sm:justify-start">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full hover:bg-indigo-200 transition duration-300"
              >
                <SlidersHorizontal size={20} className="mr-2" />
                Filters
              </button>
              <button
                onClick={() => {
                  setEditingTask(null); // Reset editing task when adding a new task
                  setShowForm(true);
                }}
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition duration-300"
              >
                <PlusCircle size={20} className="mr-2" />
                Add Task
              </button>
            </div>
          </div>


          {showFilters && (
            <FilterSort
              filter={filter}
              setFilter={setFilter}
              sortBy={sortBy}
              setSortBy={setSortBy}
            />
          )}

          <TaskList
            tasks={filteredTasks}
            updateTask={updateTask}
            deleteTask={deleteTask}
            onEditClick={handleEditClick} // Pass the edit handler to TaskList
          />
        </main>
      </div>

      {showForm && (
        <TaskForm
          addTask={addTask}
          updateTask={updateTask}
          task={editingTask} // Pass the task being edited or null for adding
          onClose={() => {
            setShowForm(false);
            setEditingTask(null); // Reset editing task when form is closed
          }}
        />
      )}
    </div>
  );
}

export default App;
