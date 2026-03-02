import React, { useState } from 'react';
import { useStore } from '../context/Store';
import { Role, TutorEvent } from '../types';
import { GraduationCap, Plus, Calendar, User, Clock, Trash2, LogIn, LogOut, Users, Edit, UserPlus, ClipboardList, Eye, X } from 'lucide-react';

export const TutorEvents = () => {
  const { 
    tutorEvents, users, currentUser, viewMode,
    addTutorEvent, editTutorEvent, deleteTutorEvent, 
    joinTutorEvent, leaveTutorEvent, promoteFromWaitingList,
    assignUserToEvent, kickFromEvent
  } = useStore();
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [viewOnly, setViewOnly] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);

  const [eventForm, setEventForm] = useState({ title: '', description: '', date: '', time: '', maxParticipants: 5 });
  const [studentToAssign, setStudentToAssign] = useState('');

  const canCreate = [Role.MURID_BIBILUNG, Role.ADMIN].includes(viewMode) || (currentUser?.role === Role.ADMIN);
  const canJoin = viewMode === Role.STUDENT || viewMode === Role.MURID_BIBILUNG; // Bibilung can join if they want, but usually they switch to student view to "feel" like a student

  const openCreateModal = () => {
    setIsEditMode(false);
    setViewOnly(false);
    setEventForm({ title: '', description: '', date: '', time: '', maxParticipants: 5 });
    setIsModalOpen(true);
  };

  const populateForm = (event: TutorEvent) => {
    setEditingEventId(event.id);
    const dateObj = new Date(event.date);
    const dateStr = dateObj.toISOString().split('T')[0];
    const timeStr = dateObj.toTimeString().substring(0, 5);
    setEventForm({
        title: event.title,
        description: event.description,
        date: dateStr,
        time: timeStr,
        maxParticipants: event.maxParticipants
    });
  }

  const openViewModal = (event: TutorEvent) => {
    setIsEditMode(false);
    setViewOnly(true);
    populateForm(event);
    setIsModalOpen(true);
  }

  const openEditModal = (event: TutorEvent) => {
    setIsEditMode(true);
    setViewOnly(false);
    populateForm(event);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    
    // Combine date and time
    const dateTime = new Date(`${eventForm.date}T${eventForm.time}`);

    if (isEditMode && editingEventId) {
        editTutorEvent(editingEventId, {
            title: eventForm.title,
            description: eventForm.description,
            date: dateTime.toISOString(),
            maxParticipants: Number(eventForm.maxParticipants)
        });
    } else {
        addTutorEvent({
            id: Date.now().toString(),
            title: eventForm.title,
            description: eventForm.description,
            date: dateTime.toISOString(),
            tutorId: currentUser.id,
            tutorName: currentUser.fullName,
            maxParticipants: Number(eventForm.maxParticipants),
            participants: [],
            waitingList: []
        });
    }
    
    setIsModalOpen(false);
  };

  const handleAssignStudent = () => {
     if (editingEventId && studentToAssign) {
         assignUserToEvent(editingEventId, studentToAssign);
         setStudentToAssign('');
     }
  };

  const getCapacityColor = (current: number, max: number) => {
    const percentage = current / max;
    if (percentage >= 1) return 'bg-red-500';
    if (percentage >= 0.8) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const activeEvent = tutorEvents.find(e => e.id === editingEventId);
  const activeEventParticipants = activeEvent ? users.filter(u => activeEvent.participants.includes(u.id)) : [];
  // Available students to assign: Role is student, and not already in participants
  const availableStudents = users.filter(u => u.role === Role.STUDENT && activeEvent && !activeEvent.participants.includes(u.id));

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
           <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <GraduationCap /> Tutor Events
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
             Exclusive sessions hosted by our Murid Bibilung. First come, first served!
          </p>
        </div>
       
        {canCreate && (
          <button 
            onClick={openCreateModal}
            className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600 transition"
          >
            <Plus size={18} /> Create Event
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tutorEvents.map(event => {
          const isFull = event.participants.length >= event.maxParticipants;
          const isJoined = currentUser ? event.participants.includes(currentUser.id) : false;
          const isWaitlisted = currentUser ? (event.waitingList || []).includes(currentUser.id) : false;
          
          const isCreator = currentUser?.id === event.tutorId;
          const canManage = isCreator || currentUser?.role === Role.ADMIN || currentUser?.role === Role.KURIKULUM;
          const eventDate = new Date(event.date);

          // If in Student View, hide management buttons unless admin
          const showManageButtons = canManage && (viewMode !== Role.STUDENT || currentUser?.role === Role.ADMIN);

          // Get participant objects to display names
          const joinedUsers = users.filter(u => event.participants.includes(u.id));
          const waitingUsers = users.filter(u => (event.waitingList || []).includes(u.id));

          return (
            <div key={event.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col overflow-hidden transition hover:shadow-md">
               <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-3">
                     <span className="bg-purple-100 text-purple-800 text-xs font-bold px-2 py-1 rounded dark:bg-purple-900/30 dark:text-purple-300 uppercase tracking-wide">
                        Bibilung Class
                     </span>
                     <div className="flex gap-1">
                       <button onClick={() => openViewModal(event)} className="text-gray-400 hover:text-primary transition p-1" title="View Details">
                           <Eye size={16} />
                       </button>
                       {showManageButtons && (
                         <>
                           <button onClick={() => openEditModal(event)} className="text-gray-400 hover:text-blue-500 transition p-1" title="Edit">
                              <Edit size={16} />
                           </button>
                           <button onClick={() => deleteTutorEvent(event.id)} className="text-gray-400 hover:text-red-500 transition p-1" title="Delete">
                             <Trash2 size={16} />
                           </button>
                         </>
                       )}
                     </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{event.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">{event.description}</p>
                  
                  <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
                     <div className="flex items-center gap-2">
                        <User size={16} className="text-primary" />
                        <span>Tutor: <span className="font-semibold text-gray-700 dark:text-gray-200">{event.tutorName}</span></span>
                     </div>
                     <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-primary" />
                        <span>{eventDate.toLocaleDateString()}</span>
                     </div>
                     <div className="flex items-center gap-2">
                        <Clock size={16} className="text-primary" />
                        <span>{eventDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                     </div>
                  </div>

                  {/* Participant List */}
                  <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                     <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400">
                        <Users size={14} /> Registered Students ({joinedUsers.length})
                     </div>
                     <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto custom-scrollbar">
                        {joinedUsers.length === 0 ? (
                           <span className="text-xs text-gray-400 italic">No participants yet.</span>
                        ) : (
                           joinedUsers.map(u => (
                             <div key={u.id} className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-700/50 px-2 py-1 rounded-full border border-gray-200 dark:border-gray-600" title={u.fullName}>
                                <div className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-bold">
                                   {u.username.substring(0,2).toUpperCase()}
                                </div>
                                <span className="text-xs text-gray-700 dark:text-gray-300 max-w-[80px] truncate">{u.fullName.split(' ')[0]}</span> 
                             </div>
                           ))
                        )}
                     </div>
                  </div>
                  
                  {/* Waiting List - Only Visible to Admin/Kurikulum/Owner */}
                  {showManageButtons && waitingUsers.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-dashed border-gray-200 dark:border-gray-600">
                          <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-yellow-600 dark:text-yellow-500">
                             <ClipboardList size={14} /> Waiting List ({waitingUsers.length})
                          </div>
                          <div className="space-y-2">
                              {waitingUsers.map(u => (
                                  <div key={u.id} className="flex justify-between items-center text-xs bg-yellow-50 dark:bg-yellow-900/10 p-2 rounded">
                                      <span className="text-gray-700 dark:text-gray-300">{u.fullName}</span>
                                      <button 
                                        onClick={() => promoteFromWaitingList(event.id, u.id)}
                                        className="flex items-center gap-1 bg-white dark:bg-gray-800 border border-green-200 text-green-600 px-2 py-1 rounded shadow-sm hover:bg-green-50 transition"
                                        title="Assign to class"
                                      >
                                          <UserPlus size={12} /> Assign
                                      </button>
                                  </div>
                              ))}
                          </div>
                      </div>
                  )}
               </div>

               <div className="bg-gray-50 dark:bg-gray-750 p-4 border-t dark:border-gray-700">
                  <div className="flex justify-between items-center mb-3 text-sm">
                     <span className="font-medium text-gray-600 dark:text-gray-300">Quota</span>
                     <span className={`${isFull ? 'text-red-500' : 'text-green-600'} font-bold`}>
                        {event.participants.length} / {event.maxParticipants}
                     </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4 overflow-hidden">
                     <div 
                        className={`h-2 rounded-full transition-all duration-500 ${getCapacityColor(event.participants.length, event.maxParticipants)}`} 
                        style={{ width: `${(event.participants.length / event.maxParticipants) * 100}%` }}
                     ></div>
                  </div>

                  {isJoined ? (
                     <button 
                        onClick={() => leaveTutorEvent(event.id)}
                        className="w-full py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 dark:border-red-900 dark:text-red-400 flex items-center justify-center gap-2 transition"
                     >
                        <LogOut size={18} /> Leave Class
                     </button>
                  ) : isWaitlisted ? (
                    <button 
                        onClick={() => leaveTutorEvent(event.id)}
                        className="w-full py-2 rounded-lg border border-yellow-200 text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 dark:border-yellow-900 dark:text-yellow-400 flex items-center justify-center gap-2 transition"
                     >
                        <LogOut size={18} /> Leave Waitlist
                     </button>
                  ) : (
                     <button 
                        onClick={() => joinTutorEvent(event.id)}
                        disabled={!canJoin}
                        className={`w-full py-2 rounded-lg text-white flex items-center justify-center gap-2 transition font-medium
                           ${!canJoin 
                              ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed text-gray-500' 
                              : isFull 
                                ? 'bg-yellow-500 hover:bg-yellow-600 text-white' 
                                : 'bg-primary hover:bg-blue-600 shadow-sm hover:shadow'
                           }
                        `}
                     >
                        {!canJoin ? 'Students Only' : isFull ? 'Join Waitlist' : <><LogIn size={18} /> Join Class</>}
                     </button>
                  )}
               </div>
            </div>
          );
        })}
      </div>
      
      {tutorEvents.length === 0 && (
         <div className="text-center py-20 text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-700 mt-8">
            <GraduationCap size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No active tutor events yet.</p>
            {canCreate && <p className="text-sm">Be the first Murid Bibilung to create one!</p>}
         </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl w-full max-w-md shadow-2xl transform scale-100 transition-all max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
               <h3 className="text-xl font-bold dark:text-white flex items-center gap-2">
                 {viewOnly ? (
                    <><Eye className="text-primary" size={24} /> Event Details</>
                 ) : isEditMode ? (
                    <><Edit className="text-primary" size={24} /> Edit Tutor Event</>
                 ) : (
                    <><Plus className="text-primary" size={24} /> Create Tutor Event</>
                 )}
               </h3>
               <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white">
                 <X size={24} />
               </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Topic / Title</label>
                 <input 
                  disabled={viewOnly}
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-primary outline-none disabled:opacity-70 disabled:cursor-not-allowed"
                  placeholder="e.g. Advanced CSS Grid"
                  required
                  value={eventForm.title}
                  onChange={e => setEventForm({...eventForm, title: e.target.value})}
                />
              </div>
              
              <div>
                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                 <textarea 
                  disabled={viewOnly}
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-primary outline-none disabled:opacity-70 disabled:cursor-not-allowed"
                  placeholder="What will be discussed?"
                  rows={3}
                  required
                  value={eventForm.description}
                  onChange={e => setEventForm({...eventForm, description: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                    <input 
                     disabled={viewOnly}
                     type="date"
                     className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-primary outline-none disabled:opacity-70 disabled:cursor-not-allowed"
                     required
                     value={eventForm.date}
                     onChange={e => setEventForm({...eventForm, date: e.target.value})}
                   />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Time</label>
                    <input 
                     disabled={viewOnly}
                     type="time"
                     className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-primary outline-none disabled:opacity-70 disabled:cursor-not-allowed"
                     required
                     value={eventForm.time}
                     onChange={e => setEventForm({...eventForm, time: e.target.value})}
                   />
                 </div>
              </div>

              <div>
                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Max Participants</label>
                 <input 
                  disabled={viewOnly}
                  type="number"
                  min="1"
                  max="50"
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-primary outline-none disabled:opacity-70 disabled:cursor-not-allowed"
                  required
                  value={eventForm.maxParticipants}
                  onChange={e => setEventForm({...eventForm, maxParticipants: Number(e.target.value)})}
                />
              </div>

              {/* Participant Management Section */}
              {(isEditMode || viewOnly) && activeEvent && (
                 <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="font-bold text-gray-800 dark:text-white mb-2 flex items-center justify-between">
                       <span>Participants ({activeEventParticipants.length}/{eventForm.maxParticipants})</span>
                    </h4>
                    
                    {/* Add Student Control - Only in Edit Mode */}
                    {isEditMode && (
                        <div className="flex gap-2 mb-3">
                           <select 
                              className="flex-1 p-2 border rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                              value={studentToAssign}
                              onChange={e => setStudentToAssign(e.target.value)}
                           >
                              <option value="">Select Student to Assign...</option>
                              {availableStudents.map(s => <option key={s.id} value={s.id}>{s.fullName}</option>)}
                           </select>
                           <button 
                              type="button"
                              onClick={handleAssignStudent}
                              disabled={!studentToAssign}
                              className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                           >
                              <Plus size={16} /> Add
                           </button>
                        </div>
                    )}

                    <div className="space-y-2 max-h-32 overflow-y-auto custom-scrollbar bg-gray-50 dark:bg-gray-900/50 p-2 rounded">
                       {activeEventParticipants.length === 0 ? (
                           <p className="text-xs text-gray-400 italic text-center">No participants yet.</p>
                       ) : (
                           activeEventParticipants.map(p => (
                               <div key={p.id} className="flex justify-between items-center text-sm p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
                                   <div className="flex items-center gap-2">
                                       <div className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-bold">
                                            {p.username.substring(0,2).toUpperCase()}
                                       </div>
                                       <span className="text-gray-700 dark:text-gray-300">{p.fullName}</span>
                                   </div>
                                   {isEditMode && (
                                       <button 
                                          type="button" 
                                          onClick={() => kickFromEvent(activeEvent.id, p.id)}
                                          className="text-red-500 hover:bg-red-50 p-1 rounded"
                                          title="Remove from event"
                                       >
                                           <X size={14} />
                                       </button>
                                   )}
                               </div>
                           ))
                       )}
                    </div>
                 </div>
              )}

              {!viewOnly && (
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition">Cancel</button>
                  <button type="submit" className="px-6 py-2 bg-primary text-white rounded-lg shadow hover:bg-blue-600 transition">
                      {isEditMode ? 'Update Event' : 'Create Event'}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};