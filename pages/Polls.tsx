import React, { useState } from 'react';
import { useStore } from '../context/Store';
import { Poll, PollOption, Role } from '../types';
import { BarChart2, Plus, X, CheckCircle, Clock, EyeOff } from 'lucide-react';

export const Polls = () => {
  const { polls, createPoll, votePoll, deletePoll, currentUser } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [newPoll, setNewPoll] = useState({
    question: '',
    options: ['', ''],
    deadline: '',
    allowMultiple: false,
    isAnonymous: false
  });

  const canCreate = [Role.ADMIN, Role.KOMTI, Role.WAKOMTI, Role.SEKRETARIS, Role.BENDAHARA].includes(currentUser?.role as Role);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const options: PollOption[] = newPoll.options
      .filter(opt => opt.trim() !== '')
      .map((opt, idx) => ({
        id: `opt_${Date.now()}_${idx}`,
        text: opt,
        votes: []
      }));

    if (options.length < 2) {
      alert('Please provide at least 2 options.');
      return;
    }

    const poll: Poll = {
      id: Date.now().toString(),
      question: newPoll.question,
      options: options,
      createdBy: currentUser.username,
      createdAt: new Date().toISOString(),
      deadline: new Date(newPoll.deadline).toISOString(),
      isActive: true,
      allowMultiple: newPoll.allowMultiple,
      isAnonymous: newPoll.isAnonymous
    };

    createPoll(poll);
    setShowModal(false);
    setNewPoll({ question: '', options: ['', ''], deadline: '', allowMultiple: false, isAnonymous: false });
  };

  const handleOptionChange = (index: number, value: string) => {
    const updatedOptions = [...newPoll.options];
    updatedOptions[index] = value;
    setNewPoll({ ...newPoll, options: updatedOptions });
  };

  const addOptionField = () => {
    setNewPoll({ ...newPoll, options: [...newPoll.options, ''] });
  };

  const removeOptionField = (index: number) => {
    if (newPoll.options.length <= 2) return;
    const updatedOptions = newPoll.options.filter((_, i) => i !== index);
    setNewPoll({ ...newPoll, options: updatedOptions });
  };

  const isPollActive = (deadline: string) => {
    return new Date() < new Date(deadline);
  };

  const getTotalVotes = (poll: Poll) => {
    return poll.options.reduce((acc, opt) => acc + opt.votes.length, 0);
  };

  const getVotePercentage = (poll: Poll, optionId: string) => {
    const total = getTotalVotes(poll);
    if (total === 0) return 0;
    const optionVotes = poll.options.find(o => o.id === optionId)?.votes.length || 0;
    return Math.round((optionVotes / total) * 100);
  };

  const hasUserVoted = (poll: Poll) => {
    if (!currentUser) return false;
    return poll.options.some(opt => opt.votes.includes(currentUser.id));
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <BarChart2 className="text-purple-500" size={32} />
            Class Polls
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Voice your opinion on class decisions.
          </p>
        </div>
        
        {canCreate && (
          <button
            onClick={() => setShowModal(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
          >
            <Plus size={20} /> Create Poll
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {polls.map((poll) => {
          const active = isPollActive(poll.deadline);
          const userVoted = hasUserVoted(poll);
          const totalVotes = getTotalVotes(poll);

          return (
            <div key={poll.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col">
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{poll.question}</h3>
                  <div className="flex flex-col items-end gap-1">
                    {active ? (
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium flex items-center gap-1">
                        <Clock size={12} /> Active
                        </span>
                    ) : (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                        Closed
                        </span>
                    )}
                    {poll.isAnonymous && (
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-[10px] rounded-full font-medium flex items-center gap-1" title="Votes are anonymous">
                            <EyeOff size={10} /> Anon
                        </span>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  {poll.options.map((option) => {
                    const percentage = getVotePercentage(poll, option.id);
                    const isSelected = option.votes.includes(currentUser?.id || '');

                    return (
                      <div key={option.id} className="relative">
                        {/* Progress Bar Background */}
                        <div className="absolute inset-0 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-500 ${isSelected ? 'bg-purple-200 dark:bg-purple-900/40' : 'bg-gray-200 dark:bg-gray-600'}`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>

                        {/* Content */}
                        <button
                          onClick={() => active && (!userVoted || poll.allowMultiple) && votePoll(poll.id, option.id)}
                          disabled={!active || (userVoted && !poll.allowMultiple && !isSelected)}
                          className={`relative w-full p-3 flex justify-between items-center z-10 text-sm font-medium rounded-lg transition-colors ${
                            active && (!userVoted || poll.allowMultiple) 
                              ? 'hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer' 
                              : 'cursor-default'
                          }`}
                        >
                          <span className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
                            {isSelected && <CheckCircle size={16} className="text-purple-600 dark:text-purple-400" />}
                            {option.text}
                          </span>
                          <span className="text-gray-500 dark:text-gray-400 text-xs">
                            {percentage}% ({option.votes.length})
                          </span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-700/30 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                <span>Total votes: {totalVotes}</span>
                <span>Ends: {new Date(poll.deadline).toLocaleDateString()}</span>
                {canCreate && (
                  <button 
                    onClick={() => {
                        if(window.confirm('Delete this poll?')) deletePoll(poll.id);
                    }}
                    className="text-red-500 hover:text-red-700 ml-2"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <X size={24} />
            </button>
            
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Create New Poll</h3>
            
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Question</label>
                <input
                  type="text"
                  required
                  placeholder="What should we decide?"
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={newPoll.question}
                  onChange={e => setNewPoll({ ...newPoll, question: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Options</label>
                <div className="space-y-2">
                  {newPoll.options.map((opt, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="text"
                        required
                        placeholder={`Option ${idx + 1}`}
                        className="flex-1 p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        value={opt}
                        onChange={e => handleOptionChange(idx, e.target.value)}
                      />
                      {newPoll.options.length > 2 && (
                        <button
                          type="button"
                          onClick={() => removeOptionField(idx)}
                          className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                        >
                          <X size={18} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addOptionField}
                  className="mt-2 text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1"
                >
                  <Plus size={16} /> Add Option
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Deadline</label>
                <input
                  type="date"
                  required
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={newPoll.deadline}
                  onChange={e => setNewPoll({ ...newPoll, deadline: e.target.value })}
                />
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                    <input
                    type="checkbox"
                    id="allowMultiple"
                    className="w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                    checked={newPoll.allowMultiple}
                    onChange={e => setNewPoll({ ...newPoll, allowMultiple: e.target.checked })}
                    />
                    <label htmlFor="allowMultiple" className="text-sm text-gray-700 dark:text-gray-300">Allow multiple choices</label>
                </div>
                <div className="flex items-center gap-2">
                    <input
                    type="checkbox"
                    id="isAnonymous"
                    className="w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                    checked={newPoll.isAnonymous}
                    onChange={e => setNewPoll({ ...newPoll, isAnonymous: e.target.checked })}
                    />
                    <label htmlFor="isAnonymous" className="text-sm text-gray-700 dark:text-gray-300">Anonymous Poll (Hide voter identities)</label>
                </div>
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
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Create Poll
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
