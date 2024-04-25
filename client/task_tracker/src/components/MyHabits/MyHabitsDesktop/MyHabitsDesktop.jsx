import React from 'react'
import './MyHabitDesktop.css';
import '../../Button.css'

import Goals from '../../Goals';
import { Button } from '../../Button';

const MyHabitsDesktop = () => {
    const days = ["M", "T", "W", "TH", "F", "S", "S"];
  return (
    <div className='GridContainer'>
        <div className='NavContainer'>
            <Goals/>
        </div>
        <div className='MainContainer'>
            <div className='HeaderContainer'>
                <Button buttonSize='btn--medium' buttonColor='maroon'>Weekly</Button>
                <Button buttonSize='btn--medium' buttonColor='maroon'>Today</Button>
                <Button buttonSize='btn--medium' buttonColor='maroon'>Overall</Button>
                
            </div>
            <div>
                {days?.map((item,index) =>(
                    <Button buttonSize='btn--xs' buttonColor='maroon'>{item}</Button>
                ))}
            </div>
        </div>
        
    </div>
  )
}

export default MyHabitsDesktop
