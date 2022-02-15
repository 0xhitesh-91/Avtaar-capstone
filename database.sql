-- Database = postgresql 12

CREATE DATABASE avtaar_db;

-- \c avtaar_db

CREATE EXTENSION IF NOT EXISTS "uuid-oosp";

CREATE TABLE users (
    userid uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(251) NOT NULL,
    age INT NOT NULL,
    gender VARCHAR(51),
    email VARCHAR(251) UNIQUE NOT NULL,
    password VARCHAR(251) NOT NULL
);

CREATE TABLE events (
    eventid SERIAL PRIMARY KEY,
    name VARCHAR(251) NOT NULL,
    description VARCHAR(251),
    location VARCHAR(51) NOT NULL,
    startdate DATE NOT NULL,
    enddate DATE NOT NULL,
    userid INT NOT NULL,
    FOREIGN KEY (userid)
    REFERENCES users(userid)
);