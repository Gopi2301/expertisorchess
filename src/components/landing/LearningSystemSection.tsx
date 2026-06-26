import type { FunctionComponent } from 'react';
import { Card } from '@/components/ui/Card';

const LearningSystemSection: FunctionComponent = () => {
	return (
		<div className="w-full relative flex flex-col items-center py-0 px-4 md:px-[88px] box-border gap-8 md:gap-16 text-left text-[12px] text-yellow font-inter">
			<div className="self-stretch flex flex-col md:flex-row items-center justify-between gap-5 max-w-[1264px] w-full">
				<div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left gap-3 max-w-[700px]">
					<div className="self-stretch relative tracking-[0.05em] font-medium">THE LEARNING SYSTEM</div>
					<div className="self-stretch flex flex-col items-center md:items-start gap-3 text-2xl md:text-3xl lg:text-[40px] text-white">
						<div className="self-stretch relative">
							<span className="font-semibold">{`A Complete `}</span>
							<span className="font-fox-marilyn-strokes">Learning Ecosystem</span>
							<span className="font-semibold">, Not Just Classes</span>
						</div>
						<div className="relative text-sm md:text-num-16 leading-num-24 text-gray-100">Most academies stop at teaching. We continue the learning process beyond the classroom.</div>
					</div>
				</div>
				<div className="h-[120px] md:h-[171px] w-48 relative hidden sm:block">
					<img className="absolute top-[9px] left-[-38px] w-[140px] md:w-[188.5px] h-[140px] md:h-[188.5px] object-contain shrink-0" src='/Sticker (1).png' alt="" />
					<img className="absolute top-[-17px] left-[61px] w-[130px] md:w-[171.2px] h-[130px] md:h-[171.2px] object-contain shrink-0" src="/Sticker.png" alt="" />
				</div>
			</div>
			<div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-w-[1264px] text-xl md:text-[24px] text-white justify-center">
				{/* Card 1: Live Expert Coaching */}
				<Card className="rounded-none bg-[#0D0D0D] border-[#484848] border-solid border-[1px] overflow-hidden flex flex-col items-center py-0 relative isolate gap-3 w-full">
					<div className='flex flex-col gap-2 p-6 w-full'>
						<div className="self-stretch relative font-semibold text-white z-[0] shrink-0">Live Expert Coaching</div>
						<div className="self-stretch relative text-sm md:text-num-16 leading-num-24 text-gray-100 z-[1] shrink-0">Most academies stop at teaching. We continue the learning process beyond the classroom.</div>
					</div>
					<img className="mt-auto w-full object-contain" src="/card1.png" alt="" />
				</Card>

				{/* Card 2: Recorded Lessons */}
				<Card className="rounded-none bg-[#0D0D0D] border-[#484848] border-solid border-[1px] overflow-hidden flex flex-col items-center py-0 relative isolate gap-3 w-full">
					<div className='flex flex-col gap-2 p-6 w-full'>
						<div className="self-stretch relative font-semibold z-[0] shrink-0">Recorded Lessons</div>
						<div className="self-stretch relative text-sm md:text-num-16 leading-num-24 text-gray-100 z-[1] shrink-0">Never miss progress. Every session is available for revision.</div>
					</div>
					<img className="mt-auto w-full object-contain" src="/card2.png" alt="" />
				</Card>

				{/* Card 3: AI Powered Practice Support */}
				<Card className="rounded-none bg-[#0D0D0D] border-[#484848] border-solid border-[1px] overflow-hidden flex flex-col items-center py-0 relative isolate gap-3 w-full lg:row-span-2 min-h-[450px]">
					<div className='flex flex-col gap-2 p-6 z-10 w-full'>
						<div className="self-stretch relative font-semibold z-[0] shrink-0">AI Powered Practice</div>
						<div className="self-stretch relative text-sm md:text-num-16 leading-num-24 text-gray-100 z-[1] shrink-0">Students can Practice positions anytime, Get guided analysis of moves, Reinforce lessons between classes.</div>
					</div>
					<div className="w-full flex-1 relative bg-[#0D0D0D] overflow-hidden shrink-0 z-[2] text-[12px] md:text-[14px] text-yellow min-h-[250px]">
						<div className="absolute top-[123px] left-[9px] [filter:blur(100px)] rounded-num-50 bg-gray-300 w-[50px] h-[50px] opacity-[0.5] shrink-0" />
						<img className="absolute bottom-0 left-[calc(50%_-_150px)] w-[300px] h-[220px] object-cover shrink-0" src="/card3.png" alt="" />
						<div className="absolute top-[20px] left-[20px] leading-5 inline-block w-[200px] shrink-0 bg-black/40 p-2 rounded backdrop-blur-sm">Look for forcing moves: checks, captures, threats.</div>
						<img className="absolute top-[10px] right-[10px] w-24 h-24 object-cover shrink-0" src="/character.png" alt="" />
					</div>
				</Card>

				{/* Card 4: Free Practice Tournaments */}
				<Card className="rounded-none bg-[#0D0D0D] border-[#484848] border-solid border-[1px] overflow-hidden flex flex-col items-center py-0 relative isolate gap-3 w-full">
					<div className='flex flex-col gap-2 p-6 w-full'>
						<div className="self-stretch relative font-semibold z-[0] shrink-0">Free Practice Tournaments</div>
						<div className="self-stretch relative text-sm md:text-num-16 leading-num-24 text-gray-100 z-[1] shrink-0">Students apply skills in real competitive environments.</div>
					</div>
					<img className="mt-auto w-full object-contain" src="/card4.png" alt="" />
				</Card>

				{/* Card 5: Coach Doubt Support */}
				<Card className="rounded-none bg-[#0D0D0D] border-[#484848] border-solid border-[1px] overflow-hidden flex flex-col items-center py-0 relative isolate gap-3 w-full">
					<div className='flex flex-col gap-2 p-6 w-full'>
						<div className="self-stretch relative font-semibold z-[0] shrink-0">Coach Doubt Support</div>
						<div className="self-stretch relative text-sm md:text-num-16 leading-num-24 text-gray-100 z-[1] shrink-0">Doubts are solved when they arise not weeks later.</div>
					</div>
					<img className='mt-auto w-full object-contain' src="/card5.png" alt="" />
				</Card>

				{/* Card 6: Monthly Progress Reports */}
				<Card className="rounded-none bg-[#0D0D0D] border-[#484848] border-solid border-[0.5px] overflow-hidden flex flex-col lg:flex-row items-stretch py-0 relative isolate gap-3 lg:col-span-3 text-num-16 text-gray-100 w-full min-h-[300px]">
					<div className="flex-1 flex flex-col gap-4 p-6 justify-center">
						<div className="flex flex-col gap-2">
							<div className="self-stretch relative text-xl md:text-[24px] font-semibold text-white z-[0] shrink-0">Monthly Progress Reports</div>
							<div className="relative leading-num-24 inline-block z-[1] shrink-0 text-sm md:text-base">Parents receive clear insights into:</div>
						</div>
						<div className="relative inline-block z-[2] shrink-0 text-sm md:text-base">
							<ul className="m-0 font-inherit text-[length:inherit] pl-[21px]">
								<li className="mb-2">Improvement areas</li>
								<li className="mb-2">Strengths</li>
								<li className="mb-2">Growth milestones</li>
								<li>Learning consistency</li>
							</ul>
						</div>
					</div>
					<div className="flex-1 relative min-h-[200px] lg:min-h-full overflow-hidden">
						<img className="w-full h-full object-cover lg:object-contain object-bottom" src="/card6.png" alt="" />
					</div>
				</Card>
			</div>
		</div>
	);
};

export default LearningSystemSection;
