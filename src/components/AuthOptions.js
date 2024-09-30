// Renders logout button and functionality
import React, { useContext } from 'react';
import UserContext from '../context/UserContext';

const AuthOptions = () => {
    const { userData, setUserData } = useContext(UserContext);

    const logout = () => {
        setUserData({
            token: undefined,
            user: undefined
        });
        localStorage.setItem('auth-token', '');
    };
    return (
        <div className='auth-options'>
            {/* if user in userData exists then render logout button through short-circuiting */}
            {userData.user && (
                <button data-cy='logout-button' className='logout' onClick={logout}>
                    Log out
                </button>
            )}
        </div>
    );
};

export default AuthOptions;