import React, { useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import { applyDarkModeToDocument } from './services/preferencesService';

function App() {
  // Apply dark mode on initial load
  useEffect(() => {
    applyDarkModeToDocument();
  }, []);

  return (
    <Layout>
      <Dashboard />
    </Layout>
  );
}

export default App;
