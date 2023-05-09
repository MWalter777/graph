type AdjacencyNode = {
	[key: string]: { data: string; id: string }[];
};

export function findPath(
	graph: AdjacencyNode,
	startNode: string,
	endNode: string,
	visited: Set<string> = new Set(),
	path: string[] = []
): string[] | null {
	// Add the current node to the visited set and path
	visited.add(startNode);
	path.push(startNode);

	// If the current node is the target node, return the path
	if (startNode === endNode) {
		return path;
	}

	// Otherwise, recursively search for a path to the target node
	for (const neighbor of graph[startNode]) {
		if (!visited.has(neighbor.data)) {
			const result = findPath(graph, neighbor.data, endNode, visited, path);
			if (result) {
				return result;
			}
		}
	}

	// If no path was found, remove the current node from the path and return null
	path.pop();
	return null;
}

export const findRoute = (target: string, adjacencyList: AdjacencyNode) => {
	let values: string[] = [];
	let aux: string[] = [];
	const visited = new Set();
	function dsf(source: string) {
		visited.add(source);
		values.push(source);
		const destinations = adjacencyList[source].map((a) => a.data);
		if (destinations.includes(target)) {
			aux = [...values, target];
			values = [];
			return aux;
		}
		for (const destination of destinations) {
			if (!visited.has(destination)) {
				dsf(destination);
			}
		}
		return [source, ...aux];
	}
	return dsf;
};

export const findRoutes = (
	source: string,
	target: string,
	adjacencyList: { [key: string]: string[] }
) => {
	let visited = new Set([source]);
	let queue: string[] = [source];
	const adj: { [key: string]: string[] } = JSON.parse(
		JSON.stringify(adjacencyList)
	);
	const airports: string[] = [];
	const allRoutes: string[] = [];
	let possibleRoutes: string[][] = [];
	let end = target;
	while (queue.length > 0) {
		const airport: string = queue.shift()!;
		airports.push(airport);
		if (adj[airport].includes(end) && end !== source) {
			allRoutes.push(airport);
			adj[end] = [];
			adj[airport] = [];
			visited = new Set([source]);
			queue = [source];
			possibleRoutes.push(
				Object.entries(adj)
					.filter(([, value]) => value.includes(end))
					.map(([key]) => key)
			);
			end = airport;
		}

		const destinations = adj[airport];
		for (const destination of destinations) {
			if (!visited.has(destination)) {
				visited.add(destination);
				queue.push(destination);
			}
		}
	}
	const routes = allRoutes.length > 0 ? [target, ...allRoutes] : [];
	return { routes, possibleRoutes };
};
