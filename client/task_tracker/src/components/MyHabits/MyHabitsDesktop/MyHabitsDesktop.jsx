import React, { useState } from 'react'
import './MyHabitDesktop.css';
import '../../Button.css';
import {FaCircle, FaRegCircle} from 'react-icons/fa';
import Goals from '../../Goals';
import { Button } from '../../Button';

const MyHabitsDesktop = () => {
    const days = ["M", "T", "W", "TH", "F", "S", "Su"];
    const habits = [
        { name: "Walk Dog" },
        { name: "Habit 2" },
        { name: "Habit 3" },
        { name: "Habit 4" },
    ];
    const [showdaily, setShowDaily] = useState(false); //true to false
    const [showWeekly, setShowWeekly] = useState(true); //true to false

    const handleSelectWeekly = () => {
        setShowDaily(false);
        setShowWeekly(true);
    }; 
    const handleSelectDaily = () => {
        setShowWeekly(false);
        setShowDaily(true);
    };  
    const [clickedDays, setClickedDays] = useState([]);
    return (
        <div className='GridContainer'>
            <div className='NavContainer'>
                <Goals />
            </div>
            <div className='MainContainer'>
            <div className='HeaderContainer'>
                    <Button buttonSize='btn--medium' buttonColor='maroon' onClick={handleSelectWeekly}>Weekly</Button>
                    <Button buttonSize='btn--medium' buttonColor='maroon' onClick={handleSelectDaily}>Today</Button>
                </div>
                {showdaily && (
                    <div className='MainGoalsContainer'>
                        <Button buttonSize='btn--goalSmaller' buttonColor='green'>
                            <p>Walk Dog</p>
                            <Button buttonSize='btn--smallGoals' buttonColor='blue'>done</Button>
                        </Button>
                        <Button buttonSize='btn--goalSmaller' buttonColor='green'>
                            <p>Habit 2</p>
                            <Button buttonSize='btn--smallGoals' buttonColor='blue'>done</Button>
                        </Button>
                        <Button buttonSize='btn--goalSmaller' buttonColor='green'>
                            <p>Habit 3</p>
                            <Button buttonSize='btn--smallGoals' buttonColor='blue'>done</Button>
                        </Button>
                        <Button buttonSize='btn--goalSmaller' buttonColor='green'>
                            <p>Habit 4</p>
                            <Button buttonSize='btn--smallGoals' buttonColor='blue'>done</Button>
                        </Button>
                    </div>
                )}
                {showWeekly && (
                    <div>
                        {habits.map((habit, habitIndex) => (
                            <Button key={habitIndex} buttonSize='btn--goal' buttonColor='green'>
                                <h3>{habit.name}</h3>
                                <div>
                                    {days?.map((item, index) => (
                                        <p key={index} className='daysGoals'>{item}</p>
                                    ))}
                                </div>
                                {days?.map((item, index) => (
                                    clickedDays[habitIndex]?.includes(index) ? (
                                        <FaCircle key={index} className="circleGoals" onClick={() => {
                                            // Remove clicked day from state
                                            setClickedDays(prevState => {
                                                const newState = [...prevState];
                                                newState[habitIndex] = newState[habitIndex].filter(i => i !== index);
                                                return newState;
                                            });
                                        }} />
                                    ) : (
                                        <FaRegCircle key={index} className="circleGoals" onClick={() => {
                                            // Add clicked day to state
                                            setClickedDays(prevState => {
                                                const newState = [...prevState];
                                                if (!newState[habitIndex]) {
                                                    newState[habitIndex] = [index];
                                                } else {
                                                    newState[habitIndex] = [...newState[habitIndex], index];
                                                }
                                                return newState;
                                            });
                                        }} />
                                    )
                                ))}
                            </Button>
                        ))}
                    </div>
                )}



            </div>

        </div>
    )
}


export default MyHabitsDesktop
