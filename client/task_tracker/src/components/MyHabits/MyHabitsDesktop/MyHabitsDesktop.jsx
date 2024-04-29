/*
It works in conjuction with goals.jsx 
to set the logic for our habits page.
Habits are stored to the database. But some features that
appear on the screen such as logging habits, is not currently functional.

*/
import React, { useState, useEffect } from 'react';
import './MyHabitDesktop.css';
import '../../Button.css';
import { FaCircle, FaRegCircle } from 'react-icons/fa';
import Goals from '../../Goals/Goals';
import { Button } from '../../Button';

const MyHabitsDesktop = () => {
    const days = ["M", "T", "W", "TH", "F", "S", "Su"];
    const habits = [
        { name: "Walk Dog", repeat: "weekly" },
        { name: "Habit 2", repeat: "weekly" },
        { name: "Habit 3", repeat: "daily" },
        { name: "Habit 4", repeat: "daily" }
    ];
    const [showDaily, setShowDaily] = useState(false);
    const [showWeekly, setShowWeekly] = useState(true);

    // Initialize the clickedDays state with a structure that matches the number of habits
    const [clickedDays, setClickedDays] = useState(Array(habits.length).fill([]).map(() => []));

    const handleSelectWeekly = () => {
        setShowDaily(false);
        setShowWeekly(true);
    };
    const handleSelectDaily = () => {
        setShowWeekly(false);
        setShowDaily(true);
    };

    useEffect(() => {
        // This ensures clickedDays state updates when the number of habits changes
        setClickedDays(Array(habits.length).fill([]).map(() => []));
    }, [habits.length]);

    return (
        <div className='GridContainer'>
            <div className='NavContainer'>
                <Goals />
            </div>
            <div className='MainContainer'>
                <div className='HeaderContainer'>
                    <Button buttonSize='btn--medium' buttonColor='maroon' onClick={handleSelectWeekly}>Weekly</Button>
                    <Button buttonSize='btn--medium' buttonColor='maroon' onClick={handleSelectDaily}>Daily</Button>
                </div>
                {showDaily && (
                    <div className='MainGoalsContainer'>
                        {habits.filter(habit => habit.repeat === "daily").map((habit, index) => (
                            <Button key={index} buttonSize='btn--goalSmaller' buttonColor='green'>
                                <p>{habit.name}</p>
                                <Button buttonSize='btn--smallGoals' buttonColor='blue'>done</Button>
                            </Button>
                        ))}
                    </div>
                )}
                {showWeekly && (
                    <div>
                        {habits.filter(habit => habit.repeat === "weekly").map((habit, habitIndex) => (
                            <Button key={habitIndex} buttonSize='btn--goal' buttonColor='green'>
                                <h3>{habit.name}</h3>
                                <div className="daysContainer">
                                    {days.map((day, index) => (
                                        <div key={index} className='dayContainer'>
                                            <p className='daysGoals'>{day}</p>
                                            {clickedDays[habitIndex]?.includes(index) ? (
                                                <FaCircle key={index} className="circleGoals" onClick={() => {
                                                    setClickedDays(prevState => {
                                                        const newState = [...prevState];
                                                        newState[habitIndex] = newState[habitIndex].filter(i => i !== index);
                                                        return newState;
                                                    });
                                                }} />
                                            ) : (
                                                <FaRegCircle key={index} className="circleGoals" onClick={() => {
                                                    setClickedDays(prevState => {
                                                        const newState = [...prevState];
                                                        if (!newState[habitIndex]) {
                                                            newState[habitIndex] = [index];
                                                        } else {
                                                            newState[habitIndex].push(index);
                                                        }
                                                        return newState;
                                                    });
                                                }} />
                                            )}
                                        </div>
                                    ))}
                                </div>

                            </Button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default MyHabitsDesktop;