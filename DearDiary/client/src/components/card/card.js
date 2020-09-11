import React from 'react';

import Classes from './card.module.css';

const card = (props)=>{
return <div className={Classes.Card}>
  <div className={Classes.ErrorMessage}>{props.message}</div>
  {props.formDets}
  </div>
}

export default card;