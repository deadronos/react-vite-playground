import { type ReactNode } from 'react';

interface GlobalProviderProps {
  children: ReactNode;
}

export function GlobalProvider({ children }: GlobalProviderProps) {
  return <>{children}</>;
}

export function CanvasProvider({ children }: { children?: React.ReactNode }) {
  return children
}

/* Configure the environment as needed. Here we set up Rapier physics.
import { Physics } from "@react-three/rapier";

export function CanvasProvider({
  children,
}: {
  children?: React.ReactNode;
}) {
  return <Physics>{children}</Physics>;
}

*/
