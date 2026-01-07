import { useState, type ReactElement } from 'react';
import './App.css';
import { Theme, Box } from "@radix-ui/themes";
import { Canvas } from '@react-three/fiber';
import { AppLayout } from './components/layout/AppLayout';
import CustomHooksExample from './components/examples/CustomHooks';
import ContextAPIExample from './components/examples/ContextAPI';
import CompoundComponentsExample from './components/examples/CompoundComponents';
import StateManagementExample from './components/examples/StateManagement';
import MainScene from './components/examples/ThreeJSScene';

function App(): ReactElement {
  const [activeExample, setActiveExample] = useState('custom-hooks');

  const renderContent = () => {
    switch (activeExample) {
      case 'custom-hooks':
        return <CustomHooksExample />;
      case 'context-api':
        return <ContextAPIExample />;
      case 'compound-components':
        return <CompoundComponentsExample />;
      case 'state-management':
        return <StateManagementExample />;
      case 'threejs-scene':
        return (
          <Box style={{ width: '100%', height: '100%', position: 'relative' }}>
              <MainScene />
          </Box>
        );
      default:
        return <div>Select an example</div>;
    }
  };

  return (
    <Theme appearance={'dark'} hasBackground={true} accentColor={'indigo'}>
      <AppLayout activeExample={activeExample} onSelectExample={setActiveExample}>
        {renderContent()}
      </AppLayout>
      {/* <ThemePanel defaultOpen={false}/> */}
    </Theme>
  )
}

export default App;
