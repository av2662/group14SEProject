/*
This page sets the container for our habits page.
*/
import React from 'react'
import styled from 'styled-components';
import MyHabitsDesktop from './MyHabitsDesktop/MyHabitsDesktop';

const DesktopContainer = styled.div`
    @media screen only and (max-width: 699px){
        display: none;
    }
`

const MobileContainer = styled.div`
    @media screen only and (min-width: 700px){
        display: none;
    } 
`

const MyHabits = () => {
    return (
        <>
            {
                window.innerWidth >= 700 ?
                <DesktopContainer><MyHabitsDesktop/></DesktopContainer>
                :
                <MobileContainer>Mobile</MobileContainer>
            }
        </>
    )
}

export default MyHabits
