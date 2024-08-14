document.addEventListener('DOMContentLoaded', () => {
    const profileButton = document.getElementById('profileButton');
    const profilePanel = document.getElementById('profilePanel');
    const logoutButton = document.getElementById('logoutButton');
    const usernameDisplay = document.getElementById('username');
    const statsDisplay = document.getElementById('statsDisplay'); // Add this element in HTML

    const username = getLoggedInUsername(); // Function to get the logged-in username

    if (username) {
        usernameDisplay.textContent = username;
        fetchUserStatistics(username);
    }

    profileButton.addEventListener('click', () => {
        profilePanel.classList.toggle('active');
    });

    logoutButton.addEventListener('click', () => {
        fetch('/logout', { method: 'POST' })
            .then(response => {
                if (response.ok) {
                    window.location.href = '/login.html'; // Redirect to login page
                } else {
                    alert('Logout failed');
                }
            });
    });

    function getLoggedInUsername() {
        return sessionStorage.getItem('username'); // Adjust as needed
    }

    function fetchUserStatistics(username) {
        fetch(`/stats?username=${username}`)
            .then(response => response.json())
            .then(data => {
                if (data) {
                    statsDisplay.innerHTML = `
                        <p>Points: ${data.points}</p>
                        <p>Solved Puzzles: ${data.solvedPuzzles.join(', ')}</p>
                    `;
                }
            })
            .catch(error => {
                console.error('Error fetching user statistics:', error);
            });
    }
});
