import React, { useState } from 'react';
import '../styles/HelpButton.css';

const HelpButton = () => {
    const [showTooltip, setShowTooltip] = useState(false);

    return (
        <div className="help-button-container">
            <button
                className="help-button"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
            >
                ?
            </button>
            {showTooltip && (
                <div className="help-tooltip">
                    <h3>How to use MoodBites:</h3>
                    <ol>
                        <li>Enter a cuisine, food, dietary requirement or ingredient in the search bar.</li>
                        <li>Browse through recipe suggestions based on your mood/search.</li>
                        <li>Click on a recipe to view details and save it to your favorites.</li>
                        <li>Use the Mood Tracker to track your mood.</li>
                        <li>Enjoy cooking and eating your mood-based meals!</li>
                    </ol>
                </div>
            )}
        </div>
    );
};

export default HelpButton;