import React, { useContext, useEffect, useRef, useState } from 'react'
import assets, { messagesDummyData } from '../assets/assets'
import { formatMessageTime } from '../lib/utils';
import { ChatContext } from '../context/ChatContext';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';


const ChatContainer = () => {
  
  const {messages,selectedUser,setSelectedUser,sendMessage, getMessages} = useContext(ChatContext)
  const {authUser,onlineUsers} = useContext(AuthContext)

  const scrollEnd = useRef()

  const [input,setInput] = useState("")
  
    //send message
    const handleSendMessage = async(e)=>{
      e.preventDefault();
      if(input.trim()==="") return null;
      await sendMessage({text:input.trim()})
      setInput("")
    }
    //send image
    const handleSendImage = async(e)=>{
      const file = e.target.files[0];
      if(!file||!file.type.startsWith("image/")){
        toast.error("Select an image file")
        return
      }
        const reader = new FileReader();

        reader.onloadend = async ()=>{
          await sendMessage({image:reader.result})
          e.target.value=""
        }
        reader.readAsDataURL(file)
    }
   
    useEffect(()=>{
     if(selectedUser){
      getMessages(selectedUser._id)

     }
    },[selectedUser])

   useEffect(()=>{
    if(scrollEnd.current&&messages){
      scrollEnd.current.scrollIntoView({behavior:"smooth"})
    }
   },[messages])

  return selectedUser ? (
    <div className='h-full overflow-hidden relative backdrop-blur-lg'>
      {/* header */}
      <div className='flex items-center gap-3 py-3 mx-4 border-b border-stone-500'>
        <img src={selectedUser.profilePic||assets.avatar_icon} className='w-8 rounded-full' alt="" />
        <p className='flex-1 text-lg text-white flex items-center gap-2 '>
          {selectedUser.fullName}
        {onlineUsers.includes(selectedUser._id)}<span className='w-2 h-2 rounded-full bg-green-500'></span>
        </p>
        <img onClick={() => setSelectedUser(null)} src={assets.arrow_icon} className='md:hidden w-7' alt="" />
        <img src={assets.help_icon} className='max-md:hidden w-5 cursor-pointer' alt="" />
      </div>

      {/* Chat */}
      <div className='flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6'>
        {messages.map((msg) => (
          <div
            key={msg._i}
            className={`flex items-end gap-2 justify-end mb-4 ${
              msg.senderId !== authUser._id && 'flex-row-reverse'
            }`}
          >
            {msg.image ? (
              <img
                src={msg.image}
                className='max-w-[230px] border border-gray-700 rounded-lg overflow-hidden'
                alt=""
              />
            ) : (
              <p
                className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg break-all bg-violet-500/30 text-white ${
                  msg.senderId !== authUser._id
                    ? 'rounded-br-none'
                    : 'rounded-bl-none'
                }`}
              >
                {msg.text}
              </p>
            )}
            <div className='text-center text-xs'>
              <img
                src={
                   msg.senderId === authUser._id
      ? authUser?.profilePic || assets.avatar_icon
      : selectedUser?.profilePic || assets.avatar_icon
                }
                className='w-7 rounded-full'
                alt=""
              />
              <p className='text-gray-500'>{formatMessageTime(msg.createdAt)}</p>
            </div>
          </div>
        ))}
        <div ref={scrollEnd}></div>
      </div>

      {/* Input */}
      <div className='absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3'>
        <div className='flex flex-1 items-center bg-gray-100/12 px-3 rounded-full'>
          <input onChange={(e)=>setInput(e.target.value)} value={input} onKeyDown={(e)=>e.key==="Enter"?handleSendMessage(e):null}
            type="text"
            placeholder='Send a message'
            className='flex-1 text-sm p-3 border-none rounded-lg outline-none text-white placeholder-gray-400'
          />
          <input onChange={handleSendImage} type="file" accept='image/png, image/jpeg' hidden id="image" />
          <label htmlFor="image">
            <img src={assets.gallery_icon} className='w-5 mr-2 cursor-pointer' alt="" />
          </label>
        </div>
        <img onClick={handleSendMessage} src={assets.send_button} className='w-7 cursor-pointer' alt="" />
      </div>
    </div>
  ) : (
    <div className='flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden'>
      <img className='max-w-40' src={assets.logo} alt="" />
      <p className='text-lg font-medium text-white'>Chat anytime, anywhere</p>
    </div>
  );
};

export default ChatContainer;
