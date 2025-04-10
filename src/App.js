import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GreetingPage from './pages/GreetingPage';
import UploadPage from './pages/UploadPage'; // (you’ll create this next)
import UploadSuccessPage from './pages/UploadSuccessPage'
import UploadError from './pages/UploadError';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GreetingPage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/success" element={<UploadSuccessPage />} />
        <Route path='/upload-error' element={<UploadError/>}/>
      </Routes>
    </Router>
  );
}

export default App;
