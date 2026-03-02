import React, { useState } from 'react';
import { useStore } from '../context/Store';
import { Role, TreasuryTransaction } from '../types';
import { DollarSign, TrendingUp, TrendingDown, Plus, Trash2, X } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const Treasury = () => {
  const { treasuryTransactions, addTransaction, deleteTransaction, currentUser } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [newTrans, setNewTrans] = useState({
    type: 'INCOME' as 'INCOME' | 'EXPENSE',
    amount: '',
    description: '',
    category: ''
  });

  const canManage = [Role.ADMIN, Role.BENDAHARA, Role.KOMTI, Role.WAKOMTI].includes(currentUser?.role as Role);

  const totalIncome = treasuryTransactions
    .filter(t => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = treasuryTransactions
    .filter(t => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  const chartData = [
    { name: 'Total', Income: totalIncome, Expense: totalExpense }
  ];

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const transaction: TreasuryTransaction = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      type: newTrans.type,
      amount: Number(newTrans.amount),
      description: newTrans.description,
      category: newTrans.category,
      recordedBy: currentUser.username
    };

    addTransaction(transaction);
    setShowModal(false);
    setNewTrans({ type: 'INCOME', amount: '', description: '', category: '' });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      deleteTransaction(id);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <DollarSign className="text-green-500" size={32} />
            Class Treasury
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Transparent financial management for AC24DIA.
          </p>
        </div>
        
        {canManage && (
          <button
            onClick={() => setShowModal(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
          >
            <Plus size={20} /> Add Transaction
          </button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
           <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Current Balance</h3>
           <p className={`text-3xl font-bold mt-2 ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
             {formatCurrency(balance)}
           </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
           <div className="flex items-center gap-2 mb-2">
             <TrendingUp className="text-green-500" size={20} />
             <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Income</h3>
           </div>
           <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalIncome)}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
           <div className="flex items-center gap-2 mb-2">
             <TrendingDown className="text-red-500" size={20} />
             <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Expense</h3>
           </div>
           <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalExpense)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Transaction History */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Transactions</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 text-xs uppercase">
                <tr>
                  <th className="px-6 py-3 font-medium">Date</th>
                  <th className="px-6 py-3 font-medium">Description</th>
                  <th className="px-6 py-3 font-medium">Category</th>
                  <th className="px-6 py-3 font-medium text-right">Amount</th>
                  {canManage && <th className="px-6 py-3 font-medium text-center">Action</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {treasuryTransactions.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {new Date(t.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                      {t.description}
                      <div className="text-xs text-gray-400 font-normal mt-0.5">By {t.recordedBy}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      <span className="px-2 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-700">
                        {t.category}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-sm font-bold text-right ${t.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                      {t.type === 'INCOME' ? '+' : '-'}{formatCurrency(t.amount)}
                    </td>
                    {canManage && (
                      <td className="px-6 py-4 text-center">
                        <button 
                          onClick={() => handleDelete(t.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
                {treasuryTransactions.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                      No transactions recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Financial Overview</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `Rp${value/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Legend />
                <Bar dataKey="Income" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Expense" fill="#EF4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
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
            
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Record Transaction</h3>
            
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setNewTrans({ ...newTrans, type: 'INCOME' })}
                  className={`p-3 rounded-lg border text-center font-medium transition-colors ${
                    newTrans.type === 'INCOME' 
                      ? 'bg-green-50 border-green-500 text-green-700 dark:bg-green-900/20 dark:text-green-400' 
                      : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400'
                  }`}
                >
                  Income
                </button>
                <button
                  type="button"
                  onClick={() => setNewTrans({ ...newTrans, type: 'EXPENSE' })}
                  className={`p-3 rounded-lg border text-center font-medium transition-colors ${
                    newTrans.type === 'EXPENSE' 
                      ? 'bg-red-50 border-red-500 text-red-700 dark:bg-red-900/20 dark:text-red-400' 
                      : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400'
                  }`}
                >
                  Expense
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount (IDR)</label>
                <input
                  type="number"
                  required
                  min="0"
                  placeholder="e.g. 50000"
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={newTrans.amount}
                  onChange={e => setNewTrans({ ...newTrans, amount: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <input
                  type="text"
                  required
                  placeholder="What is this for?"
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={newTrans.description}
                  onChange={e => setNewTrans({ ...newTrans, description: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                <select
                  required
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={newTrans.category}
                  onChange={e => setNewTrans({ ...newTrans, category: e.target.value })}
                >
                  <option value="">Select Category</option>
                  <option value="Kas Mingguan">Kas Mingguan</option>
                  <option value="Event">Event / Acara</option>
                  <option value="Perlengkapan">Perlengkapan Kelas</option>
                  <option value="Photocopy">Photocopy / Print</option>
                  <option value="Donasi">Donasi / Sumbangan</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
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
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
