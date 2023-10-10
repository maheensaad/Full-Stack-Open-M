import React, { useState } from 'react';

const Togglable = (props) => {
  const [visible, setVisible] = useState(false);

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  return (
    <div>
      {visible ? (
        <div>
          {props.children}
          <button onClick={toggleVisibility}>Cancel</button>
        </div>
      ) : (
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      )}
    </div>
  );
};

export default Togglable;