import React from 'react';


import read from "../../../assets/icons/read.svg";
import friends from "../../../assets/icons/friends.svg";
import pencil from "../../../assets/icons/pencil.svg";
// import calendar from "../../../assets/icons/calendar.svg";
import Classes from "./tasks.module.css";
import { Link } from 'react-router-dom';

const task = React.memo(()=>{
  return(
    <div className={Classes.Sections}>
    <Link to='/writediary' className={Classes.TaskLink}>
      <img alt={"Pencil"} src={pencil} className={Classes.IconSize}/>Write in my Diary.
    </Link>
    <Link to='/readmyentries' className={Classes.TaskLink}>
      <img alt={"Read"} src={read} className={Classes.IconSize} />
      Read or edit my dairy.
    </Link>
    <Link to='/readfriendsentries' className={Classes.TaskLink}>
      <img alt={"Friends"} src={friends} className={Classes.IconSize} />
      Read friends' diary.
    </Link>
    {/* <Link to='/writediary' className={Classes.TaskLink}>
      <img alt={"Calendar"} src={calendar} className={Classes.IconSize} />
      Read entry on a specific date.
    </Link> */}
  </div>
  );
});

export default task;