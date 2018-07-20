import React from 'react';

module.exports = props=>
<div className={props.class+" user"}>
  <div>{props.user.overall_score}</div>
  <div className='pic'><img src={props.user.picture} /></div>
  <div>{props.user.first}</div>
  <div>{props.user.last}</div>
  <div>{props.user.gender}</div>
  <div>{props.user.city}</div>
  <div>{props.user.props}</div>
</div>
