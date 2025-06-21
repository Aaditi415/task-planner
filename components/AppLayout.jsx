import { useState, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';

function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [lists, setLists] = useState(() => {
    const stored = localStorage.getItem('lists');
    return stored ? JSON.parse(stored) : [
      { label: '✅ All', count: 0 },
      // { label: '🏡 Home', count: 0 },
      // { label: '🔑 Personal', count: 1 },
      // { label: '💼 Work', count: 4 },
      // { label: '💪 Diet', count: 1 },
      // { label: '📚 List of book', count: 0 },
      // { label: '🗺️ Road trip list', count: 1 },
    ];
  });

  useEffect(() => {
    localStorage.setItem('lists', JSON.stringify(lists));
  }, [lists]);

  const [tasks, setTasks] = useState(() => {
    const stored = localStorage.getItem('tasks');
    return stored ? JSON.parse(stored) : [];
  });
  
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);
  

  const [selectedListFilter, setSelectedListFilter] = useState('✅ All');

  const addNewList = (label) => {
    if (!label.trim()) return;
    setLists(prev => [
      ...prev,
      { label: label.trim(), icon: 'emoji', count: 0 }
    ]);
  };

  return (
    <>
      <Sidebar
        isOpen={isSidebarOpen}
        closeSidebar={() => setIsSidebarOpen(false)}
        lists={lists}
        selectedListFilter={selectedListFilter}
        setSelectedListFilter={setSelectedListFilter}
        addNewList={addNewList}
        setLists={setLists}
        tasks={tasks}
        setTasks={setTasks}
      />
      <div className={`w-full md:w-[80%] px-0 md:px-8 sm:px-4 ${isSidebarOpen ? 'pointer-events-none' : ''}`}>
        <Header toggleSidebar={() => setIsSidebarOpen(true)} isSidebarOpen={isSidebarOpen} />
        <Dashboard
          lists={lists}
          setLists={setLists}
          selectedListFilter={selectedListFilter}
          tasks={tasks}
          setTasks={setTasks}
        />

      </div>
    </>
  );
}

export default AppLayout;
