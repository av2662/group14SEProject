/*
It works in conjuction with goals.jsx 
to set the logic for our habits page.
Habits are stored to the database. But some features that
appear on the screen such as logging habits, is not currently functional.
*/

import React, { useState, useEffect } from "react";
import Axios from 'axios';
import './Goals.css';
import {FaRegTrashAlt, FaPencilAlt} from 'react-icons/fa';
import { Button } from '../Button';
import '../../components/Button.css'


const Goals = () => {
    const user = JSON.parse(window.localStorage.getItem("user")); // Parse user object and retrieve from local storage// this no longer works- anna
    const idUsers = window.localStorage.getItem("user"); //this gets the userId 
   
    const [AllGoals, setAllGoals] = useState([]);
    const [showHabitsPopup, setShowHabitsPopup] = useState(false);
    const [eventHabitTitle, setEventHabitTitle] = useState('');
    const [repeatOption, setRepeatOption] = useState(''); // 'daily' or 'weekly'
    const [editingHabitId, setEditingHabitId] = useState(null); // Track the ID of the habit being edited

    useEffect(() => {
        // Fetch habits when component mounts
        fetchHabits();
    }, []);

    const fetchHabits = async () => {
        try {
            const response = await Axios.get('http://localhost:3001/habitsGet', {
                params: { idUsers: idUsers },
              })
              //if user does not have any habits
              if (response.data && response.data.message === "Error receiving habits") {
                setAllGoals([]);
                return;
              }
            setAllGoals(response.data);
        } catch (error) {
            console.error('Error fetching habits:', error);
        }
    };

    //console.log("User:", user); // Log user object to verify 

    const handleRepeatOptionClick = (option) => {
        setRepeatOption(option);
    }

    const handleAddGoalClick = () =>{
        setShowHabitsPopup(true);
    }


    const handleSaveHabit = () => {
        // Check if user object is defined
        if (!user) {
            console.error('User object is undefined.');
            // Display an error message to the user or redirect to login page
            return;
        }
    
        // Construct the newHabit object with name, repeat, and idUsers properties
        const newHabit = {
            name: eventHabitTitle,
            repeat: repeatOption,
            idUsers: idUsers // Include idUsers in the newHabit object
        };
    
        // Send POST request to create a new habit
        Axios.post('http://localhost:3001/habits', newHabit)
            .then(response => {
                console.log("Habit created successfully");
                // Fetch updated habits after adding a new one
                fetchHabits();
                // Reset form fields and close popup
                setShowHabitsPopup(false);
                setEventHabitTitle('');
                setRepeatOption('');
            })
            .catch(error => {
                console.error('Error adding habit:', error);
                //alert('Error adding habit. Please try again.'); // Display error message
            });
    }
    

    const handleEditHabit = (habit) => {

        // Set the habit's data in the form fields
        setEventHabitTitle(habit.name);
        setRepeatOption(habit.repeat);
        // Set editingHabitId to the habit's ID
        setEditingHabitId(habit.id);
        // Show the popup for editing
        setShowHabitsPopup(true);
    }

    const handleDeleteHabit = async (habitId) => {
        try {
            await Axios.delete(`http://localhost:3001/habits/${habitId}`);
            fetchHabits(); // Refresh habits after deleting
        } catch (error) {
            console.error('Error deleting habit:', error);
        }
    }

    return (
        <div className='GoalsContainer'>
            <div className='GoalsHeader'>
                <h1 className='TitleSection'>Habits</h1>
                <div className="AddGoalButton">
                    <Button buttonSize='btn--small' buttonColor='maroon' onClick={handleAddGoalClick}>Add Habit</Button>
                {/* <Button buttonSize='btn--small' buttonColor='maroon' onClick={handleAddGoalClick}>Add Habit</Button> */}
                </div>
            </div>
            {AllGoals.map((goal, indx) => (
                <div className='GoalRow' key={`goal-number-${indx}`}> {/* Ensure unique key for each GoalRow */}
                {/*<div className='GoalRow' key={`goal-number-` + indx}> */}
                    <div className='Name'>{goal.name}</div>
                    <div className='Action'>
                        <FaPencilAlt onClick={() => handleEditHabit(goal)} /> 
                        <FaRegTrashAlt onClick={() => handleDeleteHabit(goal.id)} />
                    </div>
                </div>
            ))}
            {/* Popup for creating new habit */}
            {showHabitsPopup &&(
                <div className="popupHabits">
                    <div className="popup-contentHabits">
                        <div className="popup-contentHabitsHeader">
                            <h2>New Habit</h2>
                            <Button buttonSize='btn--small' buttonColor='maroon' onClick={() =>{setShowHabitsPopup(false)}} >Close</Button> 
                        </div>
                    </div>
                    <div className="popup-contentHabitsEventTitle">
                        <label className="popup-labels">Habit Title:</label>
                        <input
                        type="text"
                        className="form-control"
                        id="event-title"
                        value={eventHabitTitle}
                        onChange={(e) => setEventHabitTitle(e.target.value)}
                        />
                    </div>
                    <div className="popup-contentHabitsRepeat">
                        Repeat
                    </div>
                    <div className="popup-buttons">
                    <Button
                            buttonSize='btn--medium'
                            buttonColor={repeatOption === 'weekly' ? 'green' : 'maroon'}
                            onClick={() => handleRepeatOptionClick('weekly')}
                        >
                            Weekly
                        </Button>
                        <Button
                            buttonSize='btn--medium'
                            buttonColor={repeatOption === 'daily' ? 'green' : 'maroon'}
                            onClick={() => handleRepeatOptionClick('daily')}
                        >
                            Daily
                        </Button>
                        {/* <Button buttonSize='btn--medium' buttonColor='maroon'>Weekly</Button>
                        <Button buttonSize='btn--medium' buttonColor='maroon'>Daily</Button> */}
                    </div>
                    <div className="popup-saveButton">
                    <Button buttonSize='btn--small' buttonColor='maroon' onClick={handleSaveHabit}>Save</Button>
                    {/* <Button buttonSize='btn--small' buttonColor='maroon' onClick={() =>{setShowHabitsPopup(false)}} >Save</Button> */}
                    </div>
                </div>
            )}
        </div>
    )
}

export default Goals