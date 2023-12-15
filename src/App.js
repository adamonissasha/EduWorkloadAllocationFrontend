import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import PersonalArea from './pages/PersonalAreaPage';
import DepartmentPage from './pages/DepartmentPage';
import CoursePage from './pages/CoursePage';
import SpecialityPage from './pages/SpecialityPage';
import NotFoundPage from './pages/NotFoundPage';
import ServerErrorPage from './pages/ServerErrorPage';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/personal-area" element={<PersonalArea />} />
      <Route path="/department" element={<DepartmentPage />} />
      <Route path="/speciality" element={<SpecialityPage />} />
      <Route path="/course" element={<CoursePage />} />
      <Route path="server/error" element={<ServerErrorPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
