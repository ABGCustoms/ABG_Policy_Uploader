import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GreetingPage from './pages/GreetingPage';
import UploadPage from './pages/UploadPage'; // (you’ll create this next)
import UploadSuccessPage from './pages/UploadSuccessPage'
import UploadError from './pages/UploadError';
import ViewBuckets from './pages/ViewBuckets'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GreetingPage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/success" element={<UploadSuccessPage />} />
        <Route path='/upload-error' element={<UploadError/>}/>
        <Route path='/buckets' element={<ViewBuckets/>}/>

      </Routes>
    </Router>
  );
}

export default App;
