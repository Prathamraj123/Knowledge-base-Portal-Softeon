# Running the Knowledge Base App on Localhost (Windows)

Follow these simple steps to run the application on your local computer:

## Step 1: Download and Extract
1. Download the `knowledge-base-app.zip` file from Replit
2. Extract it to a folder on your computer (e.g., `C:\Projects\knowledge-base-app`)

## Step 2: Run the Setup Script
1. Navigate to the extracted folder
2. Double-click on `windows-setup.bat` to run it
   - This will install the dependencies and set up the environment
   - It creates the necessary .bat files to run the application
   - It replaces configuration files with Windows-compatible versions

## Step 3: Start the Application
1. After setup completes, run `run-dev.bat` by double-clicking it
2. This starts the development server
3. Open your web browser and go to: http://localhost:5000

## Login Credentials
Use any of these accounts to log in:
- Employee ID: `EMP10254`, Password: `password123`
- Employee ID: `EMP10842`, Password: `password123`
- Employee ID: `EMP10468`, Password: `password123`

## Troubleshooting
If you encounter any issues:

1. Make sure Node.js is installed on your computer (v16 or later)
2. Check the console for error messages
3. Try running these commands manually if the .bat file doesn't work:
   ```
   npm install
   npm install --save-dev cross-env
   copy /Y windows-vite.config.ts vite.config.ts
   copy /Y windows-vite.ts server\vite.ts
   set NODE_ENV=development
   npx tsx server/index.ts
   ```

## Notes
- The application creates data files in a `data` directory at the root of the project
- Any queries or user data will be saved there
- The development mode is the recommended way to run the app locally