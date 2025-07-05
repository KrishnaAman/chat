import React, { useState } from 'react'
import assets from '../assets/assets'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'


const LoginPage = () => {
  const [currentState, setCurrentState] = useState("Sign up")
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [bio, setBio] = useState("")
  const [isDataSubmitted, setIsDataSubmitted] = useState(false)

  const {login} = useContext(AuthContext)

  const onSubmitHandler= (event) =>{
    event.preventDefault();
    if(currentState === 'Sign up' && !isDataSubmitted){
      setIsDataSubmitted(true)
      return;
    }
    login(currentState == "Sign up" ? 'signup' : 'login', {fullName,email,password,bio})
  }

  return (
    <div className='min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl'>
      <img src={assets.logo_big} className='w-[min(30vw,250px)] ' alt="" />

      <form onSubmit={onSubmitHandler} className='border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg' action="">
        <h2 className='font-medium text-2xl flex justify-between items-center'>
          {currentState}
          {isDataSubmitted &&  <img onCanPlay={()=>isDataSubmitted(false)} src={assets.arrow_icon} className='w-5 cursor-pointer' alt="" />}
          
        </h2>
        {currentState=== "Sign up" && !isDataSubmitted && (
              <input value={fullName} onChange={(e)=>setFullName(e.target.value)} type="text" className='p-2 border border-gray-500 rounded-md focus:outline-none' placeholder='Full Name required' />
        )}
        {!isDataSubmitted && (
          <>
          <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder='Email Address' required className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500' />
          <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder='Password' required className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500' />
          </>
        )}
        {
          currentState === "Sign up" && isDataSubmitted && (
            <textarea value={bio} onChange={(e)=>setBio(e.target.value)} rows={4} className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-indigo-500' placeholder='provide a short bio' required ></textarea>
          )
        }
        <button type='submit' className='py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer'>
          {currentState === "Sign up" ? "Create Account": "Login"}
        </button>

        <div className='flex items-center gap-2 text-sm text-gray-500'>
          <input type="checkbox" name="" id="" />
          <p>Agree to terms of use & privacy policy.</p>
        </div>
       <div className='flex flex=col gap-2'>
        {currentState === "Sign up" ?(
          <p className='text-sm text-gray-600'>Already have an account ? <span onClick={()=>{setCurrentState("Login");setIsDataSubmitted(false)}} className='font-medium text-violet-500 cursor-pointer'>Login Here</span> </p>
        ): (
          <p className='text-sm text-gray-600'>Create an account <span onClick={()=>setCurrentState("Sign up")} className='font-medium text-violet-500 cursor-pointer'>Click here</span> </p>
        )
      }
       </div>
      </form>
    </div>
  )
}

export default LoginPage

