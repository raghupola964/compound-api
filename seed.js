require('dotenv').config();
const fs = require('fs').promises;
const path = require('path');
const pool = require('./db');

async function seedDatabase(dataDir = './data') {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Clear existing data
    await client.query('TRUNCATE TABLE advisors, accounts, securities RESTART IDENTITY CASCADE;');

    // Load data from files
    const rawAdvisorsData = await fs.readFile(path.join(dataDir, 'advisors.json'), 'utf8');
    const advisorsData = JSON.parse(rawAdvisorsData);

    const rawAccountsData = await fs.readFile(path.join(dataDir, 'accounts.json'), 'utf8');
    const accountsData = JSON.parse(rawAccountsData);

    const rawSecuritiesData = await fs.readFile(path.join(dataDir, 'securities.json'), 'utf8');
    const securitiesData = JSON.parse(rawSecuritiesData);

    // Insert advisors (id is SERIAL)
    for (const advisor of advisorsData) {
      await client.query(
        'INSERT INTO advisors (name, custodians) VALUES ($1, $2)',
        [advisor.name, JSON.stringify(advisor.custodians)]
      );
    }

    // Insert accounts
    for (const account of accountsData) {
      await client.query(
        'INSERT INTO accounts (name, number, rep_id, holdings, custodian) VALUES ($1, $2, $3, $4, $5)',
        [account.name, account.number, account.rep_id, JSON.stringify(account.holdings), account.custodian]
      );
    }

    // Insert securities (id is UUID with uuid_generate_v4())
    for (const security of securitiesData) {
      await client.query(
        'INSERT INTO securities (ticker, name, date_added) VALUES ($1, $2, $3)',
        [security.ticker, security.name, security.date_added || null]
      );
    }

    await client.query('COMMIT');
    console.log('Database seeded successfully with data from files.');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error seeding database:', err.message);
  } finally {
    client.release();
    await pool.end();
  }
}

if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;