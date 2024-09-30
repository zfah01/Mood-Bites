// components/MoodSelector.js
import React from 'react';
import '../styles/MoodSelector.css';

const MoodSelector = ({ onMoodSelect }) => {
    const moods = [
        { emoji: '😊', name: 'happy' },
        { emoji: '😢', name: 'sad' },
        { emoji: '⚡', name: 'energetic' },
        { emoji: '😐', name: 'neutral' }
    ];

    return (
        <div className="mood-selector">
            <h3>How are you feeling today?</h3>
            <div className="mood-emojis">
                {moods.map(mood => (
                    <button key={mood.name} onClick={() => onMoodSelect(mood.name)}>
                        {mood.emoji}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default MoodSelector;