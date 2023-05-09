'use client'; // this is a client component 👈🏽

import GraphElement from '@/components/GraphElement';
import dynamic from 'next/dynamic';

function Home() {
	return (
		<main>
			<GraphElement />
		</main>
	);
}

export default dynamic(() => Promise.resolve(Home), { ssr: false });
