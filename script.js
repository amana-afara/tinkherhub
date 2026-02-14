// Real EV Station Data (Kerala, India)
const stations = [
    // Kozhikode
    {
        id: 1,
        name: "KSRTC Bus Terminal Station (Kozhikode)",
        lat: 11.2588,
        lng: 75.7804,
        available: 2,
        total: 4,
        queue: 0
    },
    {
        id: 2,
        name: "Hilite Mall Charging Station (Kozhikode)",
        lat: 11.2480,
        lng: 75.8336, // Approx
        available: 0,
        total: 2,
        queue: 3
    },
    // Malappuram
    {
        id: 3,
        name: "Moosakutty Charging Station (Perinthalmanna)",
        lat: 10.9760, // Perinthalmanna approx
        lng: 76.2254,
        available: 1,
        total: 3,
        queue: 1
    },
    {
        id: 4,
        name: "KSEB Charging Station (Malappuram)",
        lat: 11.0720,
        lng: 76.0740,
        available: 4,
        total: 4,
        queue: 0
    },
    // Wayanad
    {
        id: 5,
        name: "Marina Motors (Kalpetta, Wayanad)",
        lat: 11.6050,
        lng: 76.0830,
        available: 0,
        total: 2,
        queue: 5
    },
    {
        id: 6,
        name: "Nesto Hypermarket (Kalpetta)",
        lat: 11.6100, // Approx
        lng: 76.0900,
        available: 2,
        total: 2,
        queue: 0
    }
];

// Initialize Map
const map = L.map('map').setView([11.2588, 75.7804], 9); // Centered on Kozhikode/Kerala region

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Helper to calculate wait time
function getWaitTime(station) {
    if (station.available > 0) return 0;
    return (station.queue + 1) * 15;
}

// Add Markers
stations.forEach(station => {
    const marker = L.marker([station.lat, station.lng]).addTo(map);
    const waitTime = getWaitTime(station);

    // Popup content
    const popupContent = `
        <b>${station.name}</b><br>
        Available: ${station.available}/${station.total}<br>
        Queue: ${station.queue} people<br>
        Wait Time: ~${waitTime} mins<br>
        <button onclick="joinQueue(${station.id})" style="margin-top:5px; cursor:pointer; background:#28a745; color:white; border:none; padding:5px 10px; border-radius:4px;">Join Queue</button>
    `;

    marker.bindPopup(popupContent);
});

// Render Station List
const stationList = document.getElementById('station-list');
stations.forEach(station => {
    const waitTime = getWaitTime(station);
    const card = document.createElement('div');
    card.className = 'station-card';
    card.innerHTML = `
        <h3>${station.name}</h3>
        <p>Available Chargers: <span class="available" style="color:${station.available > 0 ? 'green' : 'red'}">${station.available}</span>/${station.total}</p>
        <p>Queue Length: ${station.queue}</p>
        <p>Est. Wait: <strong>${waitTime} mins</strong></p>
        <button class="join-btn" onclick="joinQueue(${station.id})">Join Queue</button>
    `;
    stationList.appendChild(card);
});

// Queue System Logic (Simple Mock)
let notificationTimeout;

function requestNotificationPermission() {
    if (!("Notification" in window)) {
        console.log("This browser does not support desktop notification");
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission();
    }
}

function joinQueue(stationId) {
    const station = stations.find(s => s.id === stationId);
    if (!station) return;

    // Request permission on user interaction
    requestNotificationPermission();

    alert(`Joined queue for ${station.name}!`);

    // Show Queue Status Panel
    document.getElementById('queue-status').style.display = 'block';
    document.getElementById('queue-station-name').innerText = station.name;
    document.getElementById('queue-position').innerText = station.queue + 1;
    document.getElementById('queue-wait').innerText = `${getWaitTime(station)} mins`;

    // Clear any existing timeout simulation
    if (notificationTimeout) clearTimeout(notificationTimeout);

    // Simulate "Slot Ready" Notification after 5 seconds (fast for demo)
    notificationTimeout = setTimeout(() => {
        // 1. In-App Notification
        const notif = document.getElementById('notification');
        notif.style.display = 'block';
        notif.innerHTML = `🎉 <strong>${station.name}</strong> is ready for you!`;

        // 2. Native Browser Notification
        if (Notification.permission === "granted") {
            new Notification("⚡ Charger Available!", {
                body: `It's your turn at ${station.name}. Please proceed to the station within 5 minutes.`,
                icon: 'https://cdn-icons-png.flaticon.com/512/2966/2966334.png'
            });
        }

        // Hide in-app after 10s
        setTimeout(() => {
            notif.style.display = 'none';
        }, 10000);

        // Update UI to show "Ready"
        document.getElementById('queue-status').innerHTML = `
            <h2><span style="color:green">●</span> Slot Ready!</h2>
            <p>Please proceed to <strong>${station.name}</strong>.</p>
            <button class="leave-btn" onclick="leaveQueue()">Done Charging</button>
        `;

    }, 5000); // 5 seconds delay
}

function leaveQueue() {
    document.getElementById('queue-status').style.display = 'none';
    if (notificationTimeout) clearTimeout(notificationTimeout);

    // Reset the panel content for next time
    document.getElementById('queue-status').innerHTML = `
        <h2>Your Queue Status</h2>
        <p>Station: <span id="queue-station-name"></span></p>
        <p>Your Position: <strong id="queue-position"></strong></p>
        <p>Estimated Wait Time: <strong id="queue-wait"></strong></p>
        <button class="leave-btn" onclick="leaveQueue()">Leave Queue</button>
    `;

    alert("Queue cleared / Charging finished.");
}


// --- Hero Slider Logic ---
const slides = document.querySelectorAll('.slide');
let currentSlide = 0;

function nextSlide() {
    if (document.getElementById('view-home').style.display === 'none') return; // Only slide if on home view
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
}

// Auto-slide every 5 seconds
setInterval(nextSlide, 5000);

// --- Navigation & Auth Logic ---

function login() {
    const username = document.getElementById('username-input').value;
    if (!username) {
        alert("Please enter a name!");
        return;
    }

    // Save user state (mock)
    localStorage.setItem('ev_username', username);
    document.getElementById('username-display').innerText = `Hi, ${username}`;
    document.getElementById('user-info').style.display = 'block';

    navigateTo('view-home');
}

function logout() {
    localStorage.removeItem('ev_username');
    document.getElementById('user-info').style.display = 'none';
    document.getElementById('username-input').value = '';
    navigateTo('view-login');
}

function navigateTo(viewId) {
    // Hide all views
    document.querySelectorAll('.view-section').forEach(el => el.style.display = 'none');

    // Show target view
    const target = document.getElementById(viewId);
    if (target) {
        target.style.display = 'block';
    }

    // Special fix for Leaflet map resizing when becoming visible
    if (viewId === 'view-map') {
        setTimeout(() => {
            map.invalidateSize();
        }, 100);
    }
}

// Check if already logged in
window.onload = function () {
    const savedUser = localStorage.getItem('ev_username');
    if (savedUser) {
        document.getElementById('username-display').innerText = `Hi, ${savedUser}`;
        document.getElementById('user-info').style.display = 'block';
        navigateTo('view-home');
    } else {
        navigateTo('view-login');
    }
};
