import React from 'react';

const SpotifyAuth = () => {
    return (
        <div>
            <p>
                <a
                    href={`https://accounts.spotify.com/authorize?response_type=code&client_id=${
                        process.env.REACT_APP_SPOTIFY_CLIENT_ID2
                    }&scope=user-read-private%20user-read-email%20playlist-modify-public&redirect_uri=${encodeURIComponent(
                        process.env.REACT_APP_SPOTIFY_CALLBACK_URI
                    )}&show_dialog=true`}
                >
                    Authorise Spotify.
                </a>
            </p>
        </div>
    );
};

export default SpotifyAuth;