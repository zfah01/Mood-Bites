import React from 'react';
import '../styles/RecipeCarousel.css';

const RecipeCarousel = ({ recipes, saveRecipe }) => {
    // Limit the recipes to 5
    const limitedRecipes = recipes.slice(0, 5);

    return (
        <div className="recipe-carousel">
            <h3>Recommendations based on your mood</h3>
            <div className="carousel-line"></div>
            <div className="recipe-row">
                {limitedRecipes.map((recipe, index) => (
                    <div key={index} className="recipe-card">
                        <h3 className="title">{recipe.title}</h3>
                        <img src={recipe.image} alt={recipe.title} className="imeg" />
                        {recipe.diets && recipe.diets.length > 0 && (
                            <p className="diet">
                                <b className="title">Diets:</b> {recipe.diets.join(', ')}
                            </p>
                        )}
                        <button className="butSave" onClick={() => saveRecipe(index)}>Save Recipe</button>
                    </div>
                ))}
            </div>
            <div className="carousel-line"></div>
        </div>
    );
};

export default RecipeCarousel;