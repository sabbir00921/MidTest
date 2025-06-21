import React, { useState } from 'react'
import {
  getAuth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth'
import { get, getDatabase, ref, set } from 'firebase/database'
import { useNavigate } from 'react-router'
import { FiEye } from 'react-icons/fi'
import { FaEyeSlash } from 'react-icons/fa'
import { info, success } from '../../lib/Toastify'

const Signup = () => {
  const auth = getAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [fullname, setFullname] = useState('')
  const [password, setPassword] = useState('')
  const [eye, setEye] = useState(true)

  const [emailerror, setEmailError] = useState('')
  const [fullnameerror, setFullnameError] = useState('')
  const [passworderror, setPasswordError] = useState('')

  const data = [
    { name: 'email', id: 1, required: true },
    { name: 'fullname', id: 2, required: true },
    { name: 'password', id: 3, required: true }
  ]

  const handleinput = e => {
    const { name, value } = e.target

    if (name === 'email') {
      setEmail(value)
      if (value === '') setEmailError('Email is required')
      else setEmailError('')
    } else if (name === 'fullname') {
      setFullname(value)
      if (value === '') setFullnameError('Fullname is required')
      else setFullnameError('')
    } else if (name === 'password') {
      setPassword(value)
      if (value === '') setPasswordError('Password is required')
      else setPasswordError('')
    }
  }

  const handlesignup = async () => {
    if (!email || !fullname || !password) {
      if (!email) setEmailError('Email is required')
      if (!fullname) setFullnameError('Full name is required')
      if (!password) setPasswordError('Password is required')
      return
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )

      const user = userCredential.user
      const db = getDatabase()
      const userRef = ref(db, `users/${user.uid}`)

      await set(userRef, {
        username: fullname,
        email: user.email,
        uid: user.uid,
        profile_picture:
          'https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg'
      })

      success('Signup successful')
      navigate('/')
    } catch (error) {
      info(error.message)
      console.error('Signup error:', error)
    }
  }

  // Google signup function implement
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
        <form action='' onSubmit={e => e.preventDefault()}>
          {data.map(({ name, id, required }) => (
            <div
              className={
                name === 'password'
                  ? 'flex flex-col gap-y-1 mt-7 relative overflow-hidden'
                  : 'flex flex-col gap-y-1 mt-7'
              }
              key={id}
            >
              <label htmlFor={name}>
                {`Enter ${name}`}
                {required && <span className=' text-red-600'> *</span>}
              </label>
              <input
                className='p-1 outline-0 border-gray-400 border-1 rounded pr-7'
                type={
                  name === 'email'
                    ? 'email'
                    : name === 'fullname'
                    ? 'text'
                    : eye
                    ? 'password'
                    : 'text'
                }
                placeholder={name}
                name={name}
                value={
                  name === 'email'
                    ? email
                    : name === 'fullname'
                    ? fullname
                    : password
                }
                onChange={handleinput}
              />
              {name === 'password' && (
                <span
                  onClick={() => setEye(!eye)}
                  className={
                    passworderror && password === ''
                      ? 'left-[90%] top-[43%] absolute'
                      : 'left-[90%] top-[59%] absolute cursor-pointer'
                  }
                >
                  {eye ? <FiEye /> : <FaEyeSlash />}
                </span>
              )}

              <div className='text-sm'>
                {name === 'email' && email === '' ? (
                  <span className='text-red-500'>{emailerror}</span>
                ) : name === 'fullname' && fullname === '' ? (
                  <span className='text-red-500'>{fullnameerror}</span>
                ) : name === 'password' && password === '' ? (
                  <span className='text-red-500'>{passworderror}</span>
                ) : (
                  ''
                )}
              </div>
            </div>
          ))}
        </form>
        <button
          type='submit'
          className='px-4 py-[2px] bg-blue-500 text-white rounded cursor-pointer'
          onClick={handlesignup}
        >
          SignUp
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

export default Signup
