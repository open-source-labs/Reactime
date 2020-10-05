import React, { Component, useEffect, useState, Fragment } from 'react';
import { Chart } from 'react-google-charts';

function AtomsRelationship(props) {
   const { atomsComponent , atomSelectors } = props;
   console.log(props)

  // const atomsAndComp = atomsRel
  //   .filter((e) => e[2] !== 'atoms and selectors')
  //   .map((e) => {
  //     let copy = [...e];
  //     copy[2] = 1;
  //     return [...copy];
  //   });

  // const atomsAndSelectors = atomsRel
  //   .filter((e) => e[2] === 'atoms and selectors')
  //   .map((e) => {
  //     let copy = [...e];
  //     copy[2] = 1;
  //     return [...copy];
  //   });

  // const copyatomsRel = atomsRel.map((e) => {
  //   let copy = [...e];
  //   copy[2] = 1;
  //   return copy;
  // });
  // const [atoms, setAtoms] = useState([...copyatomsRel]);
  // const [atomAndSelectorCheck, setAtomAndSelectorCheck] = useState(false);
  // const [atomAndCompCheck, setAtomAndCompCheck] = useState(false);

  // useEffect(() => {
  //   if (
  //     (!atomAndSelectorCheck && !atomAndCompCheck) ||
  //     (atomAndSelectorCheck && atomAndCompCheck)
  //   ) {
  //     setAtoms(copyatomsRel);
  //   } else if (atomAndSelectorCheck) {
  //     setAtoms(atomsAndSelectors);
  //   } else {
  //     setAtoms(atomsAndComp);
  //   }
  // }, [atomAndSelectorCheck, atomAndCompCheck, props]);

  return (
    
    <div>
      Hello
    </div>
    // <div className="history-d3-container">
    //   {atoms && (
    //     <Fragment>
    //       <Chart
    //         width={'100%'}
    //         height={'98%'}
    //         chartType="Sankey"
    //         options={{
    //           sankey: {
    //             link: { color: { fill: '#gray', fillOpacity: 0.1 } },
    //             node: {
    //               colors: [
    //                 '#4a91c7',
    //                 '#5b9bce',
    //                 '#6ba6d5',
    //                 '#7bb0dc',
    //                 '#8abbe3',
    //                 '#99c6ea',
    //                 '#a8d0f1',
    //                 '#b7dbf8',
    //                 '#c6e6ff',
    //                 '#46edf2',
    //                 '#76f5f3',
    //                 '#95B6B7',
    //                 '#76dcde',
    //                 '#5fdaed',
    //               ],

    //               label: { color: '#fff', fontSize: '13', fontName: 'Monaco' },
    //               nodePadding: 50,
    //               width: 15,
    //             },
    //           },
    //           tooltip: { textStyle: { color: 'white', fontSize: 0.1 } },
    //         }}
    //         loader={<div>Loading Chart</div>}
    //         data={[['Atom', 'Selector', ''], ...atoms]}
    //         rootProps={{ 'data-testid': '1' }}
    //       />
    //       <div>
    //         <input
    //           type="checkbox"
    //           id="atomscomps"
    //           onClick={(e) =>
    //             setAtomAndCompCheck(atomAndCompCheck ? false : true)
    //           }
    //         />
    //         <label htmlFor="atomscomps">
    //           {' '}
    //           Only Show Atoms (or Selectors) and Components{' '}
    //         </label>
    //         <input
    //           type="checkbox"
    //           id="atomsselectors"
    //           onClick={(e) =>
    //             setAtomAndSelectorCheck(atomAndSelectorCheck ? false : true)
    //           }
    //         />
    //         <label htmlFor="atomsselectors">
    //           {' '}
    //           Only Show Atoms and Selectors{' '}
    //         </label>
    //       </div>
    //     </Fragment>
    //   )}
    // </div>
  );
}

export default AtomsRelationship;
