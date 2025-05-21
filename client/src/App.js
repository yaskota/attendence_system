import './App.css';
import Register from './components/student/Register';
import { BrowserRouter,Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/student/Login';
import Otp from './components/student/Otp';
import Email from './components/student/Email';
import ResetPassword from './components/student/ResetPassword';
import TRegister from './components/teacher/Register';
import TLogin from './components/teacher/Login';
import TOtp from './components/teacher/Otp';
import TEmail from './components/teacher/Email';
import TResetPassword from './components/teacher/ResetPassword';
import Header from './components/Header';
import Student from './components/Student';
import Faculty from './components/Faculty';
import MLogin from './components/Login';
import StudentMain from './components/StudentMain';
import Teachermain from './components/teachermain.js';
import Subject from './components/teacher/Subject.js';
import Attendence from './components/teacher/Attendence.js';
import AttendanceFilter from './components/teacher/AttendeceFilter.js';
import UpdateClass from './components/teacher/UpdateClass.js';
import Profile from './components/student/Profile.js';
import ALogin from './components/Admin/Login.js';
import Main from './components/Admin/Main.js';
import TProfile from './components/teacher/Profile.js';

import { AuthProvider } from './context/AuthContext';

import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Header/>
        <ToastContainer 
          position="top-center"
          autoClose={2000}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover={false}
          draggable
          pauseOnFocusLoss={false}
          theme="colored"
        />
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/studentregister" element={<Register/>}/>
          <Route path="/studentotp" element={<Otp/>}/>
          <Route path="/studentlogin" element={<Login/>}/>
          <Route path="/studentemail" element={<Email/>}/>
          <Route path="/studentresetpassword" element={<ResetPassword/>}/>
          <Route path="/teacherregister" element={<TRegister/>}/>
          <Route path="/teacherotp" element={<TOtp/>}/>
          <Route path="/teacherlogin" element={<TLogin/>}/>
          <Route path="/teacheremail" element={<TEmail/>}/>
          <Route path="/teacherresetpassword" element={<TResetPassword/>}/>
          <Route path="/student" element={<Student/>}/>
          <Route path="/faculty" element={<Faculty/>}/>
          <Route path="/login" element={<MLogin/>}/>
          <Route path="/studentmain" element={<StudentMain/>}/>
          <Route path="/teachermain" element={<Teachermain/>}/>
          <Route path="/subject" element={<Subject/>}/>
          <Route path="/updatesubject" element={<UpdateClass/>}/>
          <Route path="/attendence" element={<Attendence/>}/>
          <Route path="/attendencefilter" element={<AttendanceFilter/>}/>
          <Route path="/studentprofile" element={<Profile/>}/>
          <Route path="/adminlogin" element={<ALogin/>}/>
          <Route path="/adminmain" element={<Main/>}/>
          <Route path="/teacherprofile" element={<TProfile/>}/>

        </Routes>
        </AuthProvider>
    </BrowserRouter>  

   
  );
}

export default App;
