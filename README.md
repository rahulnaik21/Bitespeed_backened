# Bitespeed Backend Task

This project implements the Bitespeed contact identity reconciliation backend service.

## Features
- Identify and link contacts by email and phone number
- Primary and secondary contact handling
- Uses Node.js, Express, Prisma ORM, and MySQL

## Setup Instructions

1. Clone the repo: git clone https://github.com/rahulnaik21/Bitespeed_backened.git


2. Install dependencies:npm install

3. Setup your `.env` with your MySQL connection string

4. Run migrations:npx prisma migrate dev --name init

5. Start the server:node app.js

## API Endpoint

- POST `/identify`  
Request body example:
```json
{
 "email": "lorraine@hillvalley.edu",
 "phoneNumber": "123456"
}

https://bitespeed-backened.onrender.com

Author:
Rahul Naik S
