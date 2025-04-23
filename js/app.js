// Store for trip data
let trips = [];

// DOM Elements
const tripForm = document.getElementById('trip-form');
const tripsList = document.getElementById('trips-list');
const daysOutsideEl = document.getElementById('days-outside');
const daysRemainingEl = document.getElementById('days-remaining');

// Load saved trips from localStorage
function loadTrips() {
    const savedTrips = localStorage.getItem('uk-residency-trips');
    if (savedTrips) {
        trips = JSON.parse(savedTrips);
        renderTrips();
        updateSummary();
    }
}

// Save trips to localStorage
function saveTrips() {
    localStorage.setItem('uk-residency-trips', JSON.stringify(trips));
}

// Calculate the actual days outside the UK for a trip
// Travel days (the day you leave and the day you return) don't count
function calculateDaysOutside(departureDate, returnDate) {
    const departure = new Date(departureDate);
    const returnDay = new Date(returnDate);
    
    // Total days including travel days
    const totalDays = Math.round((returnDay - departure) / (1000 * 60 * 60 * 24)) + 1;
    
    // Subtract 2 travel days (departure and return)
    return Math.max(0, totalDays - 2);
}

// Calculate total days outside the UK in the last 12 months
function calculateTotalDaysOutside() {
    const now = new Date();
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setFullYear(now.getFullYear() - 1);
    
    let totalDays = 0;
    
    trips.forEach(trip => {
        const departureDate = new Date(trip.departureDate);
        const returnDate = new Date(trip.returnDate);
        
        // Skip trips that ended more than 12 months ago
        if (returnDate < twelveMonthsAgo) return;
        
        // For trips that started more than 12 months ago but ended within 12 months
        if (departureDate < twelveMonthsAgo && returnDate >= twelveMonthsAgo) {
            // Count only the portion of the trip within the last 12 months
            const daysInWindow = Math.round((returnDate - twelveMonthsAgo) / (1000 * 60 * 60 * 24));
            // Subtract 1 for the return travel day
            totalDays += Math.max(0, daysInWindow - 1);
        } else {
            // For trips fully within the 12-month window
            totalDays += trip.daysOutside;
        }
    });
    
    return totalDays;
}

// Update the summary panel
function updateSummary() {
    const totalDays = calculateTotalDaysOutside();
    const remainingDays = 180 - totalDays;
    
    daysOutsideEl.textContent = totalDays;
    daysRemainingEl.textContent = remainingDays;
    
    // Visual indication if approaching limit
    if (remainingDays <= 30) {
        daysRemainingEl.style.color = '#e74c3c';
    } else {
        daysRemainingEl.style.color = '#27ae60';
    }
}

// Render the trips list
function renderTrips() {
    tripsList.innerHTML = '';
    
    // Sort trips by departure date, newest first
    const sortedTrips = [...trips].sort((a, b) => {
        return new Date(b.departureDate) - new Date(a.departureDate);
    });
    
    sortedTrips.forEach((trip, index) => {
        const tripItem = document.createElement('div');
        tripItem.className = 'trip-item';
        
        // Format dates for display
        const departureFormatted = formatDate(trip.departureDate);
        const returnFormatted = formatDate(trip.returnDate);
        
        tripItem.innerHTML = `
            <div class="trip-info">
                <div class="trip-name">${trip.name}</div>
                <div class="trip-dates">${departureFormatted} to ${returnFormatted}</div>
                <div class="trip-days">${trip.daysOutside} days counted</div>
            </div>
            <button class="delete-trip" data-index="${index}">Delete</button>
        `;
        
        tripsList.appendChild(tripItem);
    });
    
    // Add event listeners to delete buttons
    document.querySelectorAll('.delete-trip').forEach(button => {
        button.addEventListener('click', handleDeleteTrip);
    });
}

// Format date as DD/MM/YYYY
function formatDate(dateString) {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
}

// Add a new trip
function handleAddTrip(e) {
    e.preventDefault();
    
    const tripName = document.getElementById('trip-name').value;
    const departureDate = document.getElementById('departure-date').value;
    const returnDate = document.getElementById('return-date').value;
    
    // Validate dates
    if (new Date(returnDate) < new Date(departureDate)) {
        alert('Return date cannot be before departure date.');
        return;
    }
    
    const daysOutside = calculateDaysOutside(departureDate, returnDate);
    
    // Generate default name if none provided
    const name = tripName.trim() || `Trip ${formatDate(departureDate)} - ${formatDate(returnDate)}`;
    
    const newTrip = {
        name,
        departureDate,
        returnDate,
        daysOutside
    };
    
    trips.push(newTrip);
    saveTrips();
    renderTrips();
    updateSummary();
    
    // Reset form
    tripForm.reset();
}

// Delete a trip
function handleDeleteTrip(e) {
    const index = parseInt(e.target.dataset.index);
    
    // Find the actual trip index in the original array
    const tripToDelete = [...trips].sort((a, b) => {
        return new Date(b.departureDate) - new Date(a.departureDate);
    })[index];
    
    const actualIndex = trips.findIndex(trip => 
        trip.name === tripToDelete.name && 
        trip.departureDate === tripToDelete.departureDate && 
        trip.returnDate === tripToDelete.returnDate
    );
    
    if (actualIndex !== -1) {
        trips.splice(actualIndex, 1);
        saveTrips();
        renderTrips();
        updateSummary();
    }
}

// Event listeners
tripForm.addEventListener('submit', handleAddTrip);

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadTrips();
});