import React from 'react';
import { Link } from 'react-router-dom';
import OptionsAuth from './OptionsAuth';
import '../styles/Navbar.css';
// nav bar with Links supplied by react-router-dom to specified routes
const Navbar = () => {
    return (
        <div className='navbar'>
            <h1 className='home-header'>
                <i>MoodBites</i>
            </h1>

            <div className='navbar-links'>
                <li>
                    <Link  to='/'>
                        Home
                    </Link>
                </li>
                <li>
                    <Link  to='/add'>
                        New
                    </Link>
                </li>
                <li>
                    <Link  to='/settings'>
                        Settings
                    </Link>
                </li>

                <OptionsAuth  />
            </div>
        </div>
    );
};

export default Navbar;