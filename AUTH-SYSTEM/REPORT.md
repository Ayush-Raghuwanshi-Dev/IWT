# User Authentication System (Express + MongoDB)

## Overview
This project provides registration, login, logout, and a simple dashboard using Express and MongoDB. Passwords are hashed with bcrypt and authentication uses JWT access and refresh tokens.

## Features
- Registration with unique email validation
- Login with password verification
- JWT access token for API calls
- Refresh token stored in an httpOnly cookie
- Logout to invalidate refresh tokens

## Configuration
Create a `.env` file with:
```
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@HOST/DBNAME
SESSION_SECRET=change_me
ACCESS_TOKEN_SECRET=change_me_access
REFRESH_TOKEN_SECRET=change_me_refresh
```

## How It Works
- `server.js` defines API routes and JWT handling.
- Static HTML/CSS/JS live in `public/` and call the API.
- MongoDB stores users and session data.

## Security Notes
- Passwords are hashed with `bcryptjs`.
- Email uniqueness is enforced in the database.
- Refresh tokens are stored in MongoDB.

## Run
```
npm install
npm run start
```
Open `http://localhost:3000`.
