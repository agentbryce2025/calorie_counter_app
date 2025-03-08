# Calorie Counter App

A modern dark-mode enabled mobile web application for tracking daily calorie intake and visualizing eating habits. This is based on the Vercel Dark Mode Calorie Counter project.

## Features

- **Dark Mode Support**: Toggle between light and dark themes
- **Calendar View**: Monthly calendar with daily calorie tracking
- **Daily Timeline**: Track food intake by time of day
- **Analytics Dashboard**: View weekly and monthly calorie trends
- **Responsive Design**: Works on mobile devices and desktop browsers
- **Local Storage**: Persists your data across browser sessions

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app) and uses TypeScript.

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/agentbryce2025/calorie_counter_app.git
   cd calorie_counter_app
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

4. For mobile device testing:
   - Ensure your mobile device is on the same network as your development machine
   - Find your development machine's IP address (e.g., 192.168.1.X)
   - Access the app on your mobile device using `http://192.168.1.X:3000`

## Building for Production

To create a production-ready build:

```
npm run build
```

This generates optimized static files in the `build` directory that can be deployed to any static hosting service (Vercel, Netlify, GitHub Pages, etc.).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
