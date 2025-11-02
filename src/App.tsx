import type { ReactElement } from 'react';
import './App.css';
import { Theme, ThemePanel, Container } from "@radix-ui/themes";
import HeaderBar from './components/headerBar';
import FooterBar from './components/footerBar';
import ContentArea from './components/contentarea';



function App(): ReactElement {


  return (
    <Theme appearance={'dark'} hasBackground={true} accentColor={'indigo'}>
      <Container width="100vw" height="100vh">
        <div className='HeaderBar'>
          <HeaderBar className='HeaderBar'/>
        </div>
        <div className='ContentArea'>
          <ContentArea />
        </div>
        <div>
          <FooterBar className='FooterBar'/>
        </div>
      </Container>
      <ThemePanel defaultOpen={false}/>
    </Theme>
  )
}

export default App
