import React, { useMemo } from 'react';
import { Group } from '@visx/group';
import { Cluster, hierarchy } from '@visx/hierarchy';
//import { HierarchyPointNode, HierarchyPointLink } from '@visx/hierarchy/lib/types';
import { LinkVertical } from '@visx/shape';
import { LinearGradient } from '@visx/gradient';
import { StateRouteProps} from './StateRoute'
import { onHover } from '../actions/actions'
import { useStoreContext } from '../store'
import Legend from './AtomsRelationshipLegend'

export const blue = '#acdbdf';
export const selectWhite = '#f0ece2';

export const lightgreen = '#0BAB64';
export const green = '#3BB78F'
export const orange = '#FED8B1';

export const merlinsbeard = '#f7f7f3';
export const background = '#242529';
export const root = '#d2f5e3';

interface clusterShape {
  name?:string;
  children?: clusterShape[]
} 

interface outerObjShape {
  name?:string;
  children?: outerObjShape[]
} 

interface innerObjShape {
  name?:string;
  children?: innerObjShape[]
} 

interface selectorsCache {
  [key:string]: any
}


const clusterData : clusterShape = {};
const selectorsCache :selectorsCache = {};
const bothObj = {}; 


let initialFire = false 
function clusterDataPopulate(props:StateRouteProps) {
  let atomCompObj = reorganizedCompObj(props);
  
  //this is to set the root name property 
  if (props[0].name) {
    clusterData.name = props[0].name;
  }

  //we'll first handle AtomSelectors 
  if(Object.entries(props[0].atomSelectors).length !== 0){
    if(!clusterData.children) clusterData.children = []
   
    for(let key in props[0].atomSelectors){
      let outerobj:outerObjShape = {}  
      outerobj.name = key
      selectorsCache[key] = true 
      
      if(!bothObj[key]){
        bothObj[key] = []
      }


      if(props[0].atomSelectors[key].length){
      for(let i=0; i<props[0].atomSelectors[key].length;i++){
        if(!outerobj.children) outerobj.children = []
        let innerobj:innerObjShape = {}
        innerobj.name = props[0].atomSelectors[key][i]
        selectorsCache[props[0].atomSelectors[key][i]] = true

        //if atoms contain components 
        if(atomCompObj[props[0].atomSelectors[key][i]]){
          for(let j=0; j<atomCompObj[props[0].atomSelectors[key][i]].length;j++){
            if(!bothObj[props[0].atomSelectors[key][i]]){
              bothObj[props[0].atomSelectors[key][i]] = []
            }
              bothObj[props[0].atomSelectors[key][i]].push(atomCompObj[props[0].atomSelectors[key][i]][0])

            if(!innerobj.children) innerobj.children = []
            innerobj.children.push({name:atomCompObj[props[0].atomSelectors[key][i]]})
            bothObj[key].push(atomCompObj[props[0].atomSelectors[key][i]][0])
            
          }
        }
        outerobj.children.push(innerobj)
      }
    }

    // selector to component directly 
        if(atomCompObj[key] && atomCompObj[key].length){
          for (let i=0; i<atomCompObj[key].length;i++){
            outerobj.children.push({name:atomCompObj[key][i]})

            if(!bothObj[key]){
              bothObj[key] = []
            } 
            bothObj[key].push(atomCompObj[key][i])
          }
        }
        
    clusterData.children.push(outerobj)
    }
  }
  
  for (let key in atomCompObj){
    let outObj:outerObjShape = {};
    if(!selectorsCache[key]){
      outObj.name = key
      if(!bothObj[key]) bothObj[key] = []
      for (let i=0; i<atomCompObj[key].length;i++){
        if(!outObj.children) outObj.children = []
        outObj.children.push({name:atomCompObj[key][i]})
        bothObj[key].push(atomCompObj[key][i])
      }
      clusterData.children.push(outObj)
    }    
  }
  initialFire = true 

}


function reorganizedCompObj(props) {
  let atomsComponentObj = props[0].atomsComponents;
  let reorganizedCompObj = {};

  for (const key in atomsComponentObj) {
    for (let i = 0; i < atomsComponentObj[key].length; i++) {
      if (!reorganizedCompObj[atomsComponentObj[key][i]]) {
        reorganizedCompObj[atomsComponentObj[key][i]] = [key];
      } else {
        reorganizedCompObj[atomsComponentObj[key][i]].push(key);
      }
    }
  }
  return reorganizedCompObj;
}

