-- Enable uuid-ossp extension for uuid_generate_v4()
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DROP TABLE IF EXISTS advisors, accounts, securities CASCADE;

CREATE TABLE securities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticker VARCHAR(10) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  date_added TIMESTAMPTZ
);

CREATE TABLE accounts (
  name VARCHAR(100) NOT NULL,
  number VARCHAR(100) PRIMARY KEY, 
  rep_id VARCHAR(100) NOT NULL,
  holdings JSONB,
  custodian VARCHAR(100)
);

CREATE TABLE advisors (
  id SERIAL PRIMARY KEY, 
  name VARCHAR(100) NOT NULL,
  custodians JSONB
);