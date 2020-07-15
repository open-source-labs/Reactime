import React from "react";
import { Segment } from "semantic-ui-react";

import { CounterContextProvider } from '../context/counter-context';
import CounterDisplay from "../components/counter-display";
import CounterButtons from "../components/counter-buttons";


export default function CounterView() {
  return (
    <CounterContextProvider>
      <h3>Counter</h3>
      <Segment textAlign="center">
        <CounterDisplay />
        <CounterButtons />
      </Segment>
    </CounterContextProvider>
  );
}
