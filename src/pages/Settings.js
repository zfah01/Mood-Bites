// Update login details.
import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import UserContext from '../context/UserContext';
import Modal from '../components/Modal';
import '../styles/Settings.css';
import OriginalModal from '../components/OriginalModal';

const Settings = () => {
    //below useEffect kicks in when we first load the change to check if a user is logged in, if not send to login page
    useEffect(() => {
        if (!userData.user) history.push('/login');
    });

    // used history will be used to help us route
    const history = useHistory();
    // our userData is pulled from the Context Provider provided in App.js
    const { userData, setUserData } = useContext(UserContext);
    // this status state will be used to return the status of requests, e.g whether they fail or pass
    const [status, setStatus] = useState(null);
    // store our newUsername in state
    const [newUsername, setNewUsername] = useState('');
    // store an object of our passwords in state, we'll use setPasswords to update these
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        newPassword2: ''
    });
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    // object destructuring of passwords
    const { currentPassword, newPassword, newPassword2 } = passwords;

    // function to show the delete confirmation modal
    const showDeleteWarningHandler = () => {
        setShowConfirmModal(true);
    };

    // function to hide the delete confirmation modal
    const cancelDeleteWarningHandler = () => {
        setShowConfirmModal(false);
    };

    // function for deleing an account
    const deleteAccount = async () => {
        try {
            await axios.delete(
                `http://localhost:5000/users/${userData.user}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': userData.token
                    }
                }
            );
            history.push('/login');
            setUserData({
                token: undefined,
                user: undefined,
                recipes: undefined
            });
            localStorage.setItem('auth-token', '');
        } catch (err) {
            console.log(err.data.message);
        }
    };

    // sets the new state of newUsername as the value of the target event
    const usernameHandler = (e) => {
        setNewUsername(e.target.value);
    };

    // sets the new state of the passwords as the previous passwords + plus the new one
    const passwordHandler = (e) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    //logic to send a newUsername
    // sends a put request to the backend with newUsername as the data and the appropriate headers.
    const onSubmitUsername = async (e) => {
        // prevent form from doing the default reload action
        e.preventDefault();
        try {
            const response = await axios.put(
                `http://localhost:5000/users/${userData.user}`,
                { newUsername },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': userData.token
                    }
                }
            );

            // save the response data in status state so we can display it
            console.log(response.data);
            setStatus(response.data);
        } catch (err) {
            setStatus(err.response.data);
        }
    };

    // function for submitting passwords

    const onSubmitPasswords = async (e) => {
        // prevent form from doing the default reload action
        e.preventDefault();
        // check if newpasswords don't match, if so, set a Status to display
        if (newPassword !== newPassword2) {
            setStatus('New passwords do not match');
        } else {
            // send a put request to backend with new passwords as data and appropriate headers
            try {
                const response = await axios.put(
                    `http://localhost:5000/users/${userData.user}`,
                    {
                        currentPassword,
                        newPassword,
                        newPassword2
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'x-auth-token': userData.token
                        }
                    }
                );

                //  set status as the response from the backend
                setStatus(response.data);
            } catch (err) {
                setStatus(err.response.data);
            }
        }
    };

    //function to reset status state to null so that the Alert modal goes away
    const statusHandler = () => {
        setStatus(null);
    };

    return (
        <div>
            <OriginalModal header='Alert!' message={status} onClear={statusHandler} />

            <Modal
                show={showConfirmModal}
                onCancel={cancelDeleteWarningHandler}
                header='Are you sure?'
                footer={
                    <>
                        <button
                            onClick={cancelDeleteWarningHandler}
                        >
                            Cancel
                        </button>
                        <button onClick={deleteAccount}>
                            Delete Account
                        </button>
                    </>
                }
            >
                <p>Deleted accounts cannot be recovered</p>
            </Modal>
            <h2 className='header'>Settings</h2>
            <div>
                <form onSubmit={(e) => onSubmitUsername(e)} className='password-form'>
                    <label>Edit Username</label>
                    <input
                        type='text'
                        placeholder='Enter new username here'
                        name='newUsername'
                        required
                        value={newUsername}
                        onChange={(e) => usernameHandler(e)}
                        className='form-input'
                    />

                    <input
                        className='submit'
                        type='submit'
                        value='Change username'
                    />
                </form>

                <form onSubmit={(e) => onSubmitPasswords(e)} className='password-form'>
                    <label>Current Password</label>
                    <input
                        type='password'
                        placeholder='Current Password'
                        required
                        name='currentPassword'
                        value={currentPassword}
                        onChange={(e) => passwordHandler(e)}
                        minLength='6'
                        className='form-input'
                    />
                    <label>New Password</label>
                    <input
                        type='password'
                        placeholder='New Password'
                        required
                        name='newPassword'
                        value={newPassword}
                        onChange={(e) => passwordHandler(e)}
                        minLength='6'
                        className='form-input'
                    />
                    <label>Confirm new password</label>
                    <input
                        type='password'
                        placeholder='Confirm New Password'
                        required
                        name='newPassword2'
                        value={newPassword2}
                        onChange={(e) => passwordHandler(e)}
                        minLength='6'
                        className='form-input'
                    />
                    <input
                        className='submit'
                        type='submit'
                        value='Change password'
                    />
                </form>

                <button
                    className='delete'
                    onClick={showDeleteWarningHandler}
                >
                    Delete Account
                </button>
            </div>
        </div>
    );
};

export default Settings;