import React, { useState, useEffect } from "react";
import './Goals.css';
import { Button } from '../Button';
import '../../components/Button.css'


const Goals = () => {
    const AllGoals = [
        { id: 0, name: "Loose Weight" },
        { id: 1, name: "Goal 2" },
        { id: 2, name: "Goal 3" },
        { id: 3, name: "Goal 4" }
    ];
    const dayss = ["M", "T", "W", "T", "F", "S", "S"];
    const [showHabitsPopup, setShowHabitsPopup] = useState(false);
    const [eventHabitTitle, setEventHabitTitle] = useState('');

    const handleAddGoalClick = () =>{
        setShowHabitsPopup(true);
    }
    return (
        <div className='GoalsContainer'>
            <div className='GoalsHeader'>
                <h1 className='TitleSection'>Habits</h1>
                <Button buttonSize='btn--small' buttonColor='maroon' onClick={handleAddGoalClick}>Add Habit</Button>
            </div>
            {AllGoals.map((goal, indx) => (
                <div className='GoalRow' key={`goal-number-` + indx}>
                    <div className='Name'>{goal.name}</div>
                    <div className='Action'><img src='img/edit.png' alt='edit-btn' /><img src='img/delete.png' alt='delete-btn' /></div>
                </div>
            ))}
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
                        <Button buttonSize='btn--medium' buttonColor='maroon'>Weekly</Button>
                        <Button buttonSize='btn--medium' buttonColor='maroon'>Daily</Button>
                    </div>
                    <div className="popup-days">
                        On these days
                    </div>
                    <div className="popup-daysButtons">
                    {dayss?.map((item,index) =>(
                        <Button buttonSize='btn--xs' buttonColor='maroon'>{item}</Button>
                    ))}
                    </div>
                    <div className="popup-saveButton">
                    <Button buttonSize='btn--small' buttonColor='maroon' onClick={() =>{setShowHabitsPopup(false)}} >Save</Button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Goals