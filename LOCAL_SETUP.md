# Knowledge Base Application - Local Setup Guide

This document provides instructions for setting up and running the Knowledge Base application on your local machine.

## Windows Setup

If you're using Windows, follow these steps:

1. Extract the ZIP file to a folder on your computer
2. Open Command Prompt in that folder
3. Run the included `windows-setup.bat` file by double-clicking it or running it from Command Prompt:
   ```
   windows-setup.bat
   ```
4. This will:
   - Install all dependencies
   - Install cross-env for handling environment variables
   - Replace the Vite configuration with a Windows-compatible version
   - Create batch files for running the application
5. To start the development server, run:
   ```
   run-dev.bat
   ```
6. Open your browser and navigate to: http://localhost:5000

## Mac/Linux Setup

If you're using Mac or Linux, follow these steps:

1. Extract the ZIP file to a folder on your computer
2. Open Terminal in that folder
3. Install dependencies:
   ```
   npm install
   ```
4. Start the development server:
   ```
   npm run dev
   ```
5. Open your browser and navigate to: http://localhost:5000

## Login Credentials

Use any of the following credentials to log in:

- Employee ID: `EMP10254`, Password: `password123`
- Employee ID: `EMP10842`, Password: `password123`
- Employee ID: `EMP10468`, Password: `password123`

## Project Structure

- `client/`: Frontend React application
  - `src/components/`: UI components (forms, cards, etc.)
  - `src/pages/`: Page components
  - `src/context/`: Context providers
  - `src/hooks/`: Custom React hooks
  - `src/lib/`: Utility functions and API client
  - `src/types/`: TypeScript type definitions
- `server/`: Backend Express application
  - `routes.ts`: API endpoints
  - `storage.ts`: Data storage interface
  - `index.ts`: Server entry point
- `shared/`: Shared code between frontend and backend
  - `schema.ts`: Data schema and validation

## File Storage

This application uses JSON file storage to persist data. The data files are created in a `data` directory at the root of the project.

- `data/users.json`: User accounts
- `data/queries.json`: Knowledge base entries

## Troubleshooting

If you encounter issues:

1. Make sure Node.js v16 or higher is installed
2. Check console for error messages
3. On Windows, ensure the vite.config.ts has been replaced with the Windows-compatible version
4. If paths are not resolving correctly, verify that the `@` and `@shared` aliases are working in your environment

For Windows-specific path issues, the setup script should handle this automatically, but if you encounter problems, try running these commands manually:

```
npm install
npm install --save-dev cross-env
copy /Y windows-vite.config.ts vite.config.ts
```

Then run the application with:

```
set NODE_ENV=development
npx tsx server/index.ts
```