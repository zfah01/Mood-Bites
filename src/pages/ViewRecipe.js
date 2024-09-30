// Rendered in App.js

import React, { useContext, useEffect } from 'react';
import PlaylistController from '../components/PlaylistController';
import UserContext from '../context/UserContext';
import { useHistory } from 'react-router-dom';
import DetailedRecipeView from '../components/DetailedRecipeView';

// page for viewing the saved recipes, renders a detailed view of the recipe and playlist
const ViewRecipe = ({ recipe }) => {
    const { userData } = useContext(UserContext);
    const history = useHistory();

    // when this page is loaded, check if a user exists in userData, if not send us to login as we arn't logged in, any time userData or history is changed check this
    useEffect(() => {
        if (!userData.user) history.push('/login');
    }, [userData, history]);
    //do we need history in this dependency array?
    return (
        <div>
            {/* check if recipe prop exists then render the DetailRecipeView and playlist  */}
            {recipe && (
                <div className='view-recipe'>
                    <DetailedRecipeView recipe={recipe} />
                    <br />
                    <br />
                    <PlaylistController
                        recipe={recipe}
                        playlistRef={recipe.playlistRef}
                    />
                </div>
            )}
        </div>
    );
};

export default ViewRecipe;