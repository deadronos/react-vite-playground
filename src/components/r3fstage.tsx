
import { Application } from "r3f-stage"

/* r3f-stage provides a global stylesheet. Please import it in your application and remove any other global styles you may have defined. */
import "r3f-stage/styles.css"




function R3FStage() {
  
  return (
    <Application>
      <mesh>
        <dodecahedronGeometry />
        <meshStandardMaterial />
      </mesh>
    </Application>
  )
}

export default R3FStage;