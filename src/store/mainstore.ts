import { useStore } from "@react-three/fiber";




export const useMainstore = useStore();

export const boxes = useMainstore.getState().scene.children.filter(child => child.type === 'Box');

export const circles = useMainstore.getState().scene.children.filter(child => child.type === 'Circle');
