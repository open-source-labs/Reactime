// import StateButton from "./StateButton";
// import EffectButton from "./EffectButton";
// import RefComponent from "./RefComponent";
// import ContextButton from "./ContextButton";
// import { useState, useEffect, useRef, createContext } from "react";

// export const ButtonContext: any = createContext(null);

// export default function Buttons() {
//   const [count, setCount] = useState(0);
//   const [effectCount, setEffectCount] = useState(0);
//   const renders = useRef(-1);

//   useEffect(() => {
//     renders.current = renders.current + 1;
//     document.title = `You clicked ${effectCount} times`;
//   }, [count, effectCount]);

//   return (
//     <div className="buttons">
//       <h1>React Hook Buttons</h1>
//       <h4 className="description">
//         These buttons are functional components that manage their own state with
//         different react hooks.
//       </h4>
//       {/* {buttons} */}
//       <StateButton count={count} setCount={setCount} />
//       <EffectButton effectCount={effectCount} setEffectCount={setEffectCount} />
//       <h4> A box renders once useRef count is 3</h4>
//       <div className={renders.current >= 3 ? "show" : "hide"}>
//         <RefComponent counter={renders.current} />
//       </div>
//       <ButtonContext.Provider value={{ value: [count, setCount] }}>
//         <ContextButton />
//       </ButtonContext.Provider>
//     </div>
//   );
// }
