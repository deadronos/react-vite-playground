import type { ReactElement } from 'react'
import * as React from 'react';
import './App.css'
import { Theme } from "@radix-ui/themes"
import R3FStage from './components/r3fview'
import ErrorBoundary from './components/ErrorBoundary'




function App(): ReactElement {
  

  return (
    <Theme>
      <Box style={{ background: "var(--gray-a2)", borderRadius: "var(--radius-3)" }}>
	<Container size="1">
		<DecorativeBox>
			<Box py="9" />
		</DecorativeBox>
	</Container>
</Box><
      {/*
        The r3f/react-three tree can throw runtime errors (for example
        when WebGL is unavailable or a component throws during render).
        Wrap it with an ErrorBoundary so we can show a friendly fallback
        and avoid unmounting the entire app. See:
        https://react.dev/link/error-boundaries
      */}
      <ErrorBoundary>
        <R3FView />
      </ErrorBoundary>
    </Theme>
  )
}

export default App
