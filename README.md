# Knowledge Base Application

An internal knowledge base system with employee login that stores and retrieves queries and answers using JSON storage.

## Features

- Employee login with password authentication
- CAPTCHA validation for security
- Search and filter knowledge base entries
- Add new queries with detailed answers
- Filter by topic, date, and employee
- Responsive design for all device sizes

## Login Credentials

For testing purposes, you can use the following credentials:

- Employee ID: `EMP10254` with password: `password123`
- Employee ID: `EMP10842` with password: `password123`
- Employee ID: `EMP10468` with password: `password123`

## Deployment to Netlify (Free)

This application is configured for easy deployment to Netlify's free tier. Follow these steps:

### Option 1: Direct Deploy via Netlify UI

1. Push this repository to GitHub
2. Go to [Netlify](https://app.netlify.com/) and sign up for a free account
3. Click "New site from Git"
4. Choose GitHub and select your repository
5. Keep the default build settings (they're already configured in netlify.toml)
6. Click "Deploy site"

### Option 2: Deploy with Netlify CLI

1. Install the Netlify CLI: `npm install -g netlify-cli`
2. Run `netlify login` to authenticate
3. Run `netlify init` in the project root
4. Follow the prompts to create a new site
5. Deploy with `netlify deploy --prod`

## Local Development

1. Clone the repository
2. Run `npm install` to install dependencies
3. Run `npm run dev` to start the development server
4. Open http://localhost:5000 in your browser

## Technology Stack

- Frontend: React, TailwindCSS, shadcn UI components
- Backend: Express.js
- Authentication: Session-based with CAPTCHA
- Storage: JSON file storage
- Deployment: Netlify (Serverless Functions)

## Project Structure

- `/client` - Frontend React application
- `/server` - Express.js backend API
- `/functions` - Netlify serverless functions
- `/shared` - Shared code between frontend and backend