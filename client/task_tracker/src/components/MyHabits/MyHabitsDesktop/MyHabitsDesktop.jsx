import React from 'react'
import './MyHabitDesktop.css';
import Goals from '../../Goals';

const MyHabitsDesktop = () => {
  return (
    <div className='GridContainer'>
        <div className='NavContainer'>
            <h1>Habits</h1>
            <Goals/>
        </div>
        <div className='MainContainer'>
            <div className='HeaderContainer'>
                <div className='HeaderItem'>My Habits</div>
                <div className='HeaderItem'>History</div>
                <div className='HeaderItem'>Hi Caro</div>
            </div>
        </div>
    </div>
  )
}

export default MyHabitsDesktop
