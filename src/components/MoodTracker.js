import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import '../styles/MoodTracker.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MoodTracker = ({ moodData }) => {
    const data = {
        labels: ['😊', '😢', '⚡', '😐'], // Emojis representing moods
        datasets: [
            {
                label: 'Mood Counts',
                data: [moodData.happy, moodData.sad, moodData.energetic, moodData.neutral],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                ],
            },
        ],
    };

    const getDominantMood = () => {
        const moods = [
            { name: 'Happy', count: moodData.happy },
            { name: 'Sad', count: moodData.sad },
            { name: 'Energetic', count: moodData.energetic },
            { name: 'Neutral', count: moodData.neutral },
        ];

        const dominantMood = moods.reduce((prev, current) => (prev.count > current.count) ? prev : current);

        return dominantMood.count > 0 ? `Based on the mood data, your mood is most strongly associated with being ${dominantMood.name}!` : "You have selected a mood yet.";
    };

    const options = {
        scales: {
            x: {
                ticks: {
                    font: {
                        size: 20, // Adjust this value for larger labels
                    },
                },
                grid: {
                    display: false,
                },
            },
            y: {
                beginAtZero: true,
                stepSize: 1,
                ticks: {
                    font: {
                        size: 20, // Adjust this value for larger labels
                    },
                },
            },
        },
        plugins: {
            legend: {
                display: false, // Hide legend if not needed
            },
        },
        barThickness: 80, // Adjust this value for thinner bars
    };

    return (
        <div className="mood-tracker" >
            <h2>Mood Tracker</h2>
            <Bar data={data} options={options} />
            <p className="dominant-mood-message">{getDominantMood()}</p>
        </div>
    );
};

export default MoodTracker;