document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = new FormData(this);

    fetch('/login', {
        method: 'POST',
        body: new URLSearchParams(formData)
    })
        .then(response => {
            if (response.redirected) {
                window.location.href = response.url;
            } else {
                return response.text().then(text => {
                    document.getElementById('errorMessage').textContent = text;
                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
});
