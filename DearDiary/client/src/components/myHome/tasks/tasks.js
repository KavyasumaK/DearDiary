import React from 'react';


import read from "../../../assets/icons/read.svg";
import friends from "../../../assets/icons/friends.svg";
import pencil from "../../../assets/icons/pencil.svg";
import calendar from "../../../assets/icons/calendar.svg";
import Classes from "./tasks.module.css";

const task = React.memo(()=>{
  return(
    <div className={Classes.Sections}>
    <div>
      <img alt={"Pencil"} src={pencil} className={Classes.IconSize} />Write in my Diary.
    </div>
    <div>
      <img alt={"Read"} src={read} className={Classes.IconSize} />
      Read or edit my dairy.
    </div>
    <div>
      <img alt={"Friends"} src={friends} className={Classes.IconSize} />
      Read friends' diary.
    </div>
    <div>
      <img alt={"Calendar"} src={calendar} className={Classes.IconSize} />
      Read entry on a specific date.
    </div>
  </div>
  );
});

export default task;