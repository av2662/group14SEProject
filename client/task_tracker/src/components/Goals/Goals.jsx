import React from 'react';
import './Goals.css';

const Goals = () => {
    const AllGoals = [
        { id: 0, name: "Loose Weight" },
        { id: 1, name: "Goal 2" },
        { id: 2, name: "Goal 3" },
        { id: 3, name: "Goal 4" }
    ];
    return (
        <div className='GoalsContainer'>
            <div className='GoalsHeader'>
                <div className='TitleSection'>Goals</div>
                <button className='AddGoalButton'>
                    <img src='img/add.png' alt='add-goal-btn' />Add Goals
                </button>
            </div>
            {AllGoals.map((goal, indx) => (
                <div className='GoalRow' key={`goal-number-` + indx}>
                    <div className='Name'>{goal.name}</div>
                    <div className='Action'><img src='img/edit.png' alt='edit-btn' /><img src='img/delete.png' alt='delete-btn' /></div>
                </div>
            ))}
        </div>
    )
}

export default Goals