import React, { useEffect, useContext, useState } from 'react';
import UserRecipeTile from '../components/UserRecipeTile';
import UserContext from '../context/UserContext';
import { useHistory } from 'react-router-dom';
import SpotifyAuth from '../components/SpotifyAuth';
import MoodTracker from '../components/MoodTracker';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

const Home = () => {
    const { userData, spotifyAuth, recipeArray } = useContext(UserContext);
    const history = useHistory();
    const [page, setPage] = useState(0);
    const [moodData, setMoodData] = useState({
        happy: 0,
        sad: 0,
        energetic: 0,
        neutral: 0
    });

    useEffect(() => {
        if (!userData.user) history.push('/login');
        else fetchMoodData();
    }, [userData.user]);

    const fetchMoodData = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/users/mood/${userData.user}`, {
                headers: { 'x-auth-token': userData.token }
            });
            setMoodData(res.data.moodData);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="home">
            <p>
                Track your mood through food: <i>MoodBites.</i>
            </p>
            <br />
            <MoodTracker moodData={moodData} />
            <h2>Saved Recipes</h2>
            <br />
            {!spotifyAuth && (
                <>
                    <p>
                        To get the most out of this website, you'll want to:
                    </p>
                    <SpotifyAuth />
                    <br/>
                </>
            )}


            {recipeArray.length > 0  ? (
                <>
                    <div className='userRecipeTile'>
                        {recipeArray[page].map((recipe, index) => (
                            <UserRecipeTile recipe={recipe} index={index} key={uuidv4()} />
                        ))}
                    </div>
                    <br />

                    <div className='page-buttons'>
                        {page > 0 && (
                            <button
                                onClick={() => {
                                    setPage(page - 1);
                                }}
                            >
                                Back
                            </button>
                        )}
                        {page < recipeArray.length - 1 && (
                            <button
                                onClick={() => {
                                    setPage(page + 1);
                                }}
                            >
                                Next
                            </button>
                        )}
                    </div>
                </>
            ) : (
                <>
                    <p>This is your home page where you'll find all the recipes that you've saved.</p>
                    <p>Go ahead and search for your first recipe by clicking on <i>New</i> on the menu bar.</p>
                </>
            )}
        </div>
    );
};

export default Home;
