import React from 'react'
import { Outlet } from 'react-router-dom';
import MobileHeader from './MobileHeader/MobileHeader';
import { isMobile } from 'react-device-detect';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import MobileFooter from './MobileFooter/MobileFooter';

export default function Layout({ user }) {
  return (
    <div>
      {isMobile ? <MobileHeader user={user} /> : <Header user={user} />}
      <Outlet />
      {isMobile ? <MobileFooter /> : <Footer />}
    </div>
  )
}
