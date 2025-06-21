import React, { useState } from 'react'
import { getAuth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth'

import { useNavigate } from 'react-router'
import { error, info } from '../../lib/Toastify'
import { get, getDatabase, ref, set } from 'firebase/database'

const Signin = () => {
  const auth = getAuth()
  const navigate = useNavigate()

  // Form state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  console.log(email, password)

  const data = [
    { name: 'email', id: 1, required: true },
    { name: 'fullname', id: 2, required: true },
    { name: 'password', id: 3, required: true }
  ]

  const handlesignup = () => {
    if (email.trim() == '' && password.trim() == '') {
      error('Please fill the information')
    } else {
      signInWithEmailAndPassword(auth, email, password)
        .then(info => {
          navigate('/')
        })
        .catch(err => {
          info(err.code)
        })
    }
  }

  const handlegooglesignup = () => {
    const provider = new GoogleAuthProvider()

    signInWithPopup(auth, provider)
      .then(async result => {
        const user = result.user

        const db = getDatabase()
        const userRef = ref(db, `users/${user.uid}`)

        const snapshot = await get(userRef)

        if (snapshot.exists()) {
          info('Wellcome back')
        } else {
          await set(userRef, {
            username: user.displayName,
            email: user.email,
            profile_picture: user.photoURL,
            uid: user.uid
          })
          success('Hi Wellcome')
        }
        navigate('/')
      })
      .catch(error => {
        console.error('Sign-in error:', error)
      })
  }

  return (
    <div className='bg-gray-100 flex items-center justify-center h-screen'>
      <div className='flex flex-col items-center p-10 gap-2 w-[450px] bg-gray-300 rounded-2xl'>
        <span className='font-semibold text-3xl underline'>Signup</span>
        <form
          className='flex flex-col gap-y-1'
          action=''
          onSubmit={e => e.preventDefault()}
        >
          <div className='flex flex-col gap-y-1'>
            <label htmlFor='email'>Email</label>
            <input
              name='email'
              type='email'
              className='p-1 outline-0 border-gray-400 border-1 rounded pr-7'
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className='flex flex-col gap-y-1'>
            <label htmlFor='password'>Email</label>
            <input
              name='password'
              type='password'
              className='p-1 outline-0 border-gray-400 border-1 rounded pr-7'
              onChange={e => setPassword(e.target.value)}
            />
          </div>
        </form>
        <button
          type='submit'
          className='px-4 py-[2px] bg-blue-500 text-white rounded cursor-pointer'
          onClick={handlesignup}
        >
          SignIn
        </button>
        <p>or</p>
        <div className='flex gap-x-2'>
          <p>Continue with</p>
          <button
            className='px-4 py-[2px] bg-blue-500 text-white rounded cursor-pointer'
            onClick={handlegooglesignup}
          >
            Google
          </button>
        </div>
      </div>
    </div>
  )
}

export default Signin
