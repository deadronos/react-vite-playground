import { useRef, type ReactElement } from 'react';
import './App.css';
import { Theme, ThemePanel, Box, Card, Flex, Grid, Link } from "@radix-ui/themes";
import { GlobalProvider } from '@triplex/provider';
import MainScene from './components/mainscene';
import { Canvas } from '@react-three/fiber';






function App(): ReactElement {

  const container =  useRef();

  return (
    <GlobalProvider>
    <main className="app-container" ref={container}>
    <Theme appearance={'dark'} hasBackground={true} accentColor={'indigo'}>
      <Box className={"windowcontainer"} width="100%" height="100%">
        <Box asChild className={"headercontainer"}>
          <Flex>
            <Grid align="center" columns="3" gap="3" width="100%" style={{placeItems:'center'}}>
              <Card>
                <Box gridColumn="1">
                  <Link>
                    1
                  </Link>
                </Box>
              </Card>
              <Card>
                <Box gridColumn="2">
                  Deadronos Collection
                </Box>
              </Card>
              <Card>
                <Box gridColumn="3">
                  3
                </Box>
              </Card>
            </Grid>
          </Flex>
        </Box>
        <Box asChild className="main-scene-container">
           <Canvas>
              <MainScene />
          </Canvas>
        </Box>
        <Box asChild className="footercontainer">
          <Grid align="center" columns="3" gap="3" width="100%" style={{placeItems:'center'}}>
            <Card>
              <Box gridColumn="1">
                1
              </Box>
            </Card>
            <Card>
              <Box gridColumn="2">
                2
              </Box>
            </Card>
            <Card>
              <Box gridColumn="3">
                3
              </Box>
            </Card>
          </Grid>
        </Box>
      </Box>
      <ThemePanel defaultOpen={false}/>
    </Theme>
    </main>
    </GlobalProvider>
  )
}

export default App
