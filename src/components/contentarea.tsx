import { useUIStore } from '@/store/uistore';
import React, { useEffect, useState, useRef, type ReactElement } from 'react';
import { Button, Table, Card, ScrollArea } from '@radix-ui/themes';
import { useGridStore } from '@/store/gridStore';
import './contentarea.css';
import { Canvas } from '@react-three/fiber';
import DroneSystems from './DroneSystems';
import DroneDelivery from './dronedelivery';
import { PerspectiveCamera } from '@react-three/drei';
import { queries, world, getEntityById, type Entity } from '@/ecs/world';


function HomeView(){
  // Access the grid from the grid store
  const grid = useGridStore((state) => state.getGrid());
  const isInitialized = useGridStore((state) => state.isInitialized);

 // Initialize grid on component mount
  useEffect(()=>{
    // Initialize grid on mount
    useGridStore.getState().initializeGrid(8,8,'_');
    return ()=>{
      // Cleanup if needed
      useGridStore.getState().resetGrid();
    }
  },[]); // run only once on mount

  useEffect(()=>{
    // timer to move a Symbol around the grid
    const interval = setInterval(()=>{
      // action inside timer
      if(isInitialized){
        // if initialized, move a symbol
        const x = Math.floor(Math.random()*8);
        const y = Math.floor(Math.random()*8);
        const prevX = useGridStore.getState().grid.flat().findIndex(cell=>cell.value==='X') % 8;
        const prevY = Math.floor(useGridStore.getState().grid.flat().findIndex(cell=>cell.value==='X') / 8);
        // set new position
        if(prevX!==undefined && prevY!==undefined){
          useGridStore.getState().setCellValue(prevX,prevY,'_');
        }
        useGridStore.getState().setCellValue(x,y,'X');
      };
    },1000); // every second

    return ()=>{
      // cleanup timer on unmount
      clearInterval(interval);
    }
  });

  /*
  const rows = useGridStore((state) => state.rows);
  const cols = useGridStore((state) => state.cols);
  */

  return (
    <>
      <div><h2>Home View</h2><p>Welcome to the home view!</p></div>
      <div>
        <Table.Root variant='surface'>
        <Table.Body className='HomeViewGrid'>
        {/* Map for each row */}
        {grid.flatMap((row, rowIndex) =>(
          <Table.Row className='HomeViewGridRow' columns={row.length} key={rowIndex} >
            {/* Map for each column in the row */}
            {row.map((col, colIndex)=>(
              <Table.Cell className='HomeViewGridCell' colSpan={1} key={colIndex}>
                <Card className='HomeViewGridCellCard'>
                  {col.value}
                </Card>
              </Table.Cell>
            ))}
          </Table.Row>)
        )}
        </Table.Body>
      </Table.Root>
      </div>
    </>
  )
}


