// profile.js

document.addEventListener('DOMContentLoaded', () => {
    const profileButton = document.getElementById('profileButton');
    const profilePanel = document.getElementById('profilePanel');
    const logoutButton = document.getElementById('logoutButton');
    const usernameDisplay = document.getElementById('username');

    // Assuming you have a way to get the logged-in username
    const username = getLoggedInUsername(); // Replace with your actual method
    if (username) {
        usernameDisplay.textContent = username;
    }

    profileButton.addEventListener('click', () => {
        profilePanel.classList.toggle('active');
    });

    logoutButton.addEventListener('click', () => {
        fetch('/logout')
            .then(response => {
                if (response.ok) {
                    window.location.href = '/login.html'; // Redirect to login page
                } else {
                    alert('Logout failed');
                }
            });
    });

    function getLoggedInUsername() {
        // Implement this function to retrieve the logged-in username from the server
        // Example: Fetch from an API endpoint or from session storage
        return sessionStorage.getItem('username'); // Example, adjust based on your implementation
    }
});
