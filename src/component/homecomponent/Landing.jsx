import React from 'react'
import Post from './Post'
import UserList from './UserList'
import CreatePost from './CreatePost'

const Landing = ({ UserData }) => {
  return (
    <div className='h-[88%]'>
      <div className='w-full h-full flex'>
        <div className='w-3/10'>
          <CreatePost UserData={UserData} />
        </div>
        <div className='w-5/10'>
          <Post />
        </div>
        <div className='w-2.5/10'>
          <UserList />
        </div>
      </div>
    </div>
  )
}

export default Landing
