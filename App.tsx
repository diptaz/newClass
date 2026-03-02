import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { StoreProvider, useStore } from './context/Store';
import { Sidebar } from './components/Sidebar';
import { ToastContainer } from './components/ToastContainer';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Assignments } from './pages/Assignments';
import { SeatingPlan } from './pages/SeatingPlan';
import { AdminPanel } from './pages/AdminPanel';
import { Subjects } from './pages/Subjects';
import { Videos } from './pages/Videos';
import { Materials } from './pages/Materials';
import { Profile } from './pages/Profile';
import { TutorEvents } from './pages/TutorEvents';
import { Schedule } from './pages/Schedule';
import { Confessions } from './pages/Confessions';
import { Gallery } from './pages/Gallery';
import { Treasury } from './pages/Treasury';
import { Polls } from './pages/Polls';
import { Role } from './types';
import { Sun, Moon, Loader2, Menu } from 'lucide-react';

const Layout = () => {
  const { currentUser, isLoading, isDarkMode, toggleDarkMode } = useStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Show loader while checking session/data to prevent flickering or premature redirect
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-primary" size={48} />
          <p className="text-gray-500 dark:text-gray-400 font-medium">Loading AC24DIA...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) return <Navigate to="/login" />;

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <ToastContainer />
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-0' : 'ml-0'} md:ml-64 p-4 relative w-full`}>
        <div className="flex justify-between items-center mb-6 md:mb-0">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 shadow-sm md:hidden"
            >
              <Menu size={24} />
            </button>

            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-yellow-400 hover:opacity-80 transition md:absolute md:top-4 md:right-8"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
        </div>

        <div className="mt-2 md:mt-0">
           <Outlet />
        </div>
      </main>
    </div>
  );
};

const ProtectedRoute = ({ children, roles }: { children?: React.ReactNode, roles?: Role[] }) => {
  const { currentUser, isLoading } = useStore();
  
  if (isLoading) return null; // Let Layout handle loading UI
  if (!currentUser) return <Navigate to="/login" />;
  
  if (roles && !roles.includes(currentUser.role)) {
     return (
       <div className="flex flex-col items-center justify-center h-full text-center mt-20">
         <h1 className="text-6xl font-bold text-gray-300">403</h1>
         <p className="text-xl text-gray-500 mt-4">Access Forbidden</p>
         <p className="text-gray-400">You do not have permission to view this page.</p>
       </div>
     );
  }

  return <>{children}</>;
};

const App = () => {
  return (
    <StoreProvider>
      <HashRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="assignments" element={<Assignments />} />
            <Route path="seating" element={<SeatingPlan />} />
            <Route path="subjects" element={<Subjects />} />
            <Route path="videos" element={<Videos />} />
            <Route path="materials" element={<Materials />} />
            <Route path="tutor-events" element={<TutorEvents />} />
            <Route path="confessions" element={<Confessions />} />
            <Route path="gallery" element={<Gallery />} />
            <Route path="treasury" element={<Treasury />} />
            <Route path="polls" element={<Polls />} />
            <Route path="profile" element={<Profile />} />
            <Route path="schedule" element={<Schedule />} />

            <Route path="admin" element={
              <ProtectedRoute roles={[Role.ADMIN]}>
                <AdminPanel />
              </ProtectedRoute>
            } />
          </Route>
        </Routes>
      </HashRouter>
    </StoreProvider>
  );
};

export default App;