function Node({ node, snapshots, dispatch, bothObj}) {
  // const [dispatch] = useStoreContext();
  const selector = node.depth === 1 && node.height === 2
  const isRoot = node.depth === 0;
  const isParent = !!node.children;
  
  if (isRoot) return <RootNode node={node} />;
  if (selector) return <SelectorNode node = {node} snapshots = {snapshots} bothObj = {bothObj} dispatch = {dispatch}/>;

  return (
    <Group top={node.y} left={node.x}>
      {node.depth !== 0 && (
        <circle
          r={12}
          fill={isParent ? orange : blue}
          stroke={isParent ? orange : blue}
          onMouseEnter={()=> {
            for (let i=0; i<bothObj[node.data.name].length; i++){
              dispatch(onHover(snapshots[0].recoilDomNode[bothObj[node.data.name][i]]))
            }                            
          }}
        />
      )}
      <text
        dy=".33em"
        fontSize={9}
        fontFamily="Arial"
        textAnchor="middle"
        y = "-20"
        style={{ pointerEvents: 'none' }}
        fill={isParent ? orange : blue}
      >
        {node.data.name}
      </text>
    </Group>
  );
}

function RootNode({ node }) {
  
  const width = 40;
  const height = 20;
  const centerX = -width / 2;
  const centerY = -height / 2;

  return (
    <Group top={node.y} left={node.x}>
      <rect
        width={width}
        height={height}
        fill={root}
        y={centerY}
        x={centerX}
        rx="10"
        ry="10"
        fill="url('#top')"
      />
      <text
        dy=".33em"
        top={node.y}
        left={node.x}
        fontSize={9}
        fontFamily="Arial"
        textAnchor="middle"
        style={{ pointerEvents: 'none' }}
        fill={background}
      >
        {node.data.name}
      </text>
    </Group>
  );
}

function SelectorNode({ node, snapshots, dispatch, bothObj}) {
    return (
      <Group top={node.y} left={node.x}>
      {node.depth !== 0 && (
        <circle
          r={12}
          fill={selectWhite}
          stroke={selectWhite}
          onMouseEnter={()=> {
            for (let i=0; i<bothObj[node.data.name].length; i++){
              dispatch(onHover(snapshots[0].recoilDomNode[bothObj[node.data.name][i]]))
            }                     
          }}
        />
      )}
      <text
        dy=".33em"
        fontSize={9}
        fontFamily="Arial"
        textAnchor="middle"
        y = "-20"
        style={{ pointerEvents: 'none' }}
        fill={selectWhite}
      >
        {node.data.name}
      </text>
    </Group>
  );
}

function removeDup(bothObj){
  let filteredObj = {}
  for (let key in bothObj){
    let array = bothObj[key].filter((a,b) => bothObj[key].indexOf(a) === b)
    filteredObj[key] = array 
  }
  return filteredObj
}

const defaultMargin = { top: 40, left: 0, right: 0, bottom: 40 };

// export type DendrogramProps = {
//   width: number;
//   height: number;
//   margin?: { top: number; right: number; bottom: number; left: number };
// };

export default function AtomsRelationship({
  width,
  height,
  margin = defaultMargin,
  snapshots,
}) {

  
  let filtered = removeDup(bothObj)

  const [{ tabs, currentTab }, dispatch] = useStoreContext();

  if(!initialFire){
    clusterDataPopulate(snapshots);
  }
  
  const data = useMemo(() => hierarchy(clusterData), []);
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  return width < 10 ? null : (
    <>
    <div>
      <Legend 
      hierarchy = {hierarchy} />
    </div>
    <svg width={width} height={height}>
      
      <LinearGradient id="top" from={lightgreen} to={green} />

      <rect width={width} height={height} rx={14} fill={background} />
      <Cluster root={data} size={[xMax, yMax]}>
        {(cluster) => (
          <Group top={margin.top} left={margin.left}>
            {cluster.links().map((link, i) => (
              <LinkVertical
                key={`cluster-link-${i}`}
                data={link}
                stroke={merlinsbeard}
                strokeWidth="1"
                strokeOpacity={0.2}
                fill="none"                
              />
            ))}
            {cluster.descendants().map((node, i) => (
              <Node key={`cluster-node-${i}`} 
              node={node}
              bothObj = {filtered}
              snapshots = {snapshots}
              dispatch = {dispatch} />
            ))}
          </Group>
        )}
      </Cluster>
    </svg>
    </>
  );
}