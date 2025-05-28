import { BrowserRouter, Routes, Route } from 'react-router-dom'

// COMPONENTS
import Login from './Services/Authentication/Components/Login.jsx'
import Reg_1 from './Services/Authentication/Components/Reg_1.jsx'
import Reg_2 from './Services/Authentication/Components/Reg_2.jsx'
import Reg_3 from './Services/Authentication/Components/Reg_3.jsx'
import Landing from './Services/Landing_Page/Landing/Landing.jsx'
import EIC from './Services/EIC_Borrow/Client/EIC.jsx'
import Survey from './Components/Survey/Survey.jsx'
import Profiles from './Services/Profile/Profiles/Profile.jsx'
import Edit_prof from './Services/Profile/Edit_Profile/Edit.jsx'
import Enroll from './Services/Enrollment/Enrollments/enroll.jsx'

// SERVER TEST
import API_Request from './TEST/api_request.jsx'

function App() {
  
  return (

    <BrowserRouter>
      <Routes>


        {/* DEVELOPMENT ROUTE */}
        
        <Route path='/' element = { <Landing/> } />
        <Route path='/login' element = { <Login/> } />
        <Route path='/register' element = { <Reg_1/> } />
        <Route path='/register/2' element = { <Reg_2/> } />
        <Route path='/register/3' element = { <Reg_3/> } />
        <Route path='/eic' element = { <EIC/> } />
        <Route path='/survey' element = { <Survey/> } />
        <Route path='/profiles' element = { <Profiles/> } />
        <Route path='/profiles/edit' element = { <Edit_prof/> } />
        <Route path='/enrollment' element = { <Enroll/> } />  


        {/* SERVER TESTING */}

        <Route path='/testing/request' element = { <API_Request/> } />

        
      </Routes>
    </BrowserRouter>
  )
}

export default App
