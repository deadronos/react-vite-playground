import type { ReactElement } from 'react'
import "globals.css"
import './App.css'
import { Theme } from "@radix-ui/themes"
import { ReactViteTemplate } from './components/template'




function App(): ReactElement {
  

  return (
    <Theme>
        <ReactViteTemplate />
    </Theme>
  )
}

export default App
