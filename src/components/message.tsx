import React from 'react';
import {withAppContext} from '../context';
import UserMessage from './userMessage';

const Message = (props: any) => {
  const {message} = props;
  let component = null;
  if (message.isUserMessage()) {
    component = UserMessage;
  }
  return component;
};

export default withAppContext(Message);
