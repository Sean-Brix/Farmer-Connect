import React, { useRef, useState } from 'react'

function Edit_Profile({admin_navigate, details}) {

  const [user, setUser] = useState();

  const [image, setImage] = useState(null);
  
  const uploadProfile = async(event)=>{
    event.preventDefault();

    const file = event.target.files[0];

    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch('/api/Accounts/uploadProfile',{
        method:'POST',
        body: formData
      }
    );

    if(!response.ok){
      const data = await response.json();
      console.log(data.payload.error);
      return
    }

    const newProfile = await response.blob();
    const newUrl = URL.createObjectURL(newProfile);
    
    console.log(newUrl);
    details.setProfile((prev)=>({...prev, picture: newUrl}));
  }

  return (
    <>
    
    {/* HEADER */}
    <div className="relative mt-30">
        <hr className="border-black-300" />
        <span className="absolute left-1/8 -translate-x-1/4 -top-5 bg-white rounded-lg px-4 text-2xl font-semibold text-black-700">
            Edit Account
        </span>
    </div>

    {/* MAIN */}
    <div className="flex flex-col items-center min-h-screen bg-white px-2 sm:px-0 mt-20 gap-10">   

        <div className="border-2 border-blue-900 rounded-lg shadow-lg p-4 sm:p-6 w-full max-w-5xl bg-white">
            <div className="flex items-center mb-2 mt-10">
                <span className="bg-white rounded-lg px-4 text-2xl sm:text-2xl font-semibold text-black-700 whitespace-nowrap z-10">
                    Profile Information
                </span>
                <hr className="flex-1 border-black-300 ml-4" />
            </div>

            <div className="bg-white flex flex-col-reverse md:flex-row border-b-none justify-center shadow-lg rounded-lg overflow-hidden p-4 sm:p-8 md:p-12 w-full max-w-5xl min-h-[400px] md:min-h-[600px]">
                <form className="mt-4 md:mt-0 space-y-8 text-black-700 p-4 sm:p-4 w-full md:w-1/2">

                    <div className="block">
                        <span className="text-black-700 font-bold">🔑 User Access</span>
                        <div className="mt-1 block w-full border rounded-lg p-2 pl-5 bg-white">{user.access}</div>
                    </div>
                    <div className="block">
                        <span className="text-black-700 font-bold">💼 Occupation</span>
                        <div className="mt-1 block w-full border rounded-lg p-2 pl-5 bg-white">{user.occupation}</div>
                    </div>

                    <div className="block">
                        <span className="text-black-700 font-bold">📍 Address</span>
                        <div className="mt-1 block w-full border rounded-lg p-2 pl-5 bg-white">{user.address}</div>
                    </div>

                    <div className="block">
                        <span className="text-black-700 font-bold">📞 Cellphone</span>
                        <div className="mt-1 block w-full border rounded-lg p-2 pl-5 bg-white">{user.cellphone_no}</div>
                    </div>
                    <div className="block">
                        <span className="text-black-700 font-bold">🏢 Institution</span>
                        <div className="mt-1 block w-full border rounded-lg p-2 pl-5 bg-white">{user.institution}</div>
                    </div>

                    <div className="block">
                        <span className="text-black-700 font-bold">🌾 Commodities</span>
                        <div className="mt-1 block w-full border rounded-lg p-2 pl-5 bg-white">None</div>
                    </div>

                    <div className="block">
                        <span className="text-black-700 font-bold">👥 Client Profile</span>
                        <div className="mt-1 block w-full border rounded-lg p-2 pl-5 bg-white">{user.client_profile}</div>
                    </div>

                </form>

                <div className="flex flex-col items-center space-y-4 mb-6 md:mb-0 p-2 sm:p-4 w-full md:w-1/2 ">
                    {/* Extra border wrapper */}
                    <div className="flex items-center justify-center mb-4">
                        <div className="rounded-full border-4 border-blue-800 p-1 flex items-center justify-center">

                            <img
                                src={user.picture}
                                alt="Profile"
                                className="w-32 h-32 sm:w-40 sm:h-40 object-cover rounded-full shadow-lg" />
                            
                        </div>
                    </div>
                    <div className="flex flex-col items-center space-y-2 w-full">
                        <span className="border-2 border-blue-800 rounded-lg px-4 py-1 text-lg font-semibold text-black-700 w-fit">
                            { user.firstname + " " + user.lastname }
                        </span>
                        <span className="text-black-600 text-base">
                            <i className="fa-solid fa-mars mr-2"></i>{user.gender}
                        </span>
                        <span className="text-black-600 text-base">
                            <i className="fa-solid fa-user-tie mr-2"></i>{user.position}
                        </span>
                    </div>

                    <div className="text-center">
                        {admin_navigate&&<div
                            className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 cursor-pointer bg-blue-800 text-white rounded-lg hover:bg-blue-500 transition text-sm sm:text-base border-2 border-blue-800"
                            onClick={()=>admin_navigate("edit_profile")}
                        >
                                <i className="fa-solid fa-pen-to-square"></i>
                                Edit Profile
                        </div>}
                    </div>

                </div>
            </div>
        </div>

        <div className="border-2 border-blue-900 rounded-lg shadow-lg p-4 sm:p-6 w-full max-w-5xl bg-white">
            <div className="flex items-center mb-4">
                <span className="bg-white rounded-lg px-4 text-2xl sm:text-2xl font-semibold text-black-700 whitespace-nowrap z-10">
                    Contacts Information
                </span>
                <hr className="flex-1 border-black-300 ml-4" />
            </div>
            <div className="flex flex-col w-full mt-4">
                <div className="flex flex-row justify-between items-center py-2 border-b border-gray-200">
                    <span className="font-semibold text-black-700">Email</span>
                    <span className="text-black-600">{user.email_address}</span>
                </div>
                <div className="flex flex-row justify-between items-center py-2 border-b border-gray-200">
                    <span className="font-semibold text-black-700">Telephone Number</span>
                    <span className="text-black-600">{user.telephone_no}</span>
                </div>
                <div className="flex flex-row justify-between items-center py-2">
                    <span className="font-semibold text-black-700">Facebook</span>
                    <span className="text-black-600">None</span>
                </div>
            </div>
        </div>
    </div>
    
    {/* PICTURE */}
    <div className='flex flex-col justify-center items-center font-bold bg-orange-300 w-full h-[91%] mt-[5%]'>

      <img
        src={details.picture}
        alt="Profile"
        className="w-32 h-32 sm:w-40 sm:h-40 mt-10 mb-6 object-cover border-2 rounded-full shadow-lg" 
        />

      {/* UPLOAD PROFILE PICTURE */}
      <input 
        type="file" 
        accept="image/*"
        onChange={uploadProfile}
        className="block w-[40%] text-sm text-gray-900
        file:mr-4 file:py-2 file:px-4
        file:rounded-full file:border-0
        file:text-sm file:font-semibold
        file:bg-orange-50 file:text-orange-700
          hover:file:bg-orange-100
          cursor-pointer border-4 p-4"
      />

      <div className="text-center">
          <div
              className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 cursor-pointer bg-green-500 text-black rounded-lg hover:bg-green-600 transition text-sm sm:text-base border-2 border-blue-800"
              onClick={()=>admin_navigate("account")}
              >
                  <i className="fa-solid fa-pen-to-square"></i>
                  Save Profile
          </div>
      </div>

    </div>

    </>
  )
}

export default Edit_Profile