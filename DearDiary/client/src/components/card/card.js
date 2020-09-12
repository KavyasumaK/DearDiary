import React from 'react';

import Classes from './card.module.css';

const card = (props)=>{
return <div className={props.ForProfile?Classes.ForProfile:Classes.Card}>
  <div className={Classes.ErrorMessage}>{props.message}</div>
  {props.cardContent}
  </div>
}

export default card;