/****************************************
 * Title: Landing
 * Intial Date: 
 * Summary: Default page for the website.
 * Change 1:
 ***************************************/

import React from "react";

import Classes from "./landing.module.css";
import Buttons from "../../UI/buttons/buttons";

const landing = () => {
  return (
    <section className={Classes.Landing}>
      <div className={Classes.Details}>
        <p className={Classes.WelcomeText}>
          Hello there, <br></br>
          Welcome to Dear Diary where you write your daily diary entries just as
          you always do.
          <br></br>
          You can keep the entries private and also share only those entries you
          want to share with your friends.
          <br></br>Why wait? Let's get cracking!
        </p>
        <div className={Classes.ButtonsStyle}>
          <Buttons
            title={"Login"}
            styleType={"DefaultButton"}            
            buttonColor={"Green"}
            redirectClicked={"/login"}
          />
          <Buttons
            title={"Signup"}
            styleType={"DefaultButton"}
            buttonColor={"Green"}
            redirectClicked={"/signup"}
          />
        </div>
      </div>
    </section>
  );
};

export default landing;
