import type { FunctionComponent } from 'react';

const SectionContainer: FunctionComponent = () => {
	return (
		<div className="w-full relative flex flex-col items-center md:items-start gap-3 text-center md:text-left text-xs text-yellow font-inter">
			<div className="self-stretch relative tracking-[0.05em] font-medium">WHAT CHANGES FOR YOUR CHILD</div>
			<div className="self-stretch flex flex-col items-center md:items-start gap-3 text-2xl md:text-3xl lg:text-[40px] text-white">
				<div className="self-stretch relative">
					<span className="font-semibold">{`Chess Becomes a Tool for Building `}</span>
					<span className="font-fox-marilyn-strokes">Thinking Skills</span>
				</div>
				<div className="self-stretch relative text-sm md:text-base leading-6 text-gray">When learning is structured properly, children naturally develop</div>
			</div>
			<div className="w-full mt-6 md:mt-10 flex justify-center">
				<picture className="w-full max-w-[1000px]">
					<source media="(max-width: 767px)" srcSet="/Benefits-mobile.png" />
					<img
						src="/Benefits.png"
						alt="Benefits of Chess"
						className="w-full h-auto object-contain rounded-xl"
					/>
				</picture>
			</div>
		</div>);
};

export default SectionContainer;
