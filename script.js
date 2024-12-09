// Emoji Categories and Data
const emojiCategories = [
    {
        name: "Activities",
        emojis: ["🎨", "🎭", "🎪", "🎤", "🎼", "🎧", "🎮", "🎲", "📚", "✏️", "👨‍💻", "🎵"]
    },
    {
        name: "Food & Drinks",
        emojis: ["🍎", "🍕", "🍔", "🍜", "🍣", "🍱", "🥗", "🍳", "☕", "🍵"]
    },
    {
        name: "Travel",
        emojis: ["🚗", "✈️", "🚂", "🚲", "🛵", "🚁", "🚌", "🏕️", "⛺", "🏖️"]
    },
    {
        name: "Emotions",
        emojis: ["😀", "😊", "🥳", "😴", "🤔", "😅", "🥺", "😎", "🤓", "🥰"]
    }
];

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    initializeGrids();
    initializeEmojiPicker();
    initializeHomeworkButton();
    initializeTimeDisplay();
    loadSavedData();
});

// Grid Initialization
function initializeGrids() {
    ['morning', 'midday', 'evening'].forEach(timeOfDay => {
        const grid = document.getElementById(`${timeOfDay}-grid`);
        for (let i = 0; i < 6; i++) {
            const cell = document.createElement('div');
            cell.classList.add('grid-cell');
            cell.addEventListener('click', () => handleCellClick(cell));
            grid.appendChild(cell);
        }
    });
}

// Emoji Picker
function initializeEmojiPicker() {
    const categoriesContainer = document.getElementById('emoji-categories');
    const pickerGrid = document.getElementById('emoji-grid-picker');

    // Create category buttons
    emojiCategories.forEach((category, index) => {
        const button = document.createElement('button');
        button.classList.add('category-button');
        button.textContent = category.name;
        button.addEventListener('click', () => showEmojiCategory(index));
        categoriesContainer.appendChild(button);
    });

    // Show first category by default
    showEmojiCategory(0);
}

function showEmojiCategory(categoryIndex) {
    const pickerGrid = document.getElementById('emoji-grid-picker');
    pickerGrid.innerHTML = '';
    
    emojiCategories[categoryIndex].emojis.forEach(emoji => {
        const emojiButton = document.createElement('button');
        emojiButton.textContent = emoji;
        emojiButton.addEventListener('click', () => selectEmoji(emoji));
        pickerGrid.appendChild(emojiButton);
    });

    // Update active category
    document.querySelectorAll('.category-button').forEach((button, index) => {
        button.classList.toggle('active', index === categoryIndex);
    });
}

// Homework Button
function initializeHomeworkButton() {
    const homeworkButton = document.getElementById('homework-button');
    homeworkButton.addEventListener('click', () => {
        homeworkButton.classList.toggle('done');
        saveData();
    });
}

// Time Display
function initializeTimeDisplay() {
    const updateTime = () => {
        const timeElement = document.getElementById('current-time');
        timeElement.textContent = new Date().toLocaleTimeString();
    };
    updateTime();
    setInterval(updateTime, 1000);
}

// Cell Click Handler
let selectedEmoji = null;

function handleCellClick(cell) {
    if (selectedEmoji) {
        cell.textContent = selectedEmoji;
        selectedEmoji = null;
        saveData();
    }
}

function selectEmoji(emoji) {
    selectedEmoji = emoji;
}

// Data Persistence
function saveData() {
    const data = {
        morning: getGridData('morning-grid'),
        midday: getGridData('midday-grid'),
        evening: getGridData('evening-grid'),
        homeworkDone: document.getElementById('homework-button').classList.contains('done')
    };
    localStorage.setItem('emojiPlannerData', JSON.stringify(data));
}

function loadSavedData() {
    const savedData = localStorage.getItem('emojiPlannerData');
    if (savedData) {
        const data = JSON.parse(savedData);
        setGridData('morning-grid', data.morning);
        setGridData('midday-grid', data.midday);
        setGridData('evening-grid', data.evening);
        if (data.homeworkDone) {
            document.getElementById('homework-button').classList.add('done');
        }
    }
}

function getGridData(gridId) {
    return Array.from(document.getElementById(gridId).children)
        .map(cell => cell.textContent);
}

function setGridData(gridId, data) {
    const cells = document.getElementById(gridId).children;
    data.forEach((emoji, index) => {
        if (cells[index]) cells[index].textContent = emoji;
    });
}

// Add haptic feedback
function vibrate() {
    if (navigator.vibrate) {
        navigator.vibrate(50);
    }
}

// Initialize service worker for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('ServiceWorker registered'))
            .catch(err => console.log('ServiceWorker registration failed:', err));
    });
}
