# User Authentication System (Express + MongoDB)

An Express app that supports registration, login, logout, and a protected dashboard using JWT access and refresh tokens.

## Features
- Registration with unique email validation
- Login with hashed password verification
- JWT access tokens for API calls
- Refresh tokens stored in an httpOnly cookie
- Logout invalidates refresh tokens

## Setup
1. Install dependencies:
```
npm install
```
2. Create a `.env` file:
```
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@HOST/DBNAME
ACCESS_TOKEN_SECRET=change_me_access
REFRESH_TOKEN_SECRET=change_me_refresh
```
3. Start the server:
```
npm start
```
4. Open `http://localhost:3000`.

## Notes
- MongoDB Atlas or local MongoDB can be used.
- Access tokens expire quickly and are refreshed via `/api/refresh`.
