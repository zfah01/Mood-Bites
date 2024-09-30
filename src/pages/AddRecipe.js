// can add recipes from here to user's favorites
// adds to mongo user object is succsessful, and reroutes to new recipe page.

import React, { useContext, useEffect } from 'react';
import SearchController from '../components/SearchController';
import UserContext from '../context/UserContext';
import { useHistory } from 'react-router-dom';

const AddRecipe = () => {
    const { userData } = useContext(UserContext);
    const history = useHistory();

    useEffect(() => {
        if (!userData.user) history.push('/login');
    }, [history, userData]);

    return (
        <div>
            <h2>Add Recipe</h2>
            <br />
            <SearchController />
        </div>
    );
};

export default AddRecipe;