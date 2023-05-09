import React, { FormEvent } from 'react';

type Props = {
	changeLayout: () => void;
	onSubmit: (e: FormEvent<HTMLFormElement>) => void;
	findNode: (e: FormEvent<HTMLFormElement>) => void;
	onChange: (e: {
		target: {
			value: string;
		};
	}) => void;
	label: string;
	route: {
		routes: string[];
		error: string;
	};
	selectSourceNode: (type: 'source' | 'target') => void;
	showData: () => void;
};

const GraphForm = ({
	changeLayout,
	onSubmit,
	findNode,
	label,
	onChange,
	route,
	selectSourceNode,
	showData,
}: Props) => {
	return (
		<div className='w-full flex gap-4 justify-between'>
			<div className='w-6/12 flex flex-col mt-4 gap-4 bg-white p-4 rounded-xl shadow-border'>
				<form onSubmit={onSubmit} className='flex gap-4 justify-between'>
					<input
						type='text'
						placeholder='name'
						name='name'
						autoComplete='off'
						id='name'
						className='outline-none border-b border-gray-700 px-2 w-full bg-transparent'
						onChange={onChange}
						value={label}
					/>
					<button
						className='bg-gray-500 px-5 w-[200px] py-1 rounded text-white font-semibold outline-none hover:bg-gray-600'
						type='submit'
					>
						Add node
					</button>
				</form>
				<button
					className='bg-gray-500 px-4 py-1 rounded text-white font-semibold outline-none hover:bg-gray-600'
					onClick={changeLayout}
				>
					Change layout
				</button>
			</div>
			<div className='w-6/12 flex flex-col mt-4 gap-4 bg-white p-4 rounded-xl shadow-border'>
				<div className='flex flex-col gap-2'>
					<span className='text-red-700'>{route.error}</span>
					<form onSubmit={findNode} className='flex gap-2'>
						<button
							type='button'
							className='bg-gray-500 px-4 py-1 rounded text-white font-semibold outline-none hover:bg-gray-600'
							onClick={() => selectSourceNode('source')}
						>
							Select source node
						</button>
						<button
							type='button'
							className='bg-gray-500 px-4 py-1 rounded text-white font-semibold outline-none hover:bg-gray-600'
							onClick={() => selectSourceNode('target')}
						>
							Select target node
						</button>
						<button
							className='bg-gray-500 px-4 py-1 rounded text-white font-semibold outline-none hover:bg-gray-600'
							type='submit'
						>
							find node
						</button>
					</form>
				</div>
				<div className='flex flex-col gap-2'>
					<button
						className='bg-gray-500 px-4 py-1 rounded text-white font-semibold outline-none hover:bg-gray-600'
						onClick={showData}
					>
						Show data
					</button>
				</div>
			</div>
		</div>
	);
};

export default GraphForm;
