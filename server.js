const express = require('express');
const pool = require('./db');
const processData = require('./app');

const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send(`
    <h2>Welcome to the Compound Advisor Dashboard Backend</h2>
    <p>Available Endpoints:</p>
    <ul>
      <li><a href="/api/stats"><strong>/api/stats</strong></a>: Get processed statistics (total value, top 2 securities, advisors by custodian)</li>
      <li><a href="/api/advisors"><strong>/api/advisors</strong></a>: Get all advisors</li>
      <li><a href="/api/accounts"><strong>/api/accounts</strong></a>: Get all accounts</li>
      <li><a href="/api/securities"><strong>/api/securities</strong></a>: Get all securities</li>
    </ul>
  `);
});

app.get('/api/stats', async (req, res) => {
  try {
    const stats = await processData();
    res.json(stats);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/advisors', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM advisors');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/accounts', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM accounts');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/securities', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM securities');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.use((req, res) => {
  res.status(404).send(`
    <h2>404 - Endpoint Not Found</h2>
    <p>The requested endpoint does not exist. Please check the URL and try again.</p>
    <p>Visit <a href="/">Campound Backend Dashboard</a> for a list of available endpoints.</p>
  `);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});