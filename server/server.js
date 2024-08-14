const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const port = 3000;

// Path to your database file
const dbPath = path.join(__dirname, 'database.db');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from 'src' directory
app.use(express.static(path.join(__dirname, '../src')));

// Serve HTML pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../src/index.html'));
});

app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../src/login.html'));
});

// API route to fetch user statistics
app.get('/stats', (req, res) => {
    // For simplicity, use a static username
    const username = 'testuser';

    const db = new sqlite3.Database(dbPath);

    db.get('SELECT * FROM user_statistics WHERE username = ?', [username], (err, row) => {
        if (err) {
            console.error('Error querying user statistics:', err);
            res.status(500).send('Error fetching statistics');
            return;
        }

        if (row) {
            // Parse the solved puzzles into an array
            const solvedPuzzles = row.solved_puzzles ? row.solved_puzzles.split(',').slice(-10) : [];
            res.json({
                points: row.points,
                solvedPuzzles: solvedPuzzles
            });
        } else {
            res.json({ points: 0, solvedPuzzles: [] });
        }
    });

    db.close();
});

// API route to update user statistics
app.post('/updateStats', (req, res) => {
    const { username, solvedPuzzle, points } = req.body;

    const db = new sqlite3.Database(dbPath);
    db.serialize(() => {
        // Update the points and solved puzzles
        db.run('INSERT INTO user_statistics (username, solved_puzzles, points) VALUES (?, ?, ?) ON CONFLICT(username) DO UPDATE SET solved_puzzles = COALESCE(user_statistics.solved_puzzles, "") || ?, points = points + ? WHERE username = ?',
            [username, solvedPuzzle, points, solvedPuzzle, points, username], (err) => {
                if (err) {
                    console.error('Error updating user statistics:', err);
                    res.status(500).send('Error updating statistics');
                    return;
                }
                res.sendStatus(200);
            });
    });
    db.close();
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
