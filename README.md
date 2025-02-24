# Advisor Dashboard Backend

This project implements **Option A (Backend Emphasis)** of the Compound Advisor Dashboard

## Features 
- **Data Processing**: Uses data from JSON files (`advisors.json`, `accounts.json`, `securities.json`) to seed a PostgreSQL database.
- **Statistics**:   - Total value in all advisor-managed accounts.
                    - Top 2 stocks by total units held (for study of risk exposure).
                    - The advisors' list is ranked according to the assets each custodian is managing.
- **API**: Provides raw data and processed statistics through endpoints.

## Prerequisites
- Node.js 16.x or higher
- PostgreSQL 13.x or higher

## Installation
1. **Clone the Repository**:
```bash
   git clone https://github.com/raghupola964/compound-api
   cd compound-api 
```

2. **Install Dependencies**:
```bash
    npm install
```
This command will install the project's dependencies. These include:

*   `dotenv`: For loading environment variables from a `.env` file.
*   `express`: For creating the API server.
*   `pg`: For interacting with the PostgreSQL database.


3.  **Set Up PostgreSQL**:
    -   Create a database named `compound-db` (or update `.env` with your database name):
        ```sql
        CREATE DATABASE "compound-db";
        ```
    -   Run the schema setup script (`schema.sql`) to create tables:
        ```bash
        psql -U postgres -d compound-db -f schema.sql
        ```

4.  **Configure Environment Variables**:
    -   Create a `.env` file in the root directory:
        ```text
        DB_USER=postgres
        DB_HOST=localhost
        DB_NAME=compound-db
        DB_PASSWORD=your_password
        DB_PORT=5432
        ```

## Running the Application

1.  **Seed the Database**:
    -   Ensure the `data` directory contains `advisors.json`, `accounts.json`, and `securities.json`.
    -   Run the seeding script:
        ```bash
        node seedDatabase.js
        ```
        This clears existing data and populates the database from the JSON files.

2.  **Start the API Server**:
    ```bash
    node server.js
    ```
    The server will start at `http://localhost:3000`.

## API Endpoints

-   `GET /`: Welcome page with endpoint list.
-   `GET /api/stats`: Returns total value, top 2 securities, and advisors ranked by custodian.
-   `GET /api/advisors`: Returns all advisors.
-   `GET /api/accounts`: Returns all accounts.
-   `GET /api/securities`: Returns all securities.




