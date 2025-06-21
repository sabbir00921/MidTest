import React, { Suspense } from 'react'
import database from '../database/firebase.config'

import { BrowserRouter, Route, Routes } from 'react-router'

import Loading from './Skeleton/Loading'
import Home from './pages/home/Home'

const Signin = React.lazy(() => import('./pages/signin/Signin'))
const Signup = React.lazy(() => import('./pages/signup/Signup'))

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path='signin/'
          element={
            <Suspense fallback={<Loading text='Loading...' />}>
              <Signin />
            </Suspense>
          }
        />
        ;
        <Route
          path='signup/'
          element={
            <Suspense fallback={<Loading text='Loading...' />}>
              <Signup />
            </Suspense>
          }
        />
        <Route
          path='/'
          element={
            <Suspense fallback={<Loading text='Loading...' />}>
              <Home />
            </Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
