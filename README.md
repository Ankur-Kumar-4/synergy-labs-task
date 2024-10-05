## Table of Contents

- [Live Demo](#live-demo)
- [Technologies Used](#technologies-used)
- [Setup Instructions](#setup-instructions)
- [Running the Project](#running-the-project)

## Live Demo

Check out the live demo of the project deployed here:  
[Live Demo Link](https://synergy-labs-task-ankur.netlify.app/)

## Technologies Used

- React
- Tailwind CSS
- Framer motion

## Setup Instructions

Follow the steps below to set up and run the project on your local machine.

### 1. Clone the Repository

```bash
git clone https://github.com/Ankur-Kumar-4/synergy-labs-task
cd synergy-labs-task
```

### 2. Install Dependencies

Before starting the project, install the necessary dependencies using npm:

```bash
npm install
```

This will install all required Node.js packages, including React and Tailwind CSS.

### 3. Configure Tailwind CSS

Tailwind CSS has already been pre-configured in this project. Ensure that the following files are correctly set up:

- tailwind.config.js: Configuration for Tailwind's theme and styles.
- postcss.config.js: PostCSS file for processing Tailwind directives.
- index.css: Global CSS file that imports Tailwind's styles using the following directives:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 4. Development Server

To start the development server and see your application in action, run:

```bash
npm run dev
```

Once the server is running, open your browser and navigate to:
http://localhost:5173/
The app will automatically reload when you make changes to the code.

### 5. Building for Production

If you want to build the app for production, run:

bash
Copy code
npm run build
This command will create an optimized production build of the app inside the dist/ folder.

### 6. Running Tests (Optional)

If you have written unit tests for the form components, you can run the tests using:

```bash
npm test
```

Ensure you have the necessary testing frameworks installed, such as Jest, if you plan to run unit tests.

### Running the Project

To run the project after setting it up, use the following command:

```bash
npm run dev
```

This will start the project in development mode. Visit http://localhost:5173/ in your browser to view the app.
