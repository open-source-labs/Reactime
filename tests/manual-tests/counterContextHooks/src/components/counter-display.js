import React, { useContext } from "react";
import { Statistic } from "semantic-ui-react";
import { CounterContext } from "../context/counter-context";

export default function CounterDisplay() {
  const [count] = useContext(CounterContext);

  return (
    <Statistic>
      <Statistic.Value>{count}</Statistic.Value>
      <Statistic.Label>Counter</Statistic.Label>
    </Statistic>
  );
}
