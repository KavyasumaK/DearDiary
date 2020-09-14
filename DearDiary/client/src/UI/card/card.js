/****************************************
 * Title: card
 * Intial Date:
 * Summary: card component for forms.
 * Change 1:
 ***************************************/

import React from 'react';

import Classes from './card.module.css';

const card = (props)=>{
  let cardClasses = [Classes.Card]
  if(props.ForProfile)cardClasses.push(Classes.ForProfile);

return <div className={cardClasses.join(' ')}>
  <div className={Classes.CardTitle}>{props.cardTitle}</div>
  <div className={Classes.ErrorMessage}>{props.message}</div>
  {props.cardContent}
  </div>
}

export default card;