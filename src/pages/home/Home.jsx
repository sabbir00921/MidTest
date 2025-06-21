import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../../component/homecomponent/Navbar'
import Landing from '../../component/homecomponent/Landing'
import { getDatabase, onValue, ref } from 'firebase/database'
import { AuthContext } from '../../contetx/Authcontext'

const Home = () => {
  const { authUser } = useContext(AuthContext)
  const db = getDatabase()
  const [user, setUser] = useState(null)

  useEffect(() => {
    if (authUser) {
      const userRef = ref(db, `users/${authUser.uid}`)
      onValue(userRef, snapshot => {
        if (snapshot.exists()) {
          setUser(snapshot.val())
        } else {
          console.log('No data available')
        }
      })
    }
  }, [authUser])

  return (
    <div className='flex flex-col w-full items-center'>
      <div className=' h-screen w-[80%]'>
        <Navbar UserData={user} />
        <Landing UserData={user} />
      </div>
    </div>
  )
}

export default Home
