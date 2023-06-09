import { useState, FormEvent } from 'react';
import setupCy from '@/helper/setupCy';
import CytoscapeComponent from 'react-cytoscapejs';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { findPath } from '@/helper/graph';
import { useLayouts } from '@/hooks/useLayouts';
import GraphForm from './GraphForm';
import { Core } from 'cytoscape';

setupCy();

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
	return (
		<div role='alert'>
			<p>Something went wrong:</p>
			<pre>{error.message}</pre>
			<button onClick={resetErrorBoundary}>Try again</button>
		</div>
	);
}

type Elements = {
	nodes: {
		data: {
			id: string;
			label: string;
		};
	}[];
	edges: {
		data: {
			source: string;
			target: string;
			id: string;
		};
	}[];
};

type Props = {
	n: number;
};

const GraphElement = ({ n }: Props) => {
	const [label, setLabel] = useState('');
	const [data, setData] = useState<any>({});
	const [route, setRoute] = useState<{
		routes: string[];
		error: string;
	}>({
		error: '',
		routes: [],
	});
	const [selected, setSelected] = useState({ source: '', target: '' });
	const { elements, layout, stylesheet, cyRef, changeLayout, addNode } =
		useLayouts(n);
	const onChange = (e: { target: { value: string } }) => {
		setLabel(e.target.value);
	};

	const onSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!label) return;
		addNode({ label });
		setLabel('');
	};

	const createNodes = (nodes: { id: string }[]) => {
		const ad = nodes.reduce((acc, e) => {
			return {
				...acc,
				[e.id]: [],
			};
		}, {});
		return ad;
	};

	const addEdge = (
		nodes: { [key: string]: string[] },
		edge: { source: string; target: string; id: string }
	) => {
		const sources = [...nodes[edge.source], { data: edge.target, id: edge.id }];
		return {
			...nodes,
			[edge.source]: sources,
		};
	};

	const getCleanNodes = () => {
		if (!cyRef.current) return { cleanNodes: [], cleanEdges: [], adj: {} };
		const {
			elements: { edges, nodes },
		} = cyRef.current.json() as { elements: Elements };
		const cleanNodes = nodes.map((n) => ({
			id: n.data.id,
			label: n.data.label,
		}));
		const cleanEdges = edges.map((e) => ({
			id: e.data.id,
			source: e.data.source,
			target: e.data.target,
		}));
		const keys = createNodes(cleanNodes);
		const adj = cleanEdges.reduce(addEdge, keys);
		return { cleanNodes, cleanEdges, adj };
	};

	const showData = () => {
		const { cleanNodes, cleanEdges, adj } = getCleanNodes();
		navigator.clipboard.writeText(
			JSON.stringify({
				adjacency: adj,
				nodes: cleanNodes,
				edges: cleanEdges,
			})
		);
		setData({
			adjacency: adj,
			nodes: cleanNodes,
			edges: cleanEdges,
		});
	};

	const selectSourceNode = (type: 'source' | 'target') => {
		if (!cyRef.current) return;
		const elements = cyRef.current.elements();
		const selectedNode = elements.filter((e) => e.selected());
		if (selectedNode.length !== 1) return;
		setSelected({
			...selected,
			[type]: selectedNode[0].id(),
		});
		selectedNode[0].unselect();
	};

	const findNode = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!cyRef.current) return;
		const elements = cyRef.current.elements();
		if (!selected.source || !selected.target) return;
		const { adj } = getCleanNodes();

		const routes = findPath(adj, selected.source, selected.target);
		if (!routes) {
			setRoute({
				routes: [],
				error: 'No routes found',
			});
			return;
		}
		let [first, ...res] = routes;
		const selectedEdges = res.flatMap((r) => {
			const d: { data: string; id: string }[] = adj[first as keyof typeof adj];
			first = r;
			const element = d.find((e) => e.data === first);
			return element?.id || [];
		});

		const selectedNodes = elements.filter(
			(e) => routes.includes(e.id()) || selectedEdges.includes(e.id())
		);
		selectedNodes.forEach((n) => {
			n.select();
		});

		selectedNodes.forEach((n) => {
			n.select();
		});
		setSelected({ source: '', target: '' });
		setRoute({
			routes,
			error: routes.length === 0 ? 'No routes found' : '',
		});
	};

	return (
		<div className='flex flex-col px-4 gap-2'>
			<GraphForm
				changeLayout={changeLayout}
				label={label}
				onChange={onChange}
				onSubmit={onSubmit}
				findNode={findNode}
				route={route}
				selectSourceNode={selectSourceNode}
				showData={showData}
			/>
			<ErrorBoundary FallbackComponent={ErrorFallback}>
				<div className='flex justify-center border p-4'>
					<CytoscapeComponent
						elements={elements}
						style={{
							width: '100%',
							minHeight: '500px',
						}}
						layout={layout}
						stylesheet={stylesheet}
						cy={(cy: Core | undefined) => (cyRef.current = cy)}
					/>
				</div>
			</ErrorBoundary>
			<pre>{JSON.stringify(data, null, 2)}</pre>
		</div>
	);
};

export default GraphElement;
