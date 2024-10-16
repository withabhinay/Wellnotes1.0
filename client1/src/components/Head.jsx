import { useOkto } from "okto-sdk-react";
import React, { useState, useEffect } from 'react';

export default function Head() {

    const [userDetails, setUserDetails] = useState(null);
    const { getUserDetails, logOut } = useOkto();
    useEffect( () => {
      fetchUserDetails(); 
    }, []);
    const fetchUserDetails = async () => {      
          const details = await getUserDetails();
          console.log("User details fetched from Okto:", details);
          setUserDetails(details);
    }
    
    return <header className="flex justify-between items-center mb-8">
      <img src="/logo.svg" alt="Wellnotes Logo" width={150} height={50} />
      <div className="flex items-center gap-4">
        <span>Hey there 👋</span>
        <span className="font-bold">
          {userDetails ? userDetails.email : 'Loading...'}
        </span>
        <img
          src={userDetails && userDetails.avatar ? userDetails.avatar : 'https://qw.getskybuy.shop/img/profile.svg'}
          alt="User avatar"
          className="w-10 h-10 rounded-full" />
      </div>
    </header>;
  }