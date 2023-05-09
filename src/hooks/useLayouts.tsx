import { useState, useRef, useEffect } from 'react';
import { ElementDefinition, Stylesheet } from 'cytoscape';
import { randomColor } from '@/helper/randomColor';
import { generateGraph, randInt } from '@/helper/generateGraph';
import { layouts } from '@/components/layouts';

function getDefaultStylesheet(): Stylesheet[] {
	const nodeColor = randomColor();
	const edgeColor = randomColor();
	return [
		{
			selector: 'node',
			style: {
				label: 'data(label)',
				'text-justification': 'center',
				shape: 'ellipse',
				'border-width': 2,
				'border-color': nodeColor,
				'border-style': 'dotted',
				backgroundColor: nodeColor,
			},
		},
		{
			selector: 'edge',
			style: {
				width: 3,
				'line-color': edgeColor,
				'target-arrow-color': edgeColor,
				'target-arrow-shape': 'triangle-backcurve', //'triangle',
				'curve-style': 'bezier',
				'line-style': 'solid',
				'overlay-color': '#029dee',
			},
		},
		{
			selector: 'label',
			style: {
				color: 'white',
				'font-size': 9,
				'border-width': 2,
				'border-color': 'black',
				'text-justification': 'center',
				'text-halign': 'center',
				'text-valign': 'center',
			},
		},
		{
			selector: ':active',
			style: {
				backgroundColor: '#5502ee',
				'line-color': '#5502ee',
				'target-arrow-color': '#5502ee',
			},
		},
		{
			selector: ':selected',
			style: {
				backgroundColor: '#5502ee',
				'line-color': '#5502ee',
				'target-arrow-color': '#5502ee',
			},
		},
	];
}

export const useLayouts = (nodes = 32) => {
	const cyRef = useRef<cytoscape.Core | undefined>();
	const [elements, setElements] = useState(() => generateGraph(nodes));
	const [layout, setLayout] = useState(layouts.klay);
	const [stylesheet, setStylesheet] =
		useState<Stylesheet[]>(getDefaultStylesheet);

	useEffect(() => {
		if (!cyRef.current) return;
		cyRef.current.boxSelectionEnabled(true);
		cyRef.current.selectionType('additive');
		cyRef.current.userZoomingEnabled(false);
	}, []);

	const changeLayout = () => {
		const keys = Object.keys(layouts);
		setLayout(layouts[keys[Math.floor(Math.random() * keys.length)]]);
	};

	const addNode = ({ label }: { label?: string }) => {
		if (!cyRef.current) return;
		const elements = cyRef.current.elements();
		const id = `Node-${elements.length}`;
		const selected = elements.filter((e) => e.selected());
		const { x, y } = selected.reduce(
			(acc, e: any) => {
				const { x, y } = e.position();
				return {
					x: acc.x + x,
					y: acc.y + y,
				};
			},
			{ x: randInt(0, 200), y: 100 }
		);

		const selectedNumbers = selected.length || 1;

		const nodes: ElementDefinition = {
			data: { id, label },
			position: {
				x: Math.floor(x / selectedNumbers),
				y: Math.floor(y / selectedNumbers),
			},
		};

		const edges = selected.map((e) => ({
			data: { source: id, target: e.id() },
		}));
		const edgesReverse = selected.map((e) => ({
			data: { target: id, source: e.id() },
		}));
		cyRef.current.add([nodes, ...edges, ...edgesReverse]);
	};

	return {
		elements,
		layout,
		stylesheet,
		cyRef,
		changeLayout,
		addNode,
	};
};
