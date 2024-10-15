
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, PlusCircle } from 'lucide-react';
import { useOkto } from "okto-sdk-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useNavigate } from 'react-router-dom';
import Head from './Head';
import Profilebar from './Profilebar';

export default function Dashboard({ setAuthToken, authToken, handleLogout }) {
  const [dbtoken, setDbtoken] = useState(null)
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);
  const [error, setError] = useState(null);
  const { getUserDetails, logOut } = useOkto();
  const [userData, setUserData] = useState({
   
    avatar: '../../public/profile.svg',
    userId: 'a51821',
    totalJournals: 35,
    groupsWon: 12,
    tokensEarned: 427.44,
    currentStreak: 26,
    leaderboardRank: 3
  });
  const [journals, setJournals] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  useEffect(()=> {
    localStorage.setItem("dbtoken", dbtoken);
    fetchJournals();
  },[dbtoken]);
  
  useEffect( () => {
    fetchUserDetails();
    
  }, []);

  const fetchJournals = async () => {
    console.log("inside fetch journal",dbtoken);
    const response = await axios.post("http://localhost:3000/api/all_journals",
       {
        Token: dbtoken
      }
    )
    console.log("reposnee for journals",response)
    setJournals(response.data.Journals)
  }
  const fetchUserDetails = async () => {
    try {
      const details = await getUserDetails();
      console.log("User details fetched from Okto:", details);
      setUserDetails(details);

      const authResponse =  await axios.post('http://localhost:3000/api/auth', {
        Email: details.email,
        });
        setDbtoken(authResponse.data.Token)
        
        console.log("here res",authResponse)
      if (authResponse.status === 200) {
        console.log('User authenticated successfully:', authResponse.data.Token);
      } else {
        console.error('Authentication failed');
      }
    } catch (error) {
      setError(`Failed to fetch user details or authenticate: ${error.message}`);
    }
  };

  const filteredJournals = journals.filter(journal =>
    journal.Title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNewJournal = () => {
    navigate('/new_journal');
  };

  const handleJoinGroup = () => {
    setShowPopup(true);
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <Head/>

     <Profilebar/>

     

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mb-4">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search journals..."
                className="w-full bg-gray-700 text-white px-4 py-2 pl-10 rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <button
              onClick={handleNewJournal}
              className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <PlusCircle size={20} />
              New Journal
            </button>
          </div>

          <div className="space-y-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 400px)' }}>
            {filteredJournals.length > 0 ? (
              filteredJournals.map(journal => (
                <div key={journal.id} className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-xl font-semibold mb-2">{journal.Title}</h3>
                  <p className="text-gray-400">{journal.Description}</p>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-400">No journals found.</p>
            )}
          </div>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Journal Groups</h2>
          <div className="space-y-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 400px)' }}>
            {[1, 2, 3, 4].map((group) => (
              <div key={group} className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Fitness Goal Gang</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Entry Fee: 10 $NOTE</div>
                  <div>Duration: 14 Days</div>
                  <div>Max Players: 55</div>
                  <div>Current Players: 33</div>
                </div>
                <button
                  onClick={handleJoinGroup}
                  className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg w-full"
                >
                  Join
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Dialog open={showPopup} onOpenChange={setShowPopup}>
        <DialogContent className="bg-gray-1000 bg-opacity-20 backdrop-filter backdrop-blur-lg text-white border border-gray-600 shadow-lg">
          <DialogHeader>
            <DialogTitle>Yay! You discovered something...</DialogTitle>
            <DialogDescription>
              This feature to join groups and take part in journals will be launched soon in v2
            </DialogDescription>
          </DialogHeader>
          <button
            onClick={() => setShowPopup(false)}
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg w-full"
          >
            Close
          </button>
        </DialogContent>
      </Dialog>
    </div>
  );


}