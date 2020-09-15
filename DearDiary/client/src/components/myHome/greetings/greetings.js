import React from "react";

import Classes from './greetings.module.css';

const greetings = React.memo((props) => {
  return (
    <div className={Classes.LastEntryDate}>
      <div className={Classes.DarkBackground}>
        <div className={Classes.GreetingText}>
          Welcome back!,
          <br /> Your last entry was on {props.createdAt}
        </div>
      </div>
      </div>
  );
});

export default greetings;