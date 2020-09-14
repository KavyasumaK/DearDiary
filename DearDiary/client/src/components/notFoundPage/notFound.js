/****************************************
 * Title: notFound
 * Intial Date:
 * Summary: For all those lost paths.
 * Change 1:
 ***************************************/
import React from "react";

import Classes from "./notFound.module.css";

const notFound = () => {
  return (
    <div className={Classes.NotFound}>
      <div className={Classes.Embarrassing}></div>
      <div className={Classes.TextStyle}>
        <h1>Status 404</h1>
        <p>
          Page you are looking for may have been changed/moved or probably never
          built. <span role='img' aria-label='Embarrassing!'>😳😳</span>
        </p>
        <p>Please <a href='/login'>login</a> or <a href='/signup'>Signup</a> to explore other paths.</p>
      </div>
    </div>
  );
};

export default notFound;
