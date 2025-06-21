import { getDatabase, onValue, ref } from 'firebase/database'
import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../contetx/Authcontext'

const Post = () => {
  const { authUser } = useContext(AuthContext)
  const db = getDatabase()
  const [allPost, setAllPost] = useState([])

  useEffect(() => {
    if (!authUser?.uid) return

    const postDataRef = ref(db, `post/`)

    // Listen to posts in realtime
    onValue(postDataRef, snapshot => {
      const postBllArr = []

      snapshot.forEach(post => {
        if (post.key !== authUser.uid) {
          post.forEach(singlepost => {
            postBllArr.push({ ...singlepost.val(), key: singlepost.key })
          })
        }
      })
      const sortedPostData = postBllArr.sort(
        (a, b) => b.createdAt - a.createdAt
      )
      setAllPost(sortedPostData)
    })
  }, [authUser, db])

  return (
    <div className='bg-red-200 h-full overflow-hidden'>
      <div
        className='h-full overflow-y-scroll'
        style={{ scrollbarWidth: 'none' }}
      >
        {allPost.length === 0 ? (
          <p className='text-center p-4'>No posts found.</p>
        ) : (
          allPost.map(post => (
            <div
              key={post.key}
              className='max-w-[60%] mx-auto p-6 space-y-6 bg-gray-50'
            >
              <div className='bg-white rounded-lg shadow p-5'>
                <div className='flex items-center gap-4 mb-4'>
                  <img
                    src={
                      post.profile_picture ||
                      'https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg'
                    }
                    alt='User Profile'
                    className='w-12 h-12 rounded-full object-cover'
                  />
                  <div>
                    <h3 className='font-semibold text-lg text-gray-900'>
                      {post.username || 'Unknown User'}
                    </h3>
                    <p className='text-xs text-gray-400'>
                      {post.createdAt
                        ? new Date(post.createdAt).toLocaleString()
                        : ''}
                    </p>
                  </div>
                </div>
                <div className='text-gray-800 whitespace-pre-wrap'>
                  <h1>{post.title}</h1>
                  <p>{post.description}</p>
                  {post.iamge && (
                    <picture>
                      <img src={post.iamge} alt=' image missing' srcset='' />
                    </picture>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Post
