'use client'; // this is a client component 👈🏽

import GraphElement from '@/components/GraphElement';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';

function Home() {
	const searchParams = useSearchParams();

	return (
		<main>
			<GraphElement n={+Array.from(searchParams.values())[0] || 16} />
		</main>
	);
}

export default dynamic(() => Promise.resolve(Home), { ssr: false });
