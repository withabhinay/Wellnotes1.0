import { useOkto } from "okto-sdk-react";
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Head() {

    const [userDetails, setUserDetails] = useState(null);
    useEffect(() => {
      fetchProfile();
    }, []);
    const fetchProfile = async () => {
      const dbtoken = localStorage.getItem("dbtoken");
      console.log("Fetching profile", dbtoken);
      try {
        const response = await axios.post("https://zipbuy.in/api/profile", {
          Token: dbtoken
        });
        console.log("Profile response", response.data.User);
        setUserDetails(response.data.User);  // Set response data to state
      } catch (error) {
        console.error("Error fetching profile", error);
      }
    };
   
    
   
    
    
    return <header className="flex justify-between items-center mb-8">
      <img src="/logo.svg" alt="Wellnotes Logo" width={150} height={50} />
      <div className="flex items-center gap-4">
        <span>Hey there 👋</span>
        <span className="font-bold">
          {userDetails ? userDetails.Name : 'Loading...'}
        </span>
        <img
          src={userDetails? userDetails.Profile : 'https://zipbuy.in/img/profile.svg'}
          alt="User avatar"
          className="w-10 h-10 rounded-full" />
      </div>
    </header>;
  }