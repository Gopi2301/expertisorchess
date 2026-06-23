import type { FunctionComponent } from 'react';

const LearningPathSection: FunctionComponent = () => {
	return (
		<div className="w-full relative flex flex-col items-start py-0 px-4 md:px-[88px] box-border gap-8 md:gap-16 text-left text-[12px] text-yellow font-inter">
			<div className="w-full max-w-[1264px] flex items-end justify-between relative isolate gap-4">
				<div className="flex-1 flex flex-col items-start gap-3 z-[0] shrink-0">
					<div className="self-stretch relative tracking-[0.05em] font-medium">THE LEARNING PATH</div>
					<div className="self-stretch flex flex-col items-start text-2xl md:text-3xl lg:text-[40px] text-white">
						<div className="w-full max-w-[675px] relative leading-tight md:leading-[56px] inline-block">
							<span className="font-semibold">{`Every Student Follows a `}</span>
							<span className="font-fox-marilyn-strokes">Structured Journey</span>
						</div>
					</div>
				</div>
				<div className="flex items-center gap-2 z-[1] shrink-0">
					<img className="h-8 w-8 md:h-10 md:w-10 relative object-cover cursor-pointer" src='/buttonLeft.svg' alt="" />
					<img className="h-8 w-8 md:h-10 md:w-10 relative object-cover cursor-pointer" src='/buttonRight.svg' alt="" />
				</div>
				<img className="h-40 w-40 absolute !m-0 top-[-18px] right-0 object-cover z-[2] shrink-0 hidden lg:block" src='character.png' alt="" />
			</div>
			<div className="self-stretch min-h-[300px] overflow-x-auto shrink-0 flex items-start gap-5 text-xl md:text-[24px] text-white pb-4 scrollbar-thin">
				<div className="self-stretch w-[280px] md:w-[301px] bg-[#171717] overflow-hidden shrink-0 flex flex-col items-center p-6 box-border relative isolate gap-2 min-h-[280px]">
					<div className="self-stretch relative font-semibold z-[0] shrink-0">Assessment</div>
					<div className="self-stretch relative text-sm md:text-base leading-6 text-gray-100 z-[1] shrink-0">We understand the child’s current level.</div>
					<div className="w-[230px] h-[242px] absolute !m-0 top-[99px] left-[19px] text-[200px] font-semibold text-transparent !bg-clip-text [background:linear-gradient(180deg,_#fff,_#000)] [-webkit-background-clip:text] [-webkit-text-fill-color:transparent] inline-block opacity-[0.1] z-[2] shrink-0 pointer-events-none">01</div>
				</div>
				<div className="self-stretch w-[280px] md:w-[301px] bg-[#171717] overflow-hidden shrink-0 flex flex-col items-center p-6 box-border relative isolate gap-2 min-h-[280px]">
					<div className="self-stretch relative font-semibold z-[0] shrink-0">Placement</div>
					<div className="self-stretch relative text-sm md:text-base leading-6 text-gray-100 z-[1] shrink-0">Students are grouped based on ability and learning pace.</div>
					<div className="w-[258px] h-[242px] absolute !m-0 top-[99px] left-[19px] text-[200px] font-semibold text-transparent !bg-clip-text [background:linear-gradient(180deg,_#fff,_#000)] [-webkit-background-clip:text] [-webkit-text-fill-color:transparent] inline-block opacity-[0.1] z-[2] shrink-0 pointer-events-none">02</div>
				</div>
				<div className="self-stretch w-[280px] md:w-[301px] bg-[#171717] overflow-hidden shrink-0 flex flex-col items-center p-6 box-border relative isolate gap-2 min-h-[280px]">
					<div className="self-stretch relative font-semibold z-[0] shrink-0">Guided Learning</div>
					<div className="self-stretch relative text-sm md:text-base leading-6 text-gray-100 z-[1] shrink-0">Live classes + structured curriculum.</div>
					<div className="w-[264px] h-[242px] absolute !m-0 top-[99px] left-[19px] text-[200px] font-semibold text-transparent !bg-clip-text [background:linear-gradient(180deg,_#fff,_#000)] [-webkit-background-clip:text] [-webkit-text-fill-color:transparent] inline-block opacity-[0.1] z-[2] shrink-0 pointer-events-none">03</div>
				</div>
				<div className="self-stretch w-[280px] md:w-[301px] bg-[#171717] overflow-hidden shrink-0 flex flex-col items-center p-6 box-border relative isolate gap-2 min-h-[280px]">
					<div className="self-stretch relative font-semibold z-[0] shrink-0">Reinforcement</div>
					<div className="self-stretch relative text-sm md:text-base leading-6 text-gray-100 z-[1] shrink-0">AI practice + recorded lessons + assignments.</div>
					<div className="w-[267px] h-[242px] absolute !m-0 top-[99px] left-[19px] text-[200px] font-semibold text-transparent !bg-clip-text [background:linear-gradient(180deg,_#fff,_#000)] [-webkit-background-clip:text] [-webkit-text-fill-color:transparent] inline-block opacity-[0.1] z-[2] shrink-0 pointer-events-none">04</div>
				</div>
				<div className="self-stretch w-[280px] md:w-[301px] bg-[#171717] overflow-hidden shrink-0 flex flex-col items-center p-6 box-border relative isolate gap-2 min-h-[280px]">
					<div className="self-stretch relative font-semibold z-[0] shrink-0">Application</div>
					<div className="self-stretch relative text-sm md:text-base leading-6 text-gray-100 z-[1] shrink-0">Tournaments and competitive play.</div>
					<div className="w-[260px] h-[242px] absolute !m-0 top-[99px] left-[19px] text-[200px] font-semibold text-transparent !bg-clip-text [background:linear-gradient(180deg,_#fff,_#000)] [-webkit-background-clip:text] [-webkit-text-fill-color:transparent] inline-block opacity-[0.1] z-[2] shrink-0 pointer-events-none">05</div>
				</div>
				<div className="self-stretch w-[280px] md:w-[301px] bg-[#171717] overflow-hidden shrink-0 flex flex-col items-center p-6 box-border relative isolate gap-2 min-h-[280px]">
					<div className="self-stretch relative font-semibold z-[0] shrink-0">Tracking</div>
					<div className="self-stretch relative text-sm md:text-base leading-6 text-gray-100 z-[1] shrink-0">Monthly progress reports ensure continuous improvement.</div>
					<div className="w-[264px] h-[242px] absolute !m-0 top-[99px] left-[19px] text-[200px] font-semibold text-transparent !bg-clip-text [background:linear-gradient(180deg,_#fff,_#000)] [-webkit-background-clip:text] [-webkit-text-fill-color:transparent] inline-block opacity-[0.1] z-[2] shrink-0 pointer-events-none">06</div>
				</div>
			</div>
			<div className="[background:linear-gradient(90deg,_#fff200,_#fff87b)_padding-box,_linear-gradient(0deg,_#000,_#fff)_border-box] [border:1px_solid_transparent] flex items-center justify-center py-3 px-8 text-base text-black cursor-pointer transition-transform hover:scale-105 active:scale-95">
				<div className="relative leading-6 font-semibold">Start Learning Now</div>
			</div>
		</div>);
};

export default LearningPathSection;
