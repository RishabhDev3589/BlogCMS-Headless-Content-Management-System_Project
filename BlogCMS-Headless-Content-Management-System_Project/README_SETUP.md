# How to Run BlogCMS

## Prerequisites
- Node.js installed
- MongoDB installed and running locally

## 1. Setup Backend
Open a terminal:
```bash
cd server
npm install
npm run dev
```
The server will start on `http://localhost:5000`.

## 2. Setup Frontend
Open a new terminal:
```bash
npm install
npm run dev
```
The frontend will open (usually `http://localhost:8080`).

## 3. Create Admin Account
1. Go to `/auth` page.
2. Toggle to "Create Account".
3. Enter email and password.
4. You will be logged in as Admin.

## 4. Explore
- Go to `/admin` to manage posts.
- Go to `/` to view the public blog.
