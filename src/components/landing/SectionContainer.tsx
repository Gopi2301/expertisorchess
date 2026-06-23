import type { FunctionComponent } from 'react';



const SectionContainer: FunctionComponent = () => {
	return (
		<div className="w-full relative flex flex-col items-start gap-3 text-center text-xs text-yellow font-inter">
			<div className="self-stretch relative tracking-[0.05em] font-medium">WHAT CHANGES FOR YOUR CHILD</div>
			<div className="self-stretch flex flex-col items-start gap-3 text-[40px] text-white">
				<div className="self-stretch relative">
					<span className="font-semibold">{`Chess Becomes a Tool for Building `}</span>
					<span className="font-fox-marilyn-strokes">Thinking Skills</span>
				</div>
				<div className="self-stretch relative text-base leading-6 text-gray">When learning is structured properly, children naturally develops</div>
			</div>
			<div className="w-full mt-10 flex justify-center">
				<img
					src="/Benefits.png"
					alt="Benefits of Chess"
					className="w-full max-w-[1000px] h-auto object-contain rounded-xl"
				/>
			</div>
		</div>);
};

export default SectionContainer;
