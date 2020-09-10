import React from 'react';

import Classes from './card.module.css';

const card = (props)=>{
return <div className={Classes.Card}>{props.formDets}</div>
}

export default card;