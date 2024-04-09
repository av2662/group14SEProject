import React from 'react'
import Home from '../../Home'
import Accordion from '../../Accordion'
import { homeObjOne, homeObjTwo, homeObjThree } from './Data'



function Homep() {
    return (
        <>
            <Home {...homeObjThree} />
            <Home {...homeObjOne} />
            <Home {...homeObjTwo} />
            <Accordion />
        </>
    )
}

export default Homep
