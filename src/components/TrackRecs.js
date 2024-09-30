import React from 'react';

// Renders out the tracks in the reccomendedTracks array
const TrackRecs = ({ tracks, saveTracks, newRecommendations }) => {
    return (
        <div>
            <div className='recommendations-object playlist-container'>
                <p>
                    <b>Recommended tracks: </b>
                </p>
                {/* Maps track in the format (artist: track-name) */}
                <ul className='recommended-tracks'>
                    {tracks.map((track, index) => (
                        <li key={`track${index}`}>
                            {track[1]}: <i>{track[0]}</i>
                        </li>
                    ))}
                </ul>
                {/* calls saveTracks func. in Playlist.js (saves to recipe and Spotify) */}
                <button
                    data-cy='save-tracks-button'
                    className='playlist-button'
                    onClick={saveTracks}
                >
                    Save As Playlist
                </button>
                {/* calls newRecommendations func. in Playlist.js */}
                <button
                    data-cy='new-tracks-button'
                    className='playlist-button'
                    onClick={newRecommendations}
                >
                    New Recommendations
                </button>
            </div>
        </div>
    );
};

export default TrackRecs;