import { useUIStore } from '@/store/uistore';
import React, { useEffect, type ReactElement } from 'react';
import { Button, Table, Card, ScrollArea } from '@radix-ui/themes';
import { useGridStore } from '@/store/gridStore';
import './contentarea.css';


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
  return <div><h2>Settings View</h2><p>Here you can change your settings.</p></div>;
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
