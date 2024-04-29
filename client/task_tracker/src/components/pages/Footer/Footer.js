/*-------------------------------
This file is for the footer that 
appears underneath all the pages.
--------------------------------*/
import React from 'react';
import './Footer.css';
import { Link } from 'react-router-dom';
import { BsCalendarWeek } from 'react-icons/bs';

function Footer() {
  return (
    <div className='footer-container'>
      <section className='social-media'>
        <div className='social-media-wrap'>
          <div className='footer-logo'>
            <Link to='/' className='social-logo'>
              <BsCalendarWeek className='navbar-icon' />
              TaskTracker
            </Link>
          </div>
          <small className='website-rights'>TaskTracker © 2024</small>
          
        </div>
      </section>
    </div>
  );
}

export default Footer;
