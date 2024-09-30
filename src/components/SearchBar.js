import React from 'react';
import '../styles/SearchBar.css';

//search bar for finding recipes
//data-cy is used as testing ids for cypress

// takes in props from SearchController
const SearchBar = (props) => {
    return (
        <div className='searchbar'>
            <label>Search for recipes</label>
            <input
                data-cy='searchbar'
                placeholder='Type your search term here and hit enter'
                type='text'
                value={props.searchValue}
                onChange={(event) => {
                    props.onSearchValueChange(event.target.value);
                }}
                onKeyUp={(event) => {
                    if (event.keyCode === 13) {
                        props.onEnter();
                    }
                }}
            />
        </div>
    );
};

export default SearchBar;