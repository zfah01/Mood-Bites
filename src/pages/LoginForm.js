import React, { useState, useContext, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import UserContext from '../context/UserContext';
import axios from 'axios';
import ErrorNotice from '../components/ErrorNotice';

const LoginForm = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const { userData, setUserData, setSpotifyAuth } = useContext(UserContext);
    const history = useHistory();
    const { username, password } = formData;

    // function that sets the formData state to equal whatever input is in the forms
    const onChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // function to send post request for user to login
    const onSubmit = async (e) => {
        // prevent default form refresh on input submission
        e.preventDefault();

        try {
            // post request to login user with formData as data
            const loginRes = await axios.post(
                `http://localhost:5000/auth/login`,
                formData
            );

            // set userData as the token, user, and recipes we get back
            setUserData({
                token: loginRes.data.token,
                user: loginRes.data._id,
                recipes: loginRes.data.recipes
            });
            // set the jwt token in local storage
            localStorage.setItem('auth-token', loginRes.data.token);

            // if there is a spotify token send a request for a refresh token with our id
            if (loginRes.data.spotifyAuth) {
                await axios
                    .post(
                        `http://localhost:5000/spotify/refresh`,
                        {
                            id: loginRes.data._id
                        },
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                'x-auth-token': loginRes.data.token
                            }
                        }
                    )
                    .then((data) => {
                        setSpotifyAuth(data.data.access_token);
                        // console.log('access_token added');
                        history.push('/');
                    });
            }
        } catch (err) {
            // if we get an error set the response of the error
            const msg = err.response.data.msg || 'Login error (500)';
            msg && setError(msg);
        }
    };

    // on mount check if user exists in userData, if so, send us to homepage
    useEffect(() => {
        if (userData.user) history.push('/');
    });

    return (
        <div>
            <h1>Sign In</h1>
            {/* if error exists then set the error message in ErrorNotice and display it */}
            {error && (
                <ErrorNotice message={error} clearError={() => setError(undefined)} />
            )}

            <p>Welcome to MoodBites, you'll have to sign-in  (or sign-up)  before anything else. </p>
            <br/>

            {/* calls onSubmit when the submit input is clicked */}
            <form onSubmit={(e) => onSubmit(e)} className='form'>
                <label>Username</label>
                <input
                    type='text'
                    placeholder='Username'
                    name='username'
                    required
                    value={username}
                    onChange={(e) => onChange(e)}
                    data-cy='login'
                />
                <label>Password</label>
                <input
                    type='password'
                    placeholder='Password'
                    required
                    name='password'
                    value={password}
                    onChange={(e) => onChange(e)}
                    minLength='6'
                    data-cy='password'
                />

                <input type='submit' value='Login' data-cy='login-button' />
            </form>
            <p>
                Don't have an account? <span> </span>
                {/* Link to register route */}
                <Link to='/register' data-cy='sign-up-link'>
                    Sign up
                </Link>
            </p>
        </div>
    );
};

export default LoginForm;