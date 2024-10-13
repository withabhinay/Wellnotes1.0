import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, PlusCircle } from 'lucide-react';

export default function Dashboard() {
  const [userData, setUserData] = useState({
    name: '',
    avatar: '/placeholder.svg',
    userId: 'N/A',
    totalJournals: 0,
    groupsWon: 0,
    tokensEarned: 0
  });
  const [journals, setJournals] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Fetch user data
    axios.get('/api/user-data')
      .then(response => setUserData(prevData => ({ ...prevData, ...response.data })))
      .catch(error => console.error('Error fetching user data:', error));

    // Fetch journals
    axios.get('/api/journals')
      .then(response => setJournals(response.data))
      .catch(error => console.error('Error fetching journals:', error));
  }, []);

  const filteredJournals = journals.filter(journal =>
    journal.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNewJournal = () => {
    // Navigate to new journal page
    window.location.href = '/new-journal';
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-green-400">Wellnotes</h1>
        <div className="flex items-center gap-4">
          <span>Hey there 👋</span>
          <span className="font-bold">{userData.name || 'User'}</span>
          <img src={userData.avatar} alt="User avatar" className="w-10 h-10 rounded-full" />
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">User ID</h2>
          <p className="text-2xl font-bold">{userData.userId}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Total Journals</h2>
          <p className="text-2xl font-bold">{userData.totalJournals}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Groups Won</h2>
          <p className="text-2xl font-bold">{userData.groupsWon}</p>
        </div>
      </div>

      <div className="bg-gray-800 p-4 rounded-lg mb-8">
        <h2 className="text-lg font-semibold mb-2">Tokens Earned</h2>
        <p className="text-2xl font-bold">{userData.tokensEarned} $NOTE</p>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search journals..."
            className="bg-gray-700 text-white px-4 py-2 pl-10 rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" />
        </div>
        <button
          onClick={handleNewJournal}
          className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <PlusCircle size={20} />
          New Journal
        </button>
      </div>

      <div className="space-y-4">
        {filteredJournals.length > 0 ? (
          filteredJournals.map(journal => (
            <div key={journal.id} className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">{journal.title}</h3>
              <p className="text-gray-400">{journal.excerpt}</p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400">No journals found.</p>
        )}
      </div>
    </div>
  );
}