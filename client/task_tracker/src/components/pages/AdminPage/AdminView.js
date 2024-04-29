/*-----------------------------------------
This file contains the logic for our admin page.
------------------------------------------*/
import React, { useState, useEffect } from 'react';
import Axios from 'axios'; // Import Axios for making HTTP requests
import './AdminView.css';

function AdminView() {
  // Define state variable for the start date
  const [startDate, setStartDate] = useState('');
  // Define state variable to store the fetched data
  const [userCount, setUserCount] = useState(null); // Initialize as null until data is fetched

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Make GET request to fetch admin info from the server with specified start date
      const response = await Axios.get(`http://localhost:3001/adminInfo?startDate=${startDate}`);
      // Update state with the fetched data
      setUserCount(response.data.userCount);
    } catch (error) {
      console.error('Error fetching admin info:', error);
    }
  };

  return (
    <div className='backgroundAdmin'>
      <div className='containerAdmin'>
        <div className='headerAdmin'>Admin</div>
       
        <div className='directionsAdmin'>
        {userCount !== null ? (
          <p>The number of new users since {startDate}: <span style={{ fontWeight: 'bold' }}>{userCount}</span></p>
        ) : (
          <p>Enter a start date and click submit to view the number of users that have registered since.</p>
        )}
        </div>
        <div className='adminDateRow'>
            <label>Date:</label>
            <input label="Date" type="date" id="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            <button type="submit" onClick={handleSubmit}>Submit</button>
        </div>
      </div>
    </div>
  );
}

export default AdminView;
