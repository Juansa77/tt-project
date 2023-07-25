import React, { useState } from 'react'
import styled from 'styled-components';


const Modal = () => {

  const [render, setRender] = useState(false)

  return (
    <div>
    <header></header>
    <main><button onClick= {()=>setRender(true)}>VER MODAL</button></main>
    <footer></footer>
    </div>
  )
}

export default Modal