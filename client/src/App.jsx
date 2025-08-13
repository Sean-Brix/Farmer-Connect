import { BrowserRouter, Routes, Route } from 'react-router-dom';


// COMPONENTS
import Login from './Authentication/Components/Login.jsx';
import Landing from './Client/Services/Landing/Landing.jsx';
import Chat from './Components/Chats/Chat.jsx';

//ADMIN
import Dashboard from '../src/Admin/Components/Navigation/Dashboard.jsx';

// SERVER TEST  
import API_Request from './TEST/api_request.jsx';
import Details_php from './TEST/details_php.jsx';

//CLIENT 
import Eic from './Client/Services/EIC/EIC.jsx';
import User from './Client/Services/Profile/User_Profile.jsx';
import Seminar from './Client/Services/Enrollment/Seminar.jsx';
import Contact from './Client/Services/Info/contact.jsx';
import About from './Client/Services/Info/About.jsx';
import Distribution from './Client/Services/Distributions/Distribution.jsx';
import Survey from './Components/Survey/Survey.jsx';
import My_Profile from './Admin/Components/Profile/My_Profile.jsx';
import ForgotPassword from './Authentication/Components/ForgotPassword';
import Farmer_Report from './Client/Services/Report/Farmer_Report.jsx';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* AUTHENTICATION */}
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />

                {/* CLIENT ROUTES */}
                <Route path="/" element={<Landing />} />
                <Route path="/eic" element={<Eic />} />
              
                <Route path="/seminar" element={<Seminar />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/settings/profile" element={<User />} />
                 
                <Route path="/about" element={<About />} />
                <Route path="/distribution" element={<Distribution />} />
                <Route path="/survey" element={<Survey />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/report" element={<Farmer_Report />} />

                {/* ADMIN ROUTES */}
                <Route path="/admin" element={<Dashboard />} />
                <Route path="/admin/profile" element={<My_Profile />} />

                {/* SERVER TESTING */}
                <Route path="/testing/request" element={<API_Request />} />
                <Route path="/testing/details" element={<Details_php />} />
                
            </Routes>
        </BrowserRouter>
    );
}

export default App;
