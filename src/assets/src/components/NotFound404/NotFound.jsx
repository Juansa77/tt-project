import React from 'react'
import "./NotFound.css"
import { FaDice } from 'react-icons/fa';
const NotFound = () => {
  return (
    <div className='notFound-wrapper'><FaDice size="100px"/><h1>Page not found</h1></div>
  )
}

export default NotFound