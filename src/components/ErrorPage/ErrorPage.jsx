import React from 'react'
import { Link } from 'react-router-dom'

export default function ErrorPage() {
  return (
    <div className='content'>
      <h1>Ой, кажется страница не найдена</h1>
      <Link className='primary-button' to='/'>На главную</Link>
    </div>
  )
}
