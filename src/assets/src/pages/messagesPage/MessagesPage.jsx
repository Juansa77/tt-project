import "./MessagesPage.css"

import React from 'react'

const MessagesPage = () => {
  return (
    <div className="messages-container">
    <div className="header-messages">
    <h1 >MESSAGES</h1>
    <div className="sended-messages-wrapper"> </div>
 
    </div>
    <div className="input-message-wrapper">
      <input
        type="text"
        

        placeholder="Type your message..."
      />
      <button className="sendmsg-btn" >Send</button>
    </div>
  </div>
  )
}

export default MessagesPage