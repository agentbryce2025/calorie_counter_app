# Calorie Counter App

A comprehensive calorie tracking application with offline capabilities, built with React, TypeScript, and modern web technologies.

## Features

- **Calorie Tracking**: Log food entries with detailed nutritional information
- **Advanced Analytics**: Visualize your nutritional data with interactive charts
- **Barcode Scanning**: Quickly add packaged foods by scanning barcodes
- **Voice Input**: Add food entries using natural voice commands
- **Export Functionality**: Export your data in CSV or PDF formats
- **Meal Planning**: Create and manage meal plans for better nutrition
- **Social Sharing**: Share your progress and achievements
- **Offline Support**: Use the app even when you're offline
- **Responsive Design**: Works on mobile and desktop devices

## Technical Details

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app) and enhanced with:

- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Service Workers** for offline capability
- **Progressive Web App (PWA)** features

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

## Offline Capability

The app includes comprehensive offline support:

- **Service Workers**: Cache assets and API responses for offline use
- **Offline Indicator**: Clear visual indication when you're offline
- **Fallback Content**: Graceful degradation when network is unavailable
- **Data Persistence**: Local storage backup when API is unreachable
- **Update Notifications**: Inform users when a new version is available

For more details, see the [OFFLINE_CAPABILITY.md](./OFFLINE_CAPABILITY.md) documentation.

## Project Status

Check the current project status and upcoming features in [PROJECT_STATUS.md](./PROJECT_STATUS.md).

## Development Summary

For a comprehensive overview of development progress, see [DEVELOPMENT_SUMMARY.md](./DEVELOPMENT_SUMMARY.md).

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
