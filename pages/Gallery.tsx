import React, { useState } from 'react';
import { useStore } from '../context/Store';
import { GalleryItem, Role } from '../types';
import { Image, Plus, Trash2, X } from 'lucide-react';

export const Gallery = () => {
  const { galleryItems, addGalleryItem, deleteGalleryItem, currentUser } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [newItem, setNewItem] = useState({ url: '', caption: '' });

  const canUpload = true; // Allow everyone to upload for now, or restrict to specific roles

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const item: GalleryItem = {
      id: Date.now().toString(),
      url: newItem.url,
      caption: newItem.caption,
      type: 'IMAGE',
      uploadedBy: currentUser.username,
      timestamp: new Date().toISOString()
    };

    addGalleryItem(item);
    setShowModal(false);
    setNewItem({ url: '', caption: '' });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this memory?')) {
      deleteGalleryItem(id);
    }
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Image className="text-secondary" size={32} />
            Class Gallery
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Capturing our best moments together.
          </p>
        </div>
        
        {canUpload && (
          <button
            onClick={() => setShowModal(true)}
            className="bg-secondary hover:bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
          >
            <Plus size={20} /> Add Memory
          </button>
        )}
      </div>

      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        {galleryItems.map((item) => (
          <div key={item.id} className="break-inside-avoid bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md border border-gray-100 dark:border-gray-700 group relative">
            <img 
              src={item.url} 
              alt={item.caption}
              className="w-full h-auto object-cover hover:opacity-95 transition-opacity"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Image+Error';
              }}
            />
            <div className="p-4">
              <p className="font-medium text-gray-800 dark:text-white">{item.caption}</p>
              <div className="flex justify-between items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
                <span>By @{item.uploadedBy}</span>
                <span>{new Date(item.timestamp).toLocaleDateString()}</span>
              </div>
            </div>

            {(currentUser?.role === Role.ADMIN || currentUser?.username === item.uploadedBy) && (
              <button
                onClick={() => handleDelete(item.id)}
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                title="Delete image"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6 shadow-2xl relative">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <X size={24} />
            </button>
            
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Add New Memory</h3>
            
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Image URL</label>
                <input
                  type="url"
                  required
                  placeholder="https://example.com/image.jpg"
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={newItem.url}
                  onChange={e => setNewItem({ ...newItem, url: e.target.value })}
                />
                <p className="text-xs text-gray-500 mt-1">Paste a direct link to an image.</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Caption</label>
                <input
                  type="text"
                  required
                  placeholder="What's happening in this photo?"
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={newItem.caption}
                  onChange={e => setNewItem({ ...newItem, caption: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-indigo-600"
                >
                  Add Memory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
