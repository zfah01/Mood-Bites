import React from 'react';

// Renders the track recommendation form (pre tracks actually being recommended)
const TrackRecForm = ({
                          instrumentalness,
                          setInstrumentalness,
                          valence,
                          setValence,
                          getRecommendedTracks
                      }) => {
    return (
        <div className='recommendations-form playlist-container'>
            <label>
                Choose how instrumental you'd like your playlist.
                {/* This changes the instrumental state param */}
                <select
                    value={instrumentalness}
                    onChange={(e) => {
                        setInstrumentalness(e.target.value);
                    }}
                >
                    <option value='0.02'>Give me voices</option>
                    <option defaultValue value='0.1'>
                        A little less voices please
                    </option>
                    <option value='0.2'>Can we turn down the voices some more?</option>
                    <option value='0.5'>Zen Zone</option>
                </select>
            </label>

            <label>
                Whats your mood?
                {/* This changes the valence ('happiness') state param */}
                <select
                    value={valence}
                    onChange={(e) => {
                        setValence(e.target.value);
                    }}
                >
                    <option value='0.25'>My dog just died</option>
                    <option defaultValue value='0.5'>
                        Pretty standard
                    </option>
                    <option value='0.7'>Feeling great</option>
                </select>
            </label>
            {/* Calls getRecommendedTracks from Playlist.js*/}
            <button
                data-cy='get-tracks-button'
                className='playlist-button'
                onClick={getRecommendedTracks}
            >
                Get Recommended Tracks
            </button>
        </div>
    );
};

export default TrackRecForm;