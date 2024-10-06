import React from 'react'
import { Outlet } from 'react-router-dom'
import NavBar from './NavBar'

const Layout = () => {
  return (
    <div className=' flex flex-col min-h-screen'><NavBar/>
    <Outlet/>
    </div>
  )
}

export default Layout