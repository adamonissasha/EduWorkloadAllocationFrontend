import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import PersonalArea from './pages/PersonalAreaPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/personal-area" element={<PersonalArea />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
