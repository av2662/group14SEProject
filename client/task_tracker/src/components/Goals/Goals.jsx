import React, { useState, useEffect } from "react";
import './Goals.css';
import { Button } from '../Button';
import '../../components/Button.css'


const Goals = () => {
    const [AllGoals, setAllGoals] = useState([
        { id: 0, name: "Loose Weight" },
        { id: 1, name: "Goal 2" },
        { id: 2, name: "Goal 3" },
        { id: 3, name: "Goal 4" }
    ]);
    const days = ["M", "T", "W", "TH", "F", "S", "S"];
    const [showHabitsPopup, setShowHabitsPopup] = useState(false);
    const [eventHabitTitle, setEventHabitTitle] = useState('');
    const [selectedDays, setSelectedDays] = useState([]);  //making buttons clickable
    const [repeatOption, setRepeatOption] = useState(''); // 'daily' or 'weekly'


    const handleDayClick = (day) => {
        setSelectedDays(prevSelectedDays => {
            if (prevSelectedDays.includes(day)) {
                return prevSelectedDays.filter(d => d !== day);
            } else {
                return [...prevSelectedDays, day];
            }
        });
    }

    const handleRepeatOptionClick = (option) => {
        setRepeatOption(option);
    }

    const handleAddGoalClick = () =>{
        setShowHabitsPopup(true);
    }


    const handleSaveHabit = () => {
        // Find the maximum id from existing goals
        const maxId = Math.max(...AllGoals.map(goal => goal.id));

        // Generate a new habit with a unique id
        const newHabit = {
            id: AllGoals.length, // Generate unique ID
            name: eventHabitTitle,
            days: selectedDays,
            repeat: repeatOption
        };

        //Add the new habit to the AllGoals array
        //setAllGoals([...AllGoals, newHabit]);
        setAllGoals(prevGoals => [...prevGoals, newHabit]);
        setShowHabitsPopup(false);
    }

    const handleEditHabit = (editedHabit) => {
        const updatedGoals = AllGoals.map(goal => 
            goal.id === editedHabit.id ? editedHabit : goal
        );
        setAllGoals(updatedGoals);
        setShowHabitsPopup(false);
    }

    const handleDeleteHabit = (habitId) => {
        const updatedGoals = AllGoals.filter(goal => goal.id !== habitId);
        setAllGoals(updatedGoals);
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
                        <img src='img/edit.png' alt='edit-btn' onClick={() => handleEditHabit(goal)} />
                        <img src='img/delete.png' alt='delete-btn' onClick={() => handleDeleteHabit(goal.id)} />
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
                    <div className="popup-days">
                        On these days
                    </div>
                    <div className="popup-daysButtons">
                    {days?.map((item,index) =>(
                        <Button
                            key={`day-button-${index}`}
                            buttonSize='btn--xs'
                            buttonColor={selectedDays.includes(item) ? 'green' : 'maroon'}
                            onClick={() => handleDayClick(item)}
                        >
                            {item}
                        </Button>
                        // <Button key={`day-button-${index}`} buttonSize='btn--xs' buttonColor='maroon'>{item}</Button>
                        // // <Button buttonSize='btn--xs' buttonColor='maroon'>{item}</Button> 
                    ))}
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