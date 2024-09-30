import React, { useState, useContext, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import UserContext from '../context/UserContext';
import axios from 'axios';
import ErrorMessage from '../components/ErrorMessage';

const Login = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const { userData, setUserData } = useContext(UserContext);
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
            {/* if error exists then set the error message in ErrorMessage and display it */}
            {error && (
                <ErrorMessage message={error} clearError={() => setError(undefined)} />
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
                />

                <input type='submit' value='Login'  />
            </form>
            <p>
                Don't have an account? <span> </span>
                {/* Link to register route */}
                <Link to='/register' >
                    Sign up
                </Link>
            </p>
        </div>
    );
};

export default Login;