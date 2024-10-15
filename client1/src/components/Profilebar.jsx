import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Profilebar() {
  const [profiledata, setprofiledata] = useState(null);
  
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const dbtoken = localStorage.getItem("dbtoken");
    console.log("Fetching profile", dbtoken);
    try {
      const response = await axios.post("wellnotes.getskybuy.shop/api/profile", {
        Token: dbtoken
      });
      console.log("Profile response", response.data);
      setprofiledata(response.data);  // Set response data to state
    } catch (error) {
      console.error("Error fetching profile", error);
    }
  };

  // Render a loading message while profiledata is null


  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="bg-gray-800 p-4 rounded-lg">
        <h2 className="text-lg font-bold mb-2">User ID</h2>
        <p className="text-1xl font-semibold">{profiledata ? profiledata.Journals._id : 'Loading...'}</p>
      </div>
      <div className="bg-gray-800 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Total Journals</h2>
        {/* Fixed length access */}
        <p className="text-2xl font-bold">{profiledata ? profiledata.Journals.Journals.length: 'Loading...'}</p>
      </div>
      <div className="bg-gray-800 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Groups Won</h2>
        <p className="text-2xl font-bold">0</p>
      </div>
      <div className="bg-gray-800 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Leaderboard Rank</h2>
        <p className="text-2xl font-bold">#3</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Tokens Earned</h2>
          <p className="text-2xl font-bold">{profiledata ? profiledata.Journals.Journals.length: 'Loading...'} </p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Current Streak</h2>
          <p className="text-2xl font-bold">0 Days</p>
        </div>
      </div>
    </div>
  );
}
