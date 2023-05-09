import { ElementDefinition } from 'cytoscape';

export function randInt(min: number, max: number): number {
	return min + Math.floor(Math.random() * (max - min));
}

export function generateGraph(n = 8, m = n * 2, acyclic = false) {
	const ids = Array.from({ length: n }, (_, i) => `Node-${i}`);

	const nodes: ElementDefinition[] = ids.map((id) => ({
		data: { id, label: id },
	}));

	const edges: ElementDefinition[] = Array.from({ length: m }, () => {
		const idIndex1 = randInt(0, ids.length);
		const id1 = ids[idIndex1];
		const id2 = ids[randInt(acyclic ? idIndex1 + 1 : 0, ids.length)];
		return {
			data: { source: id1, target: id2 },
		};
	});

	return [...nodes, ...edges];
}
