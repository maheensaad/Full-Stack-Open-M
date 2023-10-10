import React, { useEffect } from 'react';

const Notification = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000); // Close the notification after 5 seconds (adjust as needed)

    return () => clearTimeout(timer);
  }, [onClose]);

 

  return (
    <div>
      {message}
    </div>
  );
};

export default Notification;