import React from 'react';
import '../styles/RecipeTile.css';

//renders list of searched recipes
const RecipeTiles = ({ recipes, saveRecipe }) => {
    // takes in recipes (object) and saveRecipe = callback function to save a recipe
    return (
        <div className='recipe-results-container'>
            {/* map each recipe to a div with recipe${index} as the key, each div will contain a header, image, list od diets and button to favourite/save*/}
            {recipes.map((recipe, index) => (
                <div key={`recipe${index}`} className='recipe-result'>
                    <h3>{recipe.title}</h3>

                    <img className='image' src={recipe.image} alt='' />
                    {recipe.diets.length > 0 && (
                        <ul className='diets'>
                            {/* map each diet with to a list */}
                            {recipe.diets.map((diet, index) => (
                                <li key={`diet${index}`}>{diet}</li>
                            ))}
                        </ul>
                    )}

                    {recipe.cuisines.length > 0 && (
                        <p>
                            {recipe.cuisines.map((cuisines, index) => (
                                <span key={`cuisines${index}`}>{cuisines} </span>
                            ))}
                        </p>
                    )}

                    <button
                        // when button is clicked callback function saveRecipe is called on the specified index
                        data-cy='save'
                        onClick={() => {
                            saveRecipe(index);
                        }}
                        className='save-button'
                    >
                        Favourite/Save
                    </button>
                </div>
            ))}
        </div>
    );
};

export default RecipeTiles;