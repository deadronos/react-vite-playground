// Lightweight helpers for interacting with the react-three-fiber internal store.
// The previous implementation called a hook at module top-level which is invalid
// and caused runtime/type errors. Keep these helpers pure so they can be used
// from components that have access to the R3F store.

export function getSceneChildren(store: any) {
	return store.getState().scene?.children || [];
}

export function getBoxes(store: any) {
	return getSceneChildren(store).filter((child: any) => child.type === 'Box');
}

export function getCircles(store: any) {
	return getSceneChildren(store).filter((child: any) => child.type === 'Circle');
}
