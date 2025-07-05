import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import assets from '../assets/assets';
import { AuthContext } from '../context/AuthContext';

const ProfilePage = () => {

  const {authUser, updateProfile} = useContext(AuthContext);
  const [selectedImage,setSelectedImage] =useState(null)
  const navigate = useNavigate();
  const[name,setName] = useState(authUser.fullName)
  const[bio,setBio] = useState(authUser.bio)
  
  const handleSubmit = async (e) =>{
    e.preventDefault();
    if(!selectedImage){
      await updateProfile({fullName:name,bio})
       navigate('/')
       return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(selectedImage);
    reader.onload = async ()=>{
      const base64Image = reader.result;
      await updateProfile({profilePic: base64Image,fullName:name,bio}) 
        
    navigate('/')
    }
   
  }

  return (
    <div className='min-h-screen bg-cover bg-no-repeat flex justify-center items-center'>
      <div className='w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600 flex items-center justify-between max-sm:flex-col-reverse rounded-lg'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-5 p-10 flex-1' action="">
          <h3 className='text-lg'>Profile Details</h3>
          <label htmlFor="avatar" className='flex items-center gap-3 cursor-pointer'>
            <input onChange={(e)=>setSelectedImage(e.target.files[0])} type="file" name="" id="avatar" accept='.png, .jpg, .jpeg' hidden />
            <img src= {selectedImage ? URL.createObjectURL(selectedImage):assets.avatar_icon} className={`w-12 h-12 ${selectedImage && 'rounded-full'} `} alt="" />
            Upload profile image
          </label>
          <input value={name} onChange={(e)=>setName(e.target.value)} className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus::ring-violet-500' type="text" required placeholder='Your Name' name="" id="" />
          <textarea value={bio} onChange={(e)=>setBio(e.target.value)} rows={4} name="" placeholder='Write Profilie Bio' required className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500' id=""></textarea>
          <button className='py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-full p-2 text-lg cursor-pointer'>Save</button>
        </form>
        <img className={`max-w-40 aspect-square mr-3 rounded-full max-10 max-sm:mt-10 ${selectedImage && 'rounded-full'}`} src= {authUser?.profilePic||assets.logo_icon} alt="" />
      </div>
    </div>
  )
}

export default ProfilePage