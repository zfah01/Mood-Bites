// This page is purely here to redirect the access code from Spotify
// to the backend (with user id) on redirect

import React, { useEffect, useContext } from 'react';
import axios from 'axios';
import UserContext from '../context/UserContext';
import { useHistory } from 'react-router-dom';

const SpotifyRoutingPage = (props) => {
    const { userData, setSpotifyAuth } = useContext(UserContext);
    const history = useHistory();

    useEffect(() => {
        // function for sending spotify callback response to express with user.id
        const backendAuthCode = async (data) => {
            const res = await axios.post(
                `http://localhost:5000/spotify/callback`,
                data,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': userData.token
                    }
                }
            );
            // sets our access_token from the express response
            setSpotifyAuth(res.data.access_token);
            // redirects back home
            history.push('/');
        };

        // if code is a search parameter in address bar and user is logged in
        if (props.location.search.split('=')[1] && userData.token) {
            let data = {
                code: props.location.search.split('=')[1],
                id: userData.user
            };

            // call backendAuthCode, if theres an error log in and redirect back home
            backendAuthCode(data).catch = (err) => {
                console.log(err.response);
                console.log('there was an error with the token routing');
                history.push('/');
            };
        } else if (!props.location.search.split('=')[1]) {
            history.push('/');
        }
    }, [userData, history, props.location.search, setSpotifyAuth]);

    return (
        <div>
            <p>Redirecting you back home... </p>
        </div>
    );
};

export default SpotifyRoutingPage;