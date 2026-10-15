import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './layouts/Layout';
import { Dashboard } from './pages/Dashboard';
import { Recommendations } from './pages/Recommendations';
import { StudioExplorer } from './pages/StudioExplorer';
import { UserProfiles } from './pages/UserProfiles';
import { Evaluation } from './pages/Evaluation';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="recommendations" element={<Recommendations />} />
          <Route path="studios" element={<StudioExplorer />} />
          <Route path="users" element={<UserProfiles />} />
          <Route path="evaluation" element={<Evaluation />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
