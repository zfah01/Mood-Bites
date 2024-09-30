import React from 'react';
import { Link } from 'react-router-dom';
import AuthOptions from './AuthOptions';
import '../styles/Navbar.css';
// nav bar with Links supplied by react-router-dom to specified routes
//data-cy is used as testing ids for cypress
const Navbar = () => {
    return (
        <div className='navbar'>
            <h1 className='home-header'>
                <i>MoodBites</i>
            </h1>

            <div className='navbar-links'>
                <li>
                    <Link data-cy='home' to='/'>
                        Home
                    </Link>
                </li>
                <li>
                    <Link data-cy='newRecipe' to='/add'>
                        New
                    </Link>
                </li>
                <li>
                    <Link data-cy='dashboard' to='/dashboard'>
                        Dashboard
                    </Link>
                </li>

                <AuthOptions data-cy='logout' />
            </div>
        </div>
    );
};

export default Navbar;