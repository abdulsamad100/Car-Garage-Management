import React, { useContext } from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import { AuthContext } from '../context/AuthContext'

const Layout = () => {
    const { signin } = useContext(AuthContext);
    return (
        <>
            <Header />
            <Outlet />
            {!signin.userLoggedIn ? <Footer /> : null}
        </>
    )
}

export default Layout