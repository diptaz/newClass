import React, { useState } from 'react';
import { useStore } from '../context/Store';
import { Role } from '../types';
import { UserCog, Activity, Lock, Check, Rocket, Github, Globe, Server, Database, Copy, KeyRound, ShieldCheck, AlertTriangle } from 'lucide-react';

const FULL_RESET_SQL = `
-- MASTER RESET SCRIPT (Copy and Run in Supabase SQL Editor)
-- WARNING: This will delete ALL existing data and reset tables with seed data.
-- Password for all users will be: 'password'

-- 1. Enable Encryption Extension
create extension if not exists pgcrypto;

-- 2. Drop Old Objects
drop function if exists verify_password;
drop table if exists activity_logs;
drop table if exists tutor_events;
drop table if exists materials;
drop table if exists videos;
drop table if exists schedule;
drop table if exists tasks;
drop table if exists announcements;
drop table if exists subjects;
drop table if exists users;

-- 3. Create Tables
create table users (
  "id" text primary key,
  "username" text unique,
  "fullName" text,
  "role" text,
  "password" text, -- Stores bcrypt hash
  "isActive" boolean default true,
  "seatIndex" int2
);

create table subjects (
  "id" text primary key,
  "name" text,
  "code" text,
  "teacher" text
);

create table announcements (
  "id" text primary key,
  "title" text,
  "content" text,
  "date" text,
  "authorId" text,
  "authorName" text,
  "type" text
);

create table tasks (
  "id" text primary key,
  "title" text,
  "description" text,
  "subject" text,
  "deadline" text,
  "isCompleted" boolean default false,
  "createdBy" text
);

create table schedule (
  "id" text primary key,
  "day" text,
  "time" text,
  "subject" text,
  "room" text
);

create table videos (
  "id" text primary key,
  "title" text,
  "url" text,
  "subject" text,
  "week" int2,
  "uploadedBy" text
);

create table materials (
  "id" text primary key,
  "title" text,
  "type" text,
  "url" text,
  "description" text,
  "subject" text,
  "uploadedBy" text
);

create table tutor_events (
  "id" text primary key,
  "title" text,
  "description" text,
  "date" text,
  "tutorId" text,
  "tutorName" text,
  "maxParticipants" int2,
  "participants" jsonb default '[]',
  "waitingList" jsonb default '[]'
);

create table activity_logs (
  "id" text primary key,
  "userId" text,
  "action" text,
  "timestamp" text
);

-- 4. Seed Data with Hashed Passwords
do $$
declare
  -- Generate a bcrypt hash for 'password' using cost 10
  pw_hash text := crypt('password', gen_salt('bf', 10)); 
  i integer;
begin
  -- Admin
  insert into users values ('admin', 'admin', 'Super Administrator', 'ADMIN', pw_hash, true, null);
  
  -- Staff Roles
  insert into users values ('kuri', 'kurikulum', 'Staff Kurikulum', 'KURIKULUM', pw_hash, true, null);
  insert into users values ('komti', 'komti', 'Ketua Tingkat', 'KOMTI', pw_hash, true, null);
  insert into users values ('wakomti', 'wakomti', 'Wakil Ketua', 'WAKOMTI', pw_hash, true, null);
  insert into users values ('it', 'it', 'IT Support', 'IT_LOGISTIK', pw_hash, true, null);
  insert into users values ('tatib', 'tatib', 'Tata Tertib', 'TATA_TERTIB', pw_hash, true, null);
  insert into users values ('sekre', 'sekretaris', 'Sekretaris Kelas', 'SEKRETARIS', pw_hash, true, null);
  insert into users values ('bibilung1', 'bibilung', 'Master Bibilung', 'MURID_BIBILUNG', pw_hash, true, null);

  -- Students 1 to 35
  for i in 1..35 loop
    insert into users values (
      's' || i, 
      'student' || i, 
      'Student Name ' || i, 
      'STUDENT', 
      pw_hash, 
      true, 
      i-1
    );
  end loop;
end $$;

-- 5. Seed Content
insert into subjects values 
('1', 'Web Development', 'WEB101', 'Mr. Smith'),
('2', 'Database Systems', 'DB201', 'Mrs. Jones'),
('3', 'Calculus', 'MAT301', 'Dr. Brown');

insert into schedule values 
('1', 'Monday', '08:00 - 10:00', 'Web Development', 'Lab 1'),
('2', 'Monday', '10:00 - 12:00', 'Database Systems', 'Lab 2');

insert into announcements values
('1', 'Welcome!', 'System has been reset. All passwords are "password".', now(), 'admin', 'Super Administrator', 'IMPORTANT');

-- 6. Create Login Function (RPC)
create or replace function verify_password(username_input text, password_input text)
returns json
language plpgsql
as $$
declare
  found_user users%rowtype;
begin
  select * into found_user from users where username = username_input;

  if found_user is null then
    return null;
  end if;

  -- Verify password (checks against hash)
  if found_user.password = crypt(password_input, found_user.password) then
    return row_to_json(found_user);
  else
    return null;
  end if;
end;
$$;
`;

