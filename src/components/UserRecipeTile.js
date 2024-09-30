import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/UserRecipeTile.css';

//this is for saved user recipes - rendered on home page
const UserRecipes = ({ recipe, index }) => {
    return (
        <>
            {recipe && (
                <div className='saved-recipes'>
                    <h3>
                        <Link to={`/recipes/${index}`}>{recipe.name}</Link>
                    </h3>
                    <img src={recipe.image} alt='' />
                    <p>Cooking time: {recipe.totalCookingTime}</p>
                    {recipe.cuisines.length > 0 && (
                        <p>
                            {recipe.cuisines.map((cuisines, index) => (
                                <span key={`cuisines${index}`}>{cuisines} </span>
                            ))}
                        </p>
                    )}
                </div>
            )}
        </>
    );
};

export default UserRecipes;