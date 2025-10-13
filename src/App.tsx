import type { ReactElement } from 'react'
import * as React from 'react';
import './App.css'
import { Theme, ThemePanel, Text, Box, Card, Flex, Grid, Container } from "@radix-ui/themes"
import R3FView from './components/r3fview';
import { GlobalProvider } from '@triplex/provider';
import { asChildPropDef } from '@radix-ui/themes/props';






function App(): ReactElement {


  return (
    <GlobalProvider>
    <Theme appearance={'dark'} hasBackground={true} accentColor={'indigo'}>
      <Box className={"windowcontainer"} width="100%" height="100%">
        <Box asChild className={"headercontainer"}>
          <Flex>
            <Grid align="center" columns="3" gap="3" width="100%" style={{placeItems:'center'}}>
              <Card>
                <Box gridColumn="1">
                  1
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
        <Box asChild className="r3fview">
          <R3FView />
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
    </GlobalProvider>
  )
}

export default App
