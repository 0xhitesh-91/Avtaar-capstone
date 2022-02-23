CREATE DATABASE avtaar;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

create table users(
userid uuid primary key DEFAULT uuid_generate_v4(),
name varchar(251) not null,
age varchar(7) not null,
gender varchar(51),
email varchar(251) unique not null,
password varchar(251) not null
); 

create table events(
eventid serial primary key,
name varchar(251) not null,
description varchar(251),
location varchar(51) not null,
startdate date not null,
enddate date not null,
userid uuid not null,
foreign key (userid)
references users(userid)
);