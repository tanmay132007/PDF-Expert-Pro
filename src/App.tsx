import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Splash from './pages/Splash';
import Onboarding from './pages/Onboarding';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import MergeScreen from './pages/MergeScreen';
import SplitScreen from './pages/SplitScreen';
import ProtectScreen from './pages/ProtectScreen';
import CompressScreen from './pages/CompressScreen';
import SignatureScreen from './pages/SignatureScreen';
import WatermarkScreen from './pages/WatermarkScreen';
import ReorderScreen from './pages/ReorderScreen';
import OCRScreen from './pages/OCRScreen';
import FileDetails from './pages/FileDetails';
import PDFViewer from './pages/PDFViewer';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/splash" replace />} />
        <Route path="/splash" element={<Splash />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/auth/signin" element={<SignIn />} />
        <Route path="/auth/signup" element={<SignUp />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/tools/merge" element={<MergeScreen />} />
        <Route path="/tools/split" element={<SplitScreen />} />
        <Route path="/tools/protect" element={<ProtectScreen />} />
        <Route path="/tools/compress" element={<CompressScreen />} />
        <Route path="/tools/sign" element={<SignatureScreen />} />
        <Route path="/tools/watermark" element={<WatermarkScreen />} />
        <Route path="/tools/reorder" element={<ReorderScreen />} />
        <Route path="/tools/ocr" element={<OCRScreen />} />
        <Route path="/files/:id" element={<FileDetails />} />
        <Route path="/view/:id" element={<PDFViewer />} />
        <Route path="*" element={<Navigate to="/splash" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
