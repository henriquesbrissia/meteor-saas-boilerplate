import React from 'react';
import { api } from './api';
import { Accounts } from 'meteor/accounts-base';

export const App = () => {
  const { data } = api.users.findAll.useQuery()
  console.log(data)
  return ( 

  <div>
    <h1>Welcome to Meteor!</h1>
    <button onClick={() => Accounts.createUser({email: "teste@teste.com", password: "siajdiajd"})}>Create User</button>
    {data.map((item) => (
      <li key={item._id}>
        <ul>
          {item.emails[0].address}
        </ul>
      </li>
    ))}
  </div>
)};
