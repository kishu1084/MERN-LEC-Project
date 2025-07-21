import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext"; // ✅ updated
import Home from "./components/pages/Home";
import Demo from "./components/Viewer/pages/Demo";
import Courses from "./components/pages/courses";
import Quiz from "./components/pages/Quize/quize";
import StudentDashboard from "./components/pages/Studentdashboard/Studentdashboard";
import AdminDashboard from "./components/pages/AdminDashboard/AdminDashboard";
import UploadCourse from "./components/pages/AdminDashboard/UploadCourse";
import ManageStudents from "./components/pages/AdminDashboard/ManageStudents";
import PageNotfoung from "./NotFoundPage";
import FAQsManagement from "./components/pages/AdminDashboard/FAQsManagement";
import EventAnnouncements from "./components/pages/AdminDashboard/AnnouncementManagement/AnnouncementsEvents";
import NewsManagement from "./components/pages/AdminDashboard/AnnouncementManagement/NewsManagement";
import QuizManager from "./components/pages/AdminDashboard/QuizManager";
import CourseDetailsPage from "./components/Viewer/pages/CourseDetailsPage";
import PaidCourese from "./components/Viewer/pages/PaidCourese";
import CourseTypePage from "./components/Viewer/pages/CourseTypePage";
import AdminInquiryList from "./components/pages/AdminDashboard/AdminInquiryList";
import AdminQuizResults from "./components/pages/AdminDashboard/AdminQuizResults";
import CourseRequirestManagement from "./components/pages/AdminDashboard/courseRequirestManagement";
import AssociatedCompanies from "./components/pages/AdminDashboard/AssociatedCompanies";
import TrainerUpload from "./components/pages/AdminDashboard/TrainerUpload";
import AdminEventInquiries from "./components/pages/AdminDashboard/AdminEventInquiries";
import RegisteredStudents from "./components/pages/AdminDashboard/RegisteredStudents";
import ManageTestimonial from "./components/pages/AdminDashboard/ManageTestimonial";
import UnauthorizedPage from "./UnauthorizedPage";

const PrivateRoute = ({ children }) => {
  const { user } = useAuth(); // ✅ get user from context
  return user ? children : <Navigate to="/unauthorized" />;
};

function App() {
  

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin-dashboard" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
          <Route path="/student-dashboard" element={<PrivateRoute><StudentDashboard /></PrivateRoute>} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/ExclusiveCourses" element={<PaidCourese />} />
          <Route path="/quize/:quizId" element={<Quiz />} />
          <Route path="/course/:id" element={<CourseDetailsPage />} />
          <Route path="/courses/:courseType" element={<CourseTypePage />} />
          <Route path="/admin-dashboard/manage-courses" element={<PrivateRoute><UploadCourse /></PrivateRoute>} />
          <Route path="/admin-dashboard/manage-quize-result" element={<PrivateRoute><AdminQuizResults /></PrivateRoute>} />
          <Route path="/admin-dashboard/manage-inquiry" element={<PrivateRoute><AdminInquiryList /></PrivateRoute>} />
          <Route path="/admin-dashboard/manage-course-requirest" element={<PrivateRoute><CourseRequirestManagement /></PrivateRoute>} />  
          <Route path="/admin-dashboard/manage-student" element={<PrivateRoute><ManageStudents /></PrivateRoute>} />
          <Route path="/admin-dashboard/manage-faqs" element={<PrivateRoute><FAQsManagement /></PrivateRoute>} />
          <Route path="/admin-dashboard/manage-events" element={<PrivateRoute><EventAnnouncements /></PrivateRoute>} />
          <Route path="/admin-dashboard/manage-news" element={<PrivateRoute><NewsManagement /></PrivateRoute>} />
          <Route path="/admin-dashboard/manage-quize" element={<PrivateRoute><QuizManager /></PrivateRoute>} />
          <Route path="/admin-dashboard/manage-trainer" element={<PrivateRoute><TrainerUpload /></PrivateRoute>} />
          <Route path="/admin-dashboard/manage-associated-companies" element={<PrivateRoute><AssociatedCompanies /></PrivateRoute>} />
          <Route path="/admin-dashboard/manage-event-inquiry" element={<PrivateRoute><AdminEventInquiries /></PrivateRoute>} />
          <Route path="/admin-dashboard/manage-event-students" element={<PrivateRoute><RegisteredStudents /></PrivateRoute>} />
          <Route path="/admin-dashboard/manage-testimonial" element={<PrivateRoute><ManageTestimonial /></PrivateRoute>} />
          <Route path="/*" element={<PageNotfoung />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
        </Routes>
        
      </Router>
    </>
  );
}

export default function WrappedApp() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}
