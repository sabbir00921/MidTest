import React, { useRef, useContext } from 'react'
import { getDatabase, push, ref, set, update } from 'firebase/database'
import { success, info } from '../../lib/Toastify'
import { useState } from 'react'
import uploadImageToCloudinary from '../../utils/ImageUpload.utils'
const CreatePost = ({ UserData }) => {
  const db = getDatabase()
  const fileInputRef = useRef(null)
  const [posImglink, setPosImglink] = useState('')
  const [posImgUploading, setPosImgUploading] = useState(false)

  const [posting, setPosting] = useState(false)
  const [createPost, setCreatePost] = useState(false)
  const [postTitle, setPostTitle] = useState('')
  const [postDescription, setPosDescription] = useState('')

  const handlepost = async () => {
    if (postTitle.trim() == '' && postDescription.trim() == '')
      return info('wrignt something')
    try {
      setPosting(true)
      const postRef = ref(db, `post/${UserData.uid}`)
      await push(postRef, {
        title: postTitle,
        description: postDescription,
        iamge: posImglink,
        username: UserData.username,
        email: UserData.email,
        uid: UserData.uid,
        profile_picture: UserData.profile_picture,
        createdAt: Date.now()
      })
      success('post created')
      setPosting(false)
      setCreatePost(false)
      setPostTitle('')
      setPosDescription('')
    } catch (err) {
      console.log(err)
    }
  }

  const handleFileChange = e => {
    const file = e.target.files[0]
    setPosImgUploading(true)

    console.log(file)

    uploadImageToCloudinary(file)
      .then(res => {
        if (res) {
          setPosImglink(res)
        }
        setPosImgUploading(false)
      })
      .catch(() => info('Upload failed'))
  }

  return (
    <div className='w-full flex justify-between items-center p-4  shadow'>
      <div className=''>
        {!createPost ? (
          <button
            onClick={() => setCreatePost(true)}
            className={`p-2 w-[100px] text-white  cursor-pointer bg-blue-600`}
          >
            Create Post
          </button>
        ) : (
          <div>
            <div className='shadow'>
              <input
                onKeyDown={e => {
                  if (e.key === 'Enter') handlepost()
                }}
                onChange={e => setPostTitle(e.target.value)}
                value={postTitle}
                placeholder='Title'
                className='py-2 px-2 outline-0 w-full border-b-2 border-b-black'
                type='text'
              />
              <textarea
                onKeyDown={e => {
                  if (e.key === 'Enter') handlepost()
                }}
                onChange={e => setPosDescription(e.target.value)}
                value={postDescription}
                placeholder='Description'
                className='py-2 px-2 outline-0 w-full h-[150px]'
                type='text'
              ></textarea>
            </div>
            {/* Adding image */}
            <div className='flex gap-x-4 items-center font-semibold'>
              <div className=''>
                <label
                  htmlFor='img-upload'
                  className=' flex p-2 bg-blue-600 mb-10 cursor-pointer'
                >
                  {posImgUploading ? 'Uploading...' : 'Add Image'}
                </label>
                <input
                  id='img-upload'
                  ref={fileInputRef}
                  type='file'
                  className='hidden'
                  onChange={handleFileChange}
                />
              </div>
            </div>
            <button
              onClick={handlepost}
              className={`p-2 w-[100px] text-white  cursor-pointer ${
                postTitle.trim() == '' ? 'bg-gray-400' : 'bg-blue-600'
              }`}
            >
              {`${posting ? 'Posting' : 'Post'}`}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default CreatePost