function SettingsView(){
  const [buildings, setBuildings] = useState<Entity[]>([]);
  const [drones, setDrones] = useState<Entity[]>([]);
  const [selectedEntityId, setSelectedEntityId] = useState<number | null>(null);
  const [messageText, setMessageText] = useState<string>('');
  const [fromEntityId, setFromEntityId] = useState<number | null>(null);
  const [toEntityId, setToEntityId] = useState<number | null>(null);

  const canvasWrapperRef = useRef<HTMLDivElement | null>(null);
  const [overlayPos, setOverlayPos] = useState<{left:number, top:number} | null>(null);

  // keep lists updated by subscribing to query events and occasional polling for status
  useEffect(()=>{
    // initialize from current world entities
    const initialBuildings = world.entities.filter(e => e.isBuilding);
    const initialDrones = world.entities.filter(e => e.isDrone);
    setBuildings([...initialBuildings]);
    setDrones([...initialDrones]);

    const bAdded = queries.buildings().onEntityAdded.subscribe((b)=> setBuildings(prev => [...prev, b]));
    const bRemoved = queries.buildings().onEntityRemoved.subscribe((b)=> setBuildings(prev => prev.filter(x=>x.id!==b.id)));
    const dAdded = queries.drones().onEntityAdded.subscribe((d)=> setDrones(prev => [...prev, d]));
    const dRemoved = queries.drones().onEntityRemoved.subscribe((d)=> setDrones(prev => prev.filter(x=>x.id!==d.id)));

    // periodic polling to update statuses/positions (200ms)
    const interval = setInterval(()=>{
      try{
        setBuildings([...queries.buildings()]);
        setDrones([...queries.drones()]);
      }catch(e){
        // ignore transient errors
      }
    }, 200);

    return ()=>{
      queries.buildings().onEntityAdded.unsubscribe(bAdded);
      queries.buildings().onEntityRemoved.unsubscribe(bRemoved);
      queries.drones().onEntityAdded.unsubscribe(dAdded);
      queries.drones().onEntityRemoved.unsubscribe(dRemoved);
      clearInterval(interval);
    }
  },[]);

  function handleEntityClick(entity: Entity, screenPos?: {x:number,y:number}){
    setSelectedEntityId(entity.id);
    // prefill from/to dropdowns if possible
    if(entity.isBuilding){
      setToEntityId(entity.id);
    }
    // position overlay near click
    if(canvasWrapperRef.current && screenPos){
      const rect = canvasWrapperRef.current.getBoundingClientRect();
      const left = screenPos.x - rect.left + 8; // small offset
      const top = screenPos.y - rect.top + 8;
      // set CSS vars on wrapper element so we don't have inline styles on the panel
      canvasWrapperRef.current.style.setProperty('--hover-left', `${left}px`);
      canvasWrapperRef.current.style.setProperty('--hover-top', `${top}px`);
      setOverlayPos({left, top});
    } else {
      setOverlayPos(null);
      if(canvasWrapperRef.current){
        canvasWrapperRef.current.style.removeProperty('--hover-left');
        canvasWrapperRef.current.style.removeProperty('--hover-top');
      }
    }
  }

  function setPendingMessage(){
    if(selectedEntityId==null) return;
    const target = getEntityById(selectedEntityId);
    if(!target) return;
    const msg = { text: messageText, createdAt: Date.now(), fromEntityId: fromEntityId ?? undefined, toEntityId: toEntityId ?? undefined } as any;
    // add component to world so systems can pick it up
    try{
      world.addComponent(target, 'MessagePending', msg);
    }catch(e){
      // if addComponent not available, fallback to direct assignment
      (target as any).MessagePending = msg;
    }
    // reflect in local state quickly
    setBuildings(prev => prev.map(b=> b.id===target.id ? {...b, MessagePending: msg} : b));
    setMessageText('');
  }

  // derive left/right buildings and primary drone
  const sortedBuildings = [...buildings].sort((a,b)=> (a.position?.x ?? 0) - (b.position?.x ?? 0));
  const leftBuilding = sortedBuildings[0];
  const rightBuilding = sortedBuildings[sortedBuildings.length-1];
  const primaryDrone = drones[0];

  return (
    <>
      <div><h2>Settings View</h2><p>Adjust your settings here.</p></div>
      <div ref={canvasWrapperRef} className='drone-canvas-wrapper'>
      <Canvas style={{width: '100%', height: '300px', backgroundColor: '#222'}}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <PerspectiveCamera makeDefault position={[0, 0, 8]} />
        <mesh position={[0,2,0]}>
          <tetrahedronGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color='orange' />
        </mesh>
        <DroneDelivery onEntityClick={handleEntityClick} />
        <DroneSystems />
      </Canvas>
      </div>

      {/* Readouts: three columns under the canvas */}
      <div className='drone-readouts'>
        <div className='drone-readout'>
          <h4>Building — Left</h4>
          {leftBuilding ? (
            <div>
              <div>id: {leftBuilding.id}</div>
              <div>pos: {leftBuilding.position ? `${leftBuilding.position.x.toFixed(2)}, ${leftBuilding.position.y.toFixed(2)}, ${leftBuilding.position.z.toFixed(2)}` : 'n/a'}</div>
              <div>loadRadius: {leftBuilding.loadRadius ?? 'n/a'}</div>
              <div>MessagePending: {leftBuilding.MessagePending ? leftBuilding.MessagePending.text : 'none'}</div>
              <div>MessageLog: {leftBuilding.MessageLog ? leftBuilding.MessageLog.length : 0}</div>
            </div>
          ) : <div>—</div>}
        </div>

        <div className='drone-readout'>
          <h4>Drone — Primary</h4>
          {primaryDrone ? (
            <div>
              <div>id: {primaryDrone.id}</div>
              <div>pos: {primaryDrone.position ? `${primaryDrone.position.x.toFixed(2)}, ${primaryDrone.position.y.toFixed(2)}, ${primaryDrone.position.z.toFixed(2)}` : 'n/a'}</div>
              <div>state: {primaryDrone.dronestate}</div>
              <div>targetEntityId: {primaryDrone.targetEntityId ?? 'none'}</div>
              <div>MessageCarrying: {primaryDrone.MessageCarrying ? primaryDrone.MessageCarrying.text : 'none'}</div>
            </div>
          ) : <div>—</div>}
        </div>

        <div className='drone-readout'>
          <h4>Building — Right</h4>
          {rightBuilding && rightBuilding!==leftBuilding ? (
            <div>
              <div>id: {rightBuilding.id}</div>
              <div>pos: {rightBuilding.position ? `${rightBuilding.position.x.toFixed(2)}, ${rightBuilding.position.y.toFixed(2)}, ${rightBuilding.position.z.toFixed(2)}` : 'n/a'}</div>
              <div>loadRadius: {rightBuilding.loadRadius ?? 'n/a'}</div>
              <div>MessagePending: {rightBuilding.MessagePending ? rightBuilding.MessagePending.text : 'none'}</div>
              <div>MessageLog: {rightBuilding.MessageLog ? rightBuilding.MessageLog.length : 0}</div>
            </div>
          ) : <div>—</div>}
        </div>
      </div>

      {/* Hover / click panel */}
      {selectedEntityId !== null && (
        <div className='drone-hover-panel'>
          <h4>Entity {selectedEntityId} — Message Pending Editor</h4>
          <div className='drone-hover-row'>
            <label>From:</label>
            <select aria-label='From entity' value={fromEntityId ?? ''} onChange={(e)=> setFromEntityId(e.target.value?Number(e.target.value):null)}>
              <option value=''>—</option>
              { [...buildings, ...drones].map(ent => {
                const label = `${ent.isBuilding ? 'Building' : 'Drone'} #${ent.id}${ent.position? ` (x:${ent.position.x.toFixed(2)})` : ''}`;
                return (<option key={ent.id} value={ent.id}>{label}</option>);
              })}
            </select>
            <label>To:</label>
            <select aria-label='To entity' value={toEntityId ?? ''} onChange={(e)=> setToEntityId(e.target.value?Number(e.target.value):null)}>
              <option value=''>—</option>
              { [...buildings, ...drones].map(ent => {
                const label = `${ent.isBuilding ? 'Building' : 'Drone'} #${ent.id}${ent.position? ` (x:${ent.position.x.toFixed(2)})` : ''}`;
                return (<option key={ent.id} value={ent.id}>{label}</option>);
              })}
            </select>
            <input className='drone-hover-input' placeholder='Message text' value={messageText} onChange={(e)=> setMessageText(e.target.value)} />
            <Button onClick={setPendingMessage}>Set Pending</Button>
            <Button onClick={()=> setSelectedEntityId(null)}>Close</Button>
          </div>
        </div>
      )}
    </>
  )
}

function ProfileView(){
  return <div><h2>Profile View</h2><p>This is your profile.</p></div>;
}



function ContentArea(props?: React.HTMLProps<HTMLDivElement>) {
  const activeView = useUIStore((state) => state.activeView);

  function handleViewChange(view: "home" | "settings" | "profile") {
    useUIStore.getState().setActiveView(view);
  }

  return (
    <div {...props}>
      <main>
        <h1>Content Area</h1>
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.Cell><p>This is the main content area.</p></Table.Cell>
              <Table.Cell><p>It can contain various elements.</p></Table.Cell>
              <Table.Cell><p>Use the buttons below to switch views.</p></Table.Cell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell><Button onClick={() => handleViewChange("home")}>Home</Button></Table.Cell>
              <Table.Cell><Button onClick={() => handleViewChange("settings")}>Settings</Button></Table.Cell>
              <Table.Cell><Button onClick={() => handleViewChange("profile")}>Profile</Button></Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell colSpan={3}>
                <ScrollArea style={{height:'auto'}}>
                {activeView === "home" && <HomeView />}
                {activeView === "settings" && <SettingsView />}
                {activeView === "profile" && <ProfileView />}
                </ScrollArea>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Root>
      </main>
    </div>
  );
}


export default ContentArea;
