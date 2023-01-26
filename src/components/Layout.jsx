import React from 'react'
import { Outlet } from 'react-router-dom';
import MobileHeader from './MobileHeader/MobileHeader';
import { isMobile } from 'react-device-detect';
import Header from './Header/Header';

export default function Layout() {
  return (
    <div>
      {isMobile ? <MobileHeader /> : <Header />}
      <Outlet />
    </div>
  )
}
