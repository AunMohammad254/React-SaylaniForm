import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import SocialLinks from './components/SocialLinks';
import RegistrationForm from './components/RegistrationForm';
import DownloadIDCard from './components/DownloadIDCard';
// import Results from './components/Results';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-linear-to-r from-primary to-secondary">
        <Header />
        <SocialLinks />
        <Routes>
          <Route path="/" element={<RegistrationForm />} />
          <Route path="/download-id" element={<DownloadIDCard />} />
          {/* <Route path="/results" element={<Results />} /> */}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;