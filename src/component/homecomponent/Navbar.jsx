import React, { useRef, useContext } from 'react'
import { MdOutlineFileUpload } from 'react-icons/md'
import uploadImageToCloudinary from '../../utils/ImageUpload.utils'
import { getDatabase, push, ref, set, update } from 'firebase/database'
import { success, info } from '../../lib/Toastify'
import { getAuth, signOut } from 'firebase/auth'
import { AuthContext } from '../../contetx/Authcontext'
import { useNavigate } from 'react-router'

const Navbar = ({ UserData }) => {
  const navigate = useNavigate()
  const db = getDatabase()
  const fileInputRef = useRef(null) // console.log(fileInputRef.current.files[0]);
  const { setAuthUser } = useContext(AuthContext)

  const handleFileChange = e => {
    const file = e.target.files[0]
    uploadImageToCloudinary(file)
      .then(res => {
        if (res) {
          const userRef = ref(db, `users/${UserData.uid}`)
          update(userRef, {
            profile_picture: res
          })
          success('Profile updated successfully')
        }
      })
      .catch(() => info('Upload failed'))
  }

  const handleLogout = () => {
    const auth = getAuth()
    signOut(auth)
      .then(() => {
        setAuthUser(null)
        success('Logged out successfully')
        navigate('signin')
      })
      .catch(error => {
        info('Logout failed')
        console.error(error)
      })
  }

  return (
    <div>
      <div className='w-full flex justify-between items-center p-4 bg-red-300 shadow'>
        {/* Profile Picture Upload */}
        <div className='flex gap-x-4 items-center font-semibold'>
          <div className='relative w-[45px] h-[45px] group cursor-pointer'>
            <img
              className='h-full w-full object-cover rounded-full'
              src={
                UserData?.profile_picture ||
                'https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg'
              }
              alt='missing'
            />
            <label
              htmlFor='file-upload'
              className='absolute inset-0 bg-black/10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer'
            >
              <MdOutlineFileUpload className='text-white text-2xl' />
            </label>
            <input
              id='file-upload'
              ref={fileInputRef}
              type='file'
              className='hidden'
              onChange={handleFileChange}
            />
          </div>
          <h1>{UserData?.username}</h1>
        </div>
        <div className='flex gap-x-2 items-center '>
          <button
            onClick={handleLogout}
            className='bg-blue-600 hover:bg-blue-700 rounded px-4 py-[2px] text-white cursor-pointer border-0'
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}

export default Navbar
