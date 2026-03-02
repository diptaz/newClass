import React from 'react';
import { NavLink } from 'react-router-dom';
import { useStore } from '../context/Store';
import { Role } from '../types';
import { 
  Home, BookOpen, Video, Calendar, Grid, 
  FileText, Shield, LogOut, Book, User, GraduationCap,
  MessageSquare, Image, DollarSign, BarChart2, RefreshCw, X
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const { currentUser, logout, viewMode, toggleViewMode } = useStore();

  const navItemClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
      isActive 
        ? 'bg-primary/10 text-primary font-medium' 
        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
    }`;

  if (!currentUser) return null;

  const canSeeSubjects = [Role.ADMIN, Role.KURIKULUM, Role.IT_LOGISTIK, Role.KOMTI, Role.SEKRETARIS].includes(currentUser.role);
  const isBibilung = currentUser.role === Role.MURID_BIBILUNG;

  return (
    <aside className={`
      w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 
      flex flex-col h-screen fixed left-0 top-0 z-50 transition-transform duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
    `}>
      <div className="p-6 flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-bold text-primary tracking-tighter">AC24<span className="text-gray-800 dark:text-white">DIA</span></h1>
            <div className="mt-2 text-xs font-mono text-gray-500 dark:text-gray-500 flex flex-col gap-1">
            <div>Logged as: <span className="text-secondary font-bold">{currentUser.role}</span></div>
            {isBibilung && (
                <div className="flex items-center gap-1 text-xs text-gray-400">
                    Viewing as: <span className={`font-bold ${viewMode === Role.STUDENT ? 'text-green-500' : 'text-purple-500'}`}>{viewMode}</span>
                </div>
            )}
            </div>
        </div>
        <button onClick={onClose} className="md:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400">
            <X size={24} />
        </button>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        <NavLink to="/dashboard" className={navItemClass} onClick={() => onClose()}>
          <Home size={20} /> Dashboard
        </NavLink>
        
        <NavLink to="/assignments" className={navItemClass} onClick={() => onClose()}>
          <BookOpen size={20} /> Assignments
        </NavLink>

        <NavLink to="/schedule" className={navItemClass} onClick={() => onClose()}>
          <Calendar size={20} /> Schedule
        </NavLink>

        <NavLink to="/tutor-events" className={navItemClass} onClick={() => onClose()}>
          <GraduationCap size={20} /> Tutor Events
        </NavLink>

        <NavLink to="/confessions" className={navItemClass} onClick={() => onClose()}>
          <MessageSquare size={20} /> Confessions
        </NavLink>

        <NavLink to="/gallery" className={navItemClass} onClick={() => onClose()}>
          <Image size={20} /> Gallery
        </NavLink>

        <NavLink to="/treasury" className={navItemClass} onClick={() => onClose()}>
          <DollarSign size={20} /> Treasury
        </NavLink>

        <NavLink to="/polls" className={navItemClass} onClick={() => onClose()}>
          <BarChart2 size={20} /> Polls
        </NavLink>
        
        {canSeeSubjects && (
          <NavLink to="/subjects" className={navItemClass} onClick={() => onClose()}>
            <Book size={20} /> Subjects
          </NavLink>
        )}

        <NavLink to="/videos" className={navItemClass} onClick={() => onClose()}>
          <Video size={20} /> Videos
        </NavLink>

        <NavLink to="/materials" className={navItemClass} onClick={() => onClose()}>
          <FileText size={20} /> Materials
        </NavLink>

        <NavLink to="/seating" className={navItemClass} onClick={() => onClose()}>
          <Grid size={20} /> Seating Plan
        </NavLink>

        {currentUser.role === Role.ADMIN && (
          <NavLink to="/admin" className={navItemClass} onClick={() => onClose()}>
            <Shield size={20} /> Admin Panel
          </NavLink>
        )}
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-gray-800 space-y-2">
        {isBibilung && (
            <button 
              onClick={() => { toggleViewMode(); onClose(); }}
              className="flex items-center gap-3 px-4 py-2 w-full text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/10 rounded-lg transition-colors text-sm font-medium"
            >
              <RefreshCw size={18} /> Switch to {viewMode === Role.MURID_BIBILUNG ? 'Student' : 'Tutor'}
            </button>
        )}
        <NavLink to="/profile" className="flex items-center gap-3 px-4 py-2 w-full text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors" onClick={() => onClose()}>
            <User size={20} /> My Profile
        </NavLink>
        <button 
          onClick={logout}
          className="flex items-center gap-3 px-4 py-2 w-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors"
        >
          <LogOut size={20} /> Logout
        </button>
      </div>
    </aside>
  );
};