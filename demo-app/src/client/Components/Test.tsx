import React from 'react';
import { useState, createContext, useContext } from 'react';

interface User {
  username: string;
}

const defaultUser: User = { username: 'dummyusername' };

const UserContext = createContext<User>(defaultUser);

function Test() {
  const [user, setUser] = useState(defaultUser);
  return (
    <UserContext.Provider value={defaultUser}>
      <h1>{`What's up ${user.username}`}</h1>
      <Component2 />
    </UserContext.Provider>
  );
}
function Component2() {
  return (
    <>
      <h1>Component 2</h1>
      <Component3 />
    </>
  );
}

function Component3() {
  return (
    <>
      <h1>Component 3</h1>
      <Component4 />
    </>
  );
}

function Component4() {
  return (
    <>
      <h1>Component 4</h1>
      <Component5 />
    </>
  );
}

function Component5() {
  const user = useContext(UserContext);

  return (
    <>
      <h1>Component 5</h1>
      <h2>{`Hello ${user.username} again!`}</h2>
    </>
  );
}

export default Test;
