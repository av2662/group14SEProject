import React from 'react'
import { Button } from './Button';
import { Link } from 'react-router-dom';
import './Home.css';

function Home({ lightBg, topLine, lightText, lightTextDesc, headline, description, buttonLabel, img, alt, imgStart }) {
    return (
        <>
            <div className={lightBg ? 'home__Home-section' : 'home__Home-section darkBg'}>
                <div className='container'>
                    <div className='row home__Home-row' // Style switches position of img
                        style={{ display: 'flex', flexDirection: imgStart === 'start' ? 'row-reverse' : 'row' }}>
                        <div className='col'>
                            <div className='home__Home-text-wrapper'>
                                <div className='top-line'>{topLine}</div>
                                <h1 className={lightText ? 'heading' : 'heading dark'}>{headline}</h1>
                                <p className={lightTextDesc ? 'home__Home-subtitle' : 'home__Home-subtitle dark'}>{description}</p>
                                <Link to="/sign-up">
                                    <Button buttonSize='btn--wide' buttonColor='blue'>{buttonLabel}</Button>
                                </Link>
                            </div>
                        </div>
                        <div className='col'>
                            <div className='home__Home-img-wrapper '>
                                <img src={img} alt={alt} className='home__Home-img' />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Home
