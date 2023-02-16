import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import styles from './Admin.module.scss';

export default function AdminLayout() {
  return (
    <div className={styles.layout}>
      <Navbar />
      <Outlet />
    </div>
  )
}
