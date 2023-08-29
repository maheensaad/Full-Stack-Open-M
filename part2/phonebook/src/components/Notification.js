import React from "react"

const Notification = ({ message, success }) => {
  const messageStyle = {
    color: success ? "green" : "red", 
    background: "lightgray",
    fontSize: 20,
    borderStyle: "solid",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  }

  if (message === null) {
    return null
  }

  return (
    <div style={messageStyle}>
      {message}
    </div>
  )
}

export default Notification