export const AdminPanel = () => {
  const { users, activityLog, updateUserRole, updateUserStatus } = useStore();
  const [activeTab, setActiveTab] = useState<'USERS' | 'LOGS' | 'DEPLOYMENT'>('USERS');
  const [search, setSearch] = useState('');
  const [copied, setCopied] = useState(false);

  const filteredUsers = users.filter(u => u.username.toLowerCase().includes(search.toLowerCase()) || u.fullName.toLowerCase().includes(search.toLowerCase()));

  const handleCopySQL = () => {
    navigator.clipboard.writeText(FULL_RESET_SQL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-8">
       <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <UserCog /> Admin Panel
        </h1>
        <div className="flex bg-white dark:bg-gray-800 rounded-lg p-1 border dark:border-gray-700">
          <button 
            onClick={() => setActiveTab('USERS')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${activeTab === 'USERS' ? 'bg-primary text-white' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
          >
            User Management
          </button>
          <button 
            onClick={() => setActiveTab('LOGS')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${activeTab === 'LOGS' ? 'bg-primary text-white' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
          >
            Activity Logs
          </button>
          <button 
            onClick={() => setActiveTab('DEPLOYMENT')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${activeTab === 'DEPLOYMENT' ? 'bg-primary text-white' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
          >
            Database Reset
          </button>
        </div>
      </div>

      {activeTab === 'USERS' && (
        <div className="space-y-4 animate-fade-in">
           <input 
            type="text" 
            placeholder="Search users..." 
            className="w-full p-2 border rounded-lg max-w-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-200 dark:border-gray-700">
            <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
              <thead className="bg-gray-50 dark:bg-gray-700 uppercase font-medium">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Current Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 dark:text-white">{user.fullName}</div>
                      <div className="text-xs text-gray-500">@{user.username}</div>
                    </td>
                    <td className="px-6 py-4">
                      <select 
                        value={user.role}
                        onChange={(e) => updateUserRole(user.id, e.target.value as Role)}
                        className="bg-gray-50 border rounded p-1 text-xs dark:bg-gray-600 dark:text-white dark:border-gray-500"
                        disabled={user.role === Role.ADMIN}
                      >
                        {Object.values(Role).map(r => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      {user.isActive ? (
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">Active</span>
                      ) : (
                         <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs">Suspended</span>
                      )}
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                       <button 
                        onClick={() => updateUserStatus(user.id, !user.isActive)}
                        className={`p-1 rounded ${user.isActive ? 'text-red-500 hover:bg-red-50' : 'text-green-500 hover:bg-green-50'}`}
                        title={user.isActive ? "Suspend" : "Activate"}
                        disabled={user.role === Role.ADMIN}
                       >
                         {user.isActive ? <Lock size={16} /> : <Check size={16} />}
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'LOGS' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700 animate-fade-in">
          <h2 className="text-lg font-bold mb-4 dark:text-white flex items-center gap-2">
            <Activity size={20} /> System Logs
          </h2>
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {activityLog.length === 0 ? <p className="text-gray-500">No logs yet.</p> : activityLog.map(log => (
              <div key={log.id} className="text-sm p-2 border-b dark:border-gray-700 last:border-0">
                <span className="text-gray-400 text-xs block">{new Date(log.timestamp).toLocaleString()}</span>
                <span className="text-gray-800 dark:text-gray-300">{log.action}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'DEPLOYMENT' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 shadow-sm">
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-3 text-red-700 dark:text-red-400">
              <AlertTriangle size={28} /> Database Repair & Reset
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
               Gunakan script di bawah ini jika Anda mengalami masalah login atau ingin mereset ulang seluruh database ke kondisi awal.
               <br/><strong>PERHATIAN:</strong> Semua data akan dihapus dan diganti dengan data default.
            </p>
            
            <div className="relative">
                <div className="flex items-center justify-between mb-2 bg-gray-800 rounded-t-lg px-4 py-2">
                   <span className="text-xs font-bold text-gray-300 uppercase">SQL Editor Script</span>
                   <button 
                      onClick={handleCopySQL} 
                      className="text-xs flex items-center gap-1 bg-primary text-white px-3 py-1.5 rounded hover:bg-blue-600 transition"
                    >
                      {copied ? <Check size={14} /> : <Copy size={14} />} 
                      {copied ? 'Copied!' : 'Copy Script'}
                    </button>
                </div>
                <div className="bg-gray-900 p-4 rounded-b-lg font-mono text-xs text-green-400 h-96 overflow-y-auto border-t border-gray-700">
                   <pre>{FULL_RESET_SQL}</pre>
                </div>
             </div>
             
             <div className="mt-6 flex flex-col gap-2 text-sm text-gray-600 dark:text-gray-400">
               <h4 className="font-bold text-gray-800 dark:text-white">Cara Menggunakan:</h4>
               <ol className="list-decimal list-inside space-y-1 ml-2">
                 <li>Copy script di atas.</li>
                 <li>Buka Dashboard Supabase Anda.</li>
                 <li>Masuk ke menu <strong>SQL Editor</strong>.</li>
                 <li>Paste script dan klik <strong>Run</strong>.</li>
                 <li>Coba login kembali di aplikasi ini dengan <code>student14</code> / <code>password</code>.</li>
               </ol>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};