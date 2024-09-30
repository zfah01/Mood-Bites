import React, { useState, useContext, useEffect, useRef } from 'react';
import SearchBar from './SearchBar';
import UserContext from '../context/UserContext';
import axios from 'axios';
import RecipeOptions from './RecipeOptions';
import ErrorMessage from './ErrorMessage';
import { useHistory } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import {Puff} from 'react-loader-spinner';
import MoodSelector from './MoodSelector';
import RecipeCarousel from './RecipeCarousel';

const SearchController = () => {
    const [searchValue, setSearchValue] = useState('');
    const [currentRecipes, setCurrentRecipes] = useState([]);
    const [offset, setOffset] = useState(0);
    const [error, setError] = useState(undefined);
    const [isLoading, setIsLoading] = useState(false);
    const [currentMood, setCurrentMood] = useState(null);
    const [recommendedRecipes, setRecommendedRecipes] = useState([]);

    const { userData, setUserData } = useContext(UserContext);
    const history = useHistory();
    const recipeTilesRef = useRef(null);

    const handleMoodSelect = async (mood) => {
        setCurrentMood(mood);
        try {
            const response = await axios.post('http://localhost:5000/users/mood',
                { userId: userData.user, mood },
                { headers: { 'x-auth-token': userData.token } }
            );

            console.log('Mood update response:', response.data);

            if (response.data && response.data.moodData) {
                // Update the mood data in your state or context
                // setMoodData(response.data.moodData);
            }

            fetchRecommendedRecipes(mood);
        } catch (err) {
            console.error('Error updating mood:', err);
            if (err.response) {
                console.error('Error response:', err.response.data);
                console.error('Error status:', err.response.status);
            } else if (err.request) {
                console.error('Error request:', err.request);
            } else {
                console.error('Error message:', err.message);
            }
            setError('Error updating mood');
        }
    };

    const fetchRecommendedRecipes = async (mood) => {
        setIsLoading(true);
        try {
            const res = await axios.get(`http://localhost:5000/users/recipes/recommended/${mood}`, {
                headers: { 'x-auth-token': userData.token }
            });
            setRecommendedRecipes(res.data.recipes);
            setIsLoading(false);
        } catch (err) {
            console.error(err);
            setIsLoading(false);
            setError('Error fetching recommended recipes');
        }
    };

    const getRecipes = async () => {
        setCurrentRecipes([]);
        setIsLoading(true);

        try {
            const sort = 'popularity';
            const number = 10;
            const searchResults = await axios.get(
                `https://api.spoonacular.com/recipes/complexSearch?query=${searchValue}&apiKey=${process.env.REACT_APP_SPOONACULAR_API_KEY}&addRecipeInformation=true&fillIngredients=true&sort=${sort}&offset=${offset}&number=${number}`
            );

            const results = searchResults.data.results;
            setIsLoading(false);

            if (results.length > 0) {
                setCurrentRecipes(results);
                setError(undefined);
                setTimeout(() => {
                    if (recipeTilesRef.current) {
                        const yOffset = -100; // Adjust this value to scroll more or less
                        const y = recipeTilesRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
                        window.scrollTo({top: y, behavior: 'smooth'});
                    }
                }, 100);
            } else {
                setError('There were no results found, try your luck another search.');
            }
        } catch (err) {
            console.log(err);
            setIsLoading(false);
            setError('Error fetching recipes');
        }
    };

    const saveRecipe = async (index) => {
        let recipe = currentMood ? recommendedRecipes[index] : currentRecipes[index];

        const parseIngredients = (ingredientsData) => {
            if (Array.isArray(ingredientsData)) {
                return ingredientsData.map(ing => ({
                    original: ing.original || ing.originalString || `${ing.amount} ${ing.unit} ${ing.name}`,
                    ingredient: ing.name || ing.originalName,
                    ingredientAmount: `${ing.amount || ''} ${ing.unit || ing.unitLong || ''}`
                }));
            } else if (typeof ingredientsData === 'object' && ingredientsData !== null) {
                return Object.entries(ingredientsData).map(([key, value]) => ({
                    original: value,
                    ingredient: key,
                    ingredientAmount: value
                }));
            }
            return [];
        };

        const data = {
            newRecipe: {
                name: recipe.title,
                image: recipe.image,
                recipeUrl: recipe.sourceUrl,
                cuisines: recipe.cuisines || [],
                sourceName: recipe.sourceName,
                summary: recipe.summary,
                preptime: recipe.preparationMinutes,
                cookingTime: recipe.cookingMinutes,
                totalCookingTime: recipe.readyInMinutes,
                ingredients: parseIngredients(recipe.extendedIngredients || recipe.ingredients || []),
                dishTypes: recipe.dishTypes || [],
                diets: recipe.diets || [],
                instructions: recipe.analyzedInstructions || [],
                winePairing: recipe.winePairing || {},
                playlistRef: '',
                id: uuidv4()
            },
            id: userData.user
        };

        try {
            const newRecipes = await axios.put(
                `http://localhost:5000/users/recipes/add`,
                data,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': userData.token
                    }
                }
            );

            console.log('Recipe has been added');
            setUserData(prevState => ({
                ...prevState,
                recipes: newRecipes.data
            }));

            history.push(`/recipes/`);
        } catch (err) {
            console.error('Error saving recipe:', err);
            setError('Failed to save recipe');
        }
    };

    const parseIngredients = (ingredients) => {
        let ingredientArray = [];
        if (Array.isArray(ingredients)) {
            ingredients.forEach((ingredient) => {
                ingredientArray.push({
                    original: ingredient.original || ingredient.originalString,
                    ingredient: ingredient.name || ingredient.originalName,
                    ingredientAmount: `${ingredient.amount || ''} ${ingredient.unit || ingredient.unitLong || ''}`
                });
            });
        }
        return ingredientArray;
    };

    const increaseOffset = () => {
        setOffset(offset + 10);
    };

    const decreaseOffset = () => {
        setOffset(offset - 10);
    };

    useEffect(() => {
        if (offset !== 0) {
            getRecipes();
        }
    }, [offset]);

    return (
        <div className="search-controller">
            <SearchBar
                searchValue={searchValue}
                onSearchValueChange={(newSearchValue) => {
                    setSearchValue(newSearchValue);
                }}
                onEnter={getRecipes}
            />
            <br/>

            <MoodSelector onMoodSelect={handleMoodSelect} />

            {currentMood && <RecipeCarousel recipes={recommendedRecipes} saveRecipe={(index) => saveRecipe(index, true)} />}

            {error && (
                <ErrorMessage message={error} clearError={() => setError(undefined)} />
            )}
            {isLoading && (
                <div className='loader'>
                    <Puff color='#00BFFF' height={100} width={100} />
                </div>
            )}
            <div ref={recipeTilesRef}>
            <RecipeOptions saveRecipe={saveRecipe} recipes={currentRecipes} />
            </div>

            {currentRecipes.length > 0 && (
                <div className='offset-controls'>
                    {offset > 0 && <button onClick={decreaseOffset}>Back</button>}
                    <button onClick={increaseOffset}>Next</button>
                </div>
            )}
        </div>
    );
};

export default SearchController;