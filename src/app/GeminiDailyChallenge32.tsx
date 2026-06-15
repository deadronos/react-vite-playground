/*

🚀 Day 32: Axis-Aligned Bounding Box (AABB) Collision DetectionLet's expand your
  work with coordinate systems from 2D grids into a 3D geometry environment.
  This pattern is foundational for voxel engines, spaceship combat tracking, raycasters,
  and basic physics engines.When checking if two complex shapes in a 3D environment collide,
  evaluating every polygon or vertex is incredibly expensive. Instead, engines wrap objects in an
  invisible, non-rotated box called an Axis-Aligned Bounding Box (AABB).
  If these simple bounding boxes don't overlap, the engine can instantly skip the expensive calculations.
  The MissionWrite a pure utility function that takes two separate 3D bounding boxes—representing a Player Voxel Ship and an Incoming Asteroid Core—and calculates whether they are overlapping in space (true) or completely clear of each other (false).📋 RequirementsThe 3D Coordinate Typings: Each box is defined by its absolute lowest minimum corner and its absolute highest maximum corner across all three axes ($X$, $Y$, $Z$):TypeScriptinterface BoundingBox3D {
  minX: number; maxX: number;
  minY: number; maxY: number;
  minZ: number; maxZ: number;
}
The Test Datasets: Set up these two mock geometries inside your sandbox:TypeScriptconst playerBox: BoundingBox3D = { minX: 0, maxX: 2, minY: 0, maxY: 2, minZ: 0, maxZ: 2 };

// This mock asteroid overlaps the player on X and Y, but sits completely clear on Z!
const asteroidBox: BoundingBox3D = { minX: 1, maxX: 3, minY: 1, maxY: 3, minZ: 4, maxZ: 6 };
The Core Logic Check (The Real Challenge): Write a pure function called checkAABBCollision(boxA: BoundingBox3D, boxB: BoundingBox3D): boolean.It must only return true if the boxes overlap on all three dimensions simultaneously.Tip: The easiest way to write this math is to figure out when they are not touching, and invert it. For example, if boxA.maxX < boxB.minX or boxA.minX > boxB.maxX, they don't overlap on the X axis, meaning a full 3D collision is impossible!💡 Hints to Get You StartedThe Inversion Recipe: Check if any of the separating planes exist. If any single one of these 6 conditions is true, they do not collide:boxA.maxX < boxB.minX or boxA.minX > boxB.maxX (Clear on X)boxA.maxY < boxB.minY or boxA.minY > boxB.maxY (Clear on Y)boxA.maxZ < boxB.minZ or boxA.minZ > boxB.maxZ (Clear on Z)The Render Layer: Build a simple UI dashboard display. Add a few quick buttons that let you offset the asteroid's minZ and maxZ values (e.g., shifting it to minZ: 1, maxZ: 3) to move it forward so it collides with the player, changing a status indicator component from a green "🛡️ SECURE VECTOR" to a bright red "💥 IMPACT DETECTED".Set up your 3D spatial properties, wire up your dimension intersection gates, and drop your solution whenever you're ready!

*/


import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Box } from '@react-three/drei';
import { OrbitControls } from '@react-three/drei';


const style = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100vh",
  backgroundColor: "black",
  fontFamily: "Arial, sans-serif",
};

const CanvasStyle = {
  width: "600px",
  height: "400px",
  border: "1px solid #ccc",
  backgroundColor: "black",
};

export default function GeminiDailyChallenge32() {

  return (
    <div style={style}>
      <h1>Day 32: Axis-Aligned Bounding Box (AABB) Collision Detection</h1>
      <p>Check the console for collision detection results.</p>
      <DemoDisplay />
    </div>
  );
}


type BoundingBox3D = {
  minX: number; maxX: number;
  minY: number; maxY: number;
  minZ: number; maxZ: number;
};

const playerBoxInitial: BoundingBox3D = { minX: 0, maxX: 2, minY: 0, maxY: 2, minZ: 0, maxZ: 2 };
const asteroidBoxInitial: BoundingBox3D = { minX: 1, maxX: 3, minY: 1, maxY: 3, minZ: 4, maxZ: 6 };


function ClearOnX(boxA: BoundingBox3D, boxB: BoundingBox3D): boolean {
  return boxA.maxX < boxB.minX || boxA.minX > boxB.maxX;
}

function ClearOnY(boxA: BoundingBox3D, boxB: BoundingBox3D): boolean {
  return boxA.maxY < boxB.minY || boxA.minY > boxB.maxY;
}

function ClearOnZ(boxA: BoundingBox3D, boxB: BoundingBox3D): boolean {
  return boxA.maxZ < boxB.minZ || boxA.minZ > boxB.maxZ;
}

function checkAABBCollision(boxA: BoundingBox3D, boxB: BoundingBox3D): boolean {
  return !(ClearOnX(boxA, boxB) || ClearOnY(boxA, boxB) || ClearOnZ(boxA, boxB));
}

function checkCollisionStatus(playerBox: BoundingBox3D, asteroidBox: BoundingBox3D): string {
  return checkAABBCollision(playerBox, asteroidBox) ? "💥 IMPACT DETECTED" : "🛡️ SECURE VECTOR";
}


function DemoDisplay() {
  const [playerBox, setPlayerBox]= useState(playerBoxInitial);
  const [asteroidBox, setAsteroidBox] = useState(asteroidBoxInitial);

  return (
    <div style={CanvasStyle}>
      <Canvas>
        <OrbitControls />
        <ambientLight intensity={0.5} />
        <PlayerBox box={playerBox} />
        <AsteroidBox box={asteroidBox} />
      </Canvas>
      <div style={{ marginTop: "20px", color: "white", fontSize: "24px" }}>
        {checkCollisionStatus(playerBox, asteroidBox)}
      </div>
      <div style={{ marginTop: "10px" }}>
        <button onClick={() => setAsteroidBox({ ...asteroidBox, minZ: 1, maxZ: 3 })} style={{ marginRight: "10px" }}>
          Move Asteroid Forward (Collide)
        </button>
        <button onClick={() => setAsteroidBox(asteroidBoxInitial)}>
          Reset Asteroid Position
        </button>
      </div>
    </div>
  )
}

interface PlayerBoxProps {
  box: BoundingBox3D;
}

function PlayerBox({ box }: PlayerBoxProps) {
  const width = box.maxX - box.minX;
  const height = box.maxY - box.minY;
  const depth = box.maxZ - box.minZ;
  const position = [
    (box.minX + box.maxX) / 2,
    (box.minY + box.maxY) / 2,
    (box.minZ + box.maxZ) / 2
  ];

  return (
    <Box args={[width, height, depth]} position={position}>
      <meshStandardMaterial color="blue" />
    </Box>
  );
}

interface AsteroidBoxProps {
  box: BoundingBox3D;
}

function AsteroidBox({ box }: AsteroidBoxProps) {
  const width = box.maxX - box.minX;
  const height = box.maxY - box.minY;
  const depth = box.maxZ - box.minZ;
  const position = [
    (box.minX + box.maxX) / 2,
    (box.minY + box.maxY) / 2,
    (box.minZ + box.maxZ) / 2
  ];

  return (
    <Box args={[width, height, depth]} position={position}>
      <meshStandardMaterial color="red" />
    </Box>
  );
}
