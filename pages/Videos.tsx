import React, { useState } from 'react';
import { useStore } from '../context/Store';
import { Role } from '../types';
import { Video, Plus, Trash2, AlertCircle } from 'lucide-react';

export const Videos = () => {
  const { videos, subjects, currentUser, addVideo, deleteVideo } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [filterSubject, setFilterSubject] = useState('ALL');
  
  const [newVideo, setNewVideo] = useState({ title: '', url: '', subject: '', week: 1 });

  const canAdd = [Role.IT_LOGISTIK, Role.KURIKULUM, Role.ADMIN].includes(currentUser?.role as Role);

  const getEmbedUrl = (url: string) => {
    // 1. Handle Google Drive (Commonly confused with "Private link")
    // Converts /view or /edit links to /preview for embedding
    if (url.includes('drive.google.com') && (url.includes('/view') || url.includes('/edit'))) {
       return url.replace(/\/view.*|\/edit.*/, '/preview');
    }

    // 2. Handle YouTube (Standard, Shorts, Live, Unlisted)
    // Regex to extract Video ID from various YouTube URL formats
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/|live\/)([^#&?]*).*/;
    const match = url.match(regExp);

    if (match && match[2]) {
        // ID is usually 11 chars. We allow 10-12 to be safe.
        if (match[2].length >= 10) {
            return `https://www.youtube.com/embed/${match[2]}`;
        }
    }
    
    // Fallback if regex doesn't match (e.g. maybe it's already an embed link or non-youtube)
    return url;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    
    const finalUrl = getEmbedUrl(newVideo.url);

    addVideo({
      id: Date.now().toString(),
      title: newVideo.title,
      url: finalUrl,
      subject: newVideo.subject,
      week: Number(newVideo.week),
      uploadedBy: currentUser.role
    });
    setShowModal(false);
    setNewVideo({ title: '', url: '', subject: '', week: 1 });
  };

  const filteredVideos = filterSubject === 'ALL' 
    ? videos 
    : videos.filter(v => v.subject === filterSubject);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Video /> Class Videos
        </h1>
        {canAdd && (
          <button 
            onClick={() => setShowModal(true)}
            className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600"
          >
            <Plus size={18} /> Add Video
          </button>
        )}
      </div>

      <div className="mb-6">
        <select 
          value={filterSubject}
          onChange={(e) => setFilterSubject(e.target.value)}
          className="p-2 border rounded-lg bg-white dark:bg-gray-800 dark:text-white dark:border-gray-700 focus:ring-2 focus:ring-primary outline-none"
        >
          <option value="ALL">All Subjects</option>
          {subjects.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVideos.map(video => (
          <div key={video.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden group">
            <div className="aspect-video bg-gray-100 dark:bg-gray-900 relative">
              <iframe 
                src={video.url} 
                className="w-full h-full" 
                title={video.title} 
                allowFullScreen
                loading="lazy"
              />
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                 <span className="text-xs font-semibold bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-600 dark:text-gray-300">
                    Week {video.week}
                 </span>
                 {canAdd && (
                   <button 
                     onClick={() => deleteVideo(video.id)}
                     className="text-gray-400 hover:text-red-500 transition-colors"
                     title="Delete Video"
                   >
                     <Trash2 size={16} />
                   </button>
                 )}
              </div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-1">{video.title}</h3>
              <p className="text-sm text-primary mt-1">{video.subject}</p>
              <div className="mt-3 text-xs text-gray-400 flex items-center gap-1">
                 Uploaded by {video.uploadedBy}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredVideos.length === 0 && (
        <div className="text-center py-12 text-gray-400">No videos found.</div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold mb-4 dark:text-white">Add Video Material</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                <input 
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                  placeholder="e.g. Introduction to React"
                  required
                  value={newVideo.title}
                  onChange={e => setNewVideo({...newVideo, title: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Video URL</label>
                <input 
                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                    placeholder="YouTube or Google Drive Link"
                    required
                    value={newVideo.url}
                    onChange={e => setNewVideo({...newVideo, url: e.target.value})}
                />
                <div className="mt-2 text-[11px] text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 p-2 rounded flex gap-2 items-start">
                    <AlertCircle size={14} className="mt-0.5 shrink-0" />
                    <p>
                      For YouTube: Use <strong>Unlisted</strong> or <strong>Public</strong>. Private videos cannot be played.<br/>
                      For Drive: Ensure "Anyone with the link" is set to Viewer.
                    </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject</label>
                <select 
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                  required
                  value={newVideo.subject}
                  onChange={e => setNewVideo({...newVideo, subject: e.target.value})}
                >
                  <option value="">Select Subject</option>
                  {subjects.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Week</label>
                <input 
                  type="number"
                  min="1"
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                  placeholder="Week Number"
                  required
                  value={newVideo.week}
                  onChange={e => setNewVideo({...newVideo, week: Number(e.target.value)})}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-primary text-white rounded-lg shadow hover:bg-blue-600 transition">Save Video</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};