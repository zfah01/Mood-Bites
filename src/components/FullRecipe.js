import React, { useContext } from 'react';
import axios from 'axios';
import UserContext from '../context/UserContext';
import { useHistory } from 'react-router-dom';

import '../styles/FullRecipe.css';

//shows detailed recipe info within ViewRecipe.js

const FullRecipe = ({ recipe }) => {
    const history = useHistory();
    const { userData, setUserData } = useContext(UserContext);

    // send a put request to delete a recipe, sends the current user, and recipe id as data
    const deleteRecipe = async () => {
        try {
            const newRecipes = await axios.put(
                `http://localhost:5000/users/recipes/delete`,
                { id: userData.user, recipeId: recipe.id },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': userData.token
                    }
                }
            );
            console.log('recipe has been deleted');
            //  sets the userData as token, current user and the newly returned recipes from the above put request
            await setUserData({
                token: userData.token,
                user: userData.user,
                recipes: newRecipes.data
            });
            // send us back to home/root directory
            history.push(`/`);
        } catch (err) {
            // if any errors catch and log them
            console.log(err);
        }
    };

    return (
        <div className='container'>
            <div className='header-container'>
                <h2 className='recipeViewHeader'>{recipe.name}</h2>{' '}
                {/* button that calls deleteRecipe function */}
                <button
                    className='recipe-delete'
                    onClick={deleteRecipe}
                >
                    Delete
                </button>
            </div>

            <img src={recipe.image} alt='' className='image2' />

            <div className='cookingTimes'>
                {recipe.totalCookingTime > 0 && (
                    <span>
                        <b>Total Cooking Time: </b> {recipe.totalCookingTime} minutes
                    </span>
                )}
            </div>

            {Array.isArray(recipe.winePairing) && recipe.winePairing.length > 0 && (
                <p>
                    <b>Wine Pairing: </b>
                    {recipe.winePairing.map((winePairing, index) => (
                        <span key={`winePairing${index}`}>{winePairing}, </span>
                    ))}
                </p>
            )}

            <p>
                <b>Source: </b>
                <a href={recipe.recipeUrl} target='_blank' rel='noopener noreferrer'>
                    {recipe.sourceName || 'here'}
                </a>
            </p>

            {Array.isArray(recipe.diets) && recipe.diets.length > 0 && (
                <p>
                    <b>Diet categories: </b>{' '}
                    {recipe.diets.map((diet, index) => (
                        <span key={`diet${index}`}>{diet}, </span>
                    ))}
                </p>
            )}
            {Array.isArray(recipe.cuisines) && recipe.cuisines.length > 0 && (
                <p>
                    <b>Cuisines: </b>
                    {recipe.cuisines.map((cuisine, index) => (
                        <span key={`cuisine${index}`}>{cuisine}, </span>
                    ))}
                </p>
            )}

            {Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0 && (
                <p className='ingredients'>
                    <b>Ingredients:</b>
                    {recipe.ingredients.map((ingredient, index) => (
                        <li key={`ingredient${index}`}>{ingredient.original}</li>
                    ))}
                </p>
            )}

            {Array.isArray(recipe.instructions) && recipe.instructions.length > 0 && (
                <ol className='instructions'>
                    <b>Instructions:</b>
                    {recipe.instructions[0].steps.map((steps, index) => (
                        <li key={`step${index}`}>{steps.step}</li>
                    ))}
                </ol>
            )}
        </div>
    );
};

export default FullRecipe;

