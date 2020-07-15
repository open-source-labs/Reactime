import React, { useContext } from "react";
import { Button } from "semantic-ui-react";
import { CounterContext } from "../context/counter-context";

export default function CounterButtons() {
  const [count, setCount] = useContext(CounterContext);

  const increment = () => {
    setCount(count + 1)
  }

  const decrement = () => {
    setCount(count - 1)
  }

  return (
    <div>
      <Button.Group>
        <Button color="green" onClick={increment}>
          Add
        </Button>
        <Button color="red" onClick={decrement}>
          Minus
        </Button>
      </Button.Group>
    </div>
  );
}
