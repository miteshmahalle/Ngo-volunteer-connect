import { Route, Routes } from "react-router-dom";
import About from "./pages/About";
import AuthPage from "./pages/AuthPage";
import Contact from "./pages/Contact";
import Home from "./pages/Home";
import Services from "./pages/Services";
import NgoDashboard from "./pages/ngodashboard";
import EditProfile from "./pages/editprofile";
import VolunteerDashboard from "./pages/volunteerdashboard";
import AdminDashboard from "./pages/admindashboard";
import ChangePassword from "./components/changepassword";
import Faqs from "./pages/faq";
import Guidelines from "./pages/guideline";
import DemoDashboard from "./pages/demoadmin";
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/services" element={<Services />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/auth/:mode" element={<AuthPage />} />
      <Route path="/ngo/dashboard" element={<NgoDashboard />} />
      <Route path="/profile/edit" element={<EditProfile />} />
      <Route path="/volunteer/dashboard" element={<VolunteerDashboard />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/profile/change-password" element={<ChangePassword />} />
      <Route path="/faqs" element={<Faqs />} />   {/* ADD THIS */}
      <Route path="/guidelines" element={<Guidelines />} />   {/* ADD THIS */}
     <Route path="/demo-dashboard" element={<DemoDashboard />} />
    </Routes>
  );
}

