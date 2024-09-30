import React, { useState, useContext, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import UserContext from '../context/UserContext';
import axios from 'axios';
import ErrorMessage from '../components/ErrorMessage';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        password2: ''
    });

    const { userData, setUserData } = useContext(UserContext);
    const { username, password, password2 } = formData;
    const [error, setError] = useState();
    const history = useHistory();

    // function that sets the formData state to equal whatever input is in the forms
    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // function that async sends a post request to our backend with the registration data and also sends a post request for a login token
    const onSubmit = async (e) => {
        // prevent default form refresh on input submission
        e.preventDefault();

        // check if register password and confirmed register password are not the same
        if (password !== password2) {
            // set error if they don't  match
            setError('passwords do not match');
        } else {
            //post request to backend with registration data
            try {
                await axios.post(
                    `http://localhost:5000/auth/register`,
                    formData
                );

                // post request to backend with user data to get jwt token and information on user
                const loginRes = await axios.post(
                    `http://localhost:5000/auth/login`,
                    {
                        username,
                        password
                    }
                );

                // set the userData state to be the token, id and recipes we've gotten back
                setUserData({
                    token: loginRes.data.token,
                    user: loginRes.data._id,
                    recipes: loginRes.data.recipes
                });
                // set the jwt token in local storage
                localStorage.setItem('auth-token', loginRes.data.token);
                history.push('/');
            } catch (err) {
                const msg = err.response.data.msg || 'Login error (500)';
                console.log(msg);
                msg && setError(err.response.data.msg);
            }
        }
    };

    // on load if a user is currently loaded in userData state then send us to homepage
    useEffect(() => {
        if (userData.user) history.push('/');
    });

    return (
        <div>
            <h1>Register</h1>
            {/* if error exists then render it */}
            {error && (
                <ErrorMessage message={error} clearError={() => setError(undefined)} />
            )}

            <p>Welcome to MoodBites, you'll have to sign-in (or sign-up)  before anything else. </p>
            <br/>

            {/* form for entering a username, will call onSubmit to post data when submit input is clicked */}
            <form onSubmit={(e) => onSubmit(e)} className='form'>
                <label>Username</label>
                <input
                    type='text'
                    placeholder=''
                    name='username'
                    required
                    value={username}
                    onChange={(e) => onChange(e)}
                />
                <label>Password</label>
                <input
                    type='password'
                    placeholder=''
                    required
                    name='password'
                    value={password}
                    onChange={(e) => onChange(e)}
                    minLength='6'
                />
                <input
                    type='password'
                    placeholder='Confirm Password'
                    required
                    name='password2'
                    value={password2}
                    onChange={(e) => onChange(e)}
                    minLength='6'
                />
                <input type='submit' value='Register'  />
            </form>
            <p>
                Already have an account? <span> </span>
                {/* link to login route */}
                <Link  to='/login'>
                    Login
                </Link>
            </p>
        </div>
    );
};

export default Register;