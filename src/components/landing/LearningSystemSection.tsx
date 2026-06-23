import { FunctionComponent } from 'react';
import { Card } from '@/components/ui/Card';

const LearningSystemSection: FunctionComponent = () => {
	return (
		<div className="w-full relative flex flex-col items-center py-0 px-[88px] box-border gap-16 text-left text-[12px] text-yellow font-inter">
			<div className="self-stretch flex items-center justify-between gap-5 max-w-[1264px] w-full">
				<div className="flex-1 flex flex-col items-start gap-3 max-w-[700px]">
					<div className="self-stretch relative tracking-[0.05em] font-medium">THE LEARNING SYSTEM</div>
					<div className="self-stretch flex flex-col items-start gap-3 text-[40px] text-white">
						<div className="self-stretch relative">
							<span className="font-semibold">{`A Complete `}</span>
							<span className="font-fox-marilyn-strokes">Learning Ecosystem</span>
							<span className="font-semibold">, Not Just Classes</span>
						</div>
						<div className="relative text-num-16 leading-num-24 text-gray-100">Most academies stop at teaching. We continue the learning process beyond the classroom.</div>
					</div>
				</div>
				<div className="h-[171px] w-48 relative">
					<img className="absolute top-[9px] left-[-38px] w-[188.5px] h-[188.5px] object-contain shrink-0" src='/Sticker (1).png' alt="" />
					<img className="absolute top-[-17px] left-[61px] w-[171.2px] h-[171.2px] object-contain shrink-0" src="/Sticker.png" alt="" />
				</div>
			</div>
			<div className="w-full h-[1060px] grid box-border grid-cols-[repeat(3,_360px)] grid-rows-[repeat(3,_1fr)] gap-5 max-w-[1264px] text-[24px] text-white justify-center">
				{/* Card 1: Live Expert Coaching */}
				<Card className="bg-[#0D0D0D] border-[#484848] border-solid border-[1px] overflow-hidden flex flex-col items-center py-0 relative isolate gap-3 col-[1] row-[1] text-gray-100 w-[360px]">
					<div className='flex flex-col gap-2 p-6'>
						<div className="self-stretch relative font-semibold text-white z-[0] shrink-0">Live Expert Coaching</div>
						<div className="self-stretch relative text-num-16 leading-num-24 z-[1] shrink-0">Most academies stop at teaching. We continue the learning process beyond the classroom.</div>
					</div>
					<img className="mt-auto w-full object-contain" src="/card1.png" alt="" />
				</Card>

				{/* Card 2: Recorded Lessons */}
				<Card className="bg-[#0D0D0D] border-[#484848] border-solid border-[1px] overflow-hidden flex flex-col items-center py-0 relative isolate gap-3 col-[2] row-[1] w-[360px]">
					<div className='flex flex-col gap-2 p-6'>
						<div className="self-stretch relative font-semibold z-[0] shrink-0">Recorded Lessons</div>
						<div className="self-stretch relative text-num-16 leading-num-24 text-gray-100 z-[1] shrink-0">Never miss progress. Every session is available for revision.</div>
					</div>
					<img className="mt-auto w-full object-contain" src="/card2.png" alt="" />
				</Card>

				{/* Card 3: AI Powered Practice Support */}
				<Card className="bg-[#0D0D0D] border-[#484848] border-solid border-[1px] overflow-hidden flex flex-col items-center py-0 relative isolate gap-3 col-[3] row-[1_/_span_2] w-[360px]">
					<div className='flex flex-col gap-2 p-6'>
						<div className="self-stretch relative font-semibold z-[0] shrink-0">AI Powered Practice Support</div>
						<div className="self-stretch relative text-num-16 leading-num-24 text-gray-100 z-[1] shrink-0">Students can Practice positions anytime, Get guided analysis of moves, Reinforce lessons between classes, Stay engaged even outside sessions</div>
					</div>
					<div className="w-[408px] h-[503px] absolute !!m-[0 important] bottom-[0px] left-[0px] bg-[#0D0D0D] overflow-hidden shrink-0 z-[2] text-[14px] text-yellow">
						<div className="absolute top-[323px] left-[9px] [filter:blur(150px)] rounded-num-50 bg-gray-300 w-[62px] h-num-62 opacity-[0.5] shrink-0" />
						<div className="absolute top-[417px] left-[337px] [filter:blur(150px)] rounded-num-50 bg-gray-300 w-[62px] h-num-62 shrink-0" />
						<img className="absolute top-[calc(50%_-_119.5px)] left-[calc(50%_-_167px)] w-[333px] h-[332px] object-cover shrink-0" src="/card3.png" alt="" />
						<img className="absolute top-[31px] left-[22px] w-[252px] h-[58px] shrink-0" alt="" />
						<img className="absolute top-[20px] left-[250px] w-[23px] h-[23px] shrink-0" alt="" />
						<img className="absolute top-[19px] left-[273px] w-[11px] h-[11px] shrink-0" alt="" />
						<div className="absolute top-[40px] left-[43px] leading-5 inline-block w-[218px] shrink-0">Look for forcing moves: checks, captures, threats.</div>
						<img className="absolute top-[14px] left-[257px] w-40 h-40 object-cover shrink-0" src="/character.png" alt="" />
						<div className="absolute top-[298px] left-[328px] [background:linear-gradient(234.36deg,_#a39b00,_#0f0e00)_border-box] [border:1px_solid_transparent] box-border w-[42px] h-[42px] shrink-0" />
					</div>
				</Card>

				{/* Card 4: Free Practice Tournaments */}
				<Card className="bg-[#0D0D0D] border-[#484848] border-solid border-[1px] overflow-hidden flex flex-col items-center py-0 relative isolate gap-3 col-[1] row-[2] w-[360px]">
					<div className='flex flex-col gap-2 p-6'>
						<div className="self-stretch relative font-semibold z-[0] shrink-0">Free Practice Tournaments</div>
						<div className="self-stretch relative text-num-16 leading-num-24 text-gray-100 z-[1] shrink-0">Students apply skills in real competitive environments.</div>
					</div>
					<img className="mt-auto w-full object-contain" src="/card4.png" alt="" />
				</Card>

				{/* Card 5: Coach Doubt Support */}
				<Card className="bg-[#0D0D0D] border-[#484848] border-solid border-[1px] overflow-hidden flex flex-col items-center py-0 relative isolate gap-3 col-[2] row-[2] w-[360px]">
					<div className='flex flex-col gap-2 p-6'>
						<div className="self-stretch relative font-semibold z-[0] shrink-0">Coach Doubt Support</div>
						<div className="self-stretch relative text-num-16 leading-num-24 text-gray-100 z-[1] shrink-0">Doubts are solved when they arise not weeks later.</div>
					</div>
					<img className='mt-auto w-full obtain-contain' src="/card5.png" alt="" />
				</Card>

				{/* Card 6: Monthly Progress Reports */}
				<Card className="bg-[#0D0D0D] border-[#484848] border-solid border-[0.5px] overflow-hidden flex flex-col items-start py-0 relative isolate gap-3 col-[1_/_span_3] row-[3] text-num-16 text-gray-100 w-[1120px]">
					<div className="w-full flex flex-col gap-2 p-6">
						<div className="self-stretch relative text-[24px] font-semibold text-white z-[0] shrink-0">Monthly Progress Reports</div>
						<div className="w-[259px] relative leading-num-24 inline-block z-[1] shrink-0">Parents receive clear insights into:</div>
					</div>
					<div className="w-[259px] relative inline-block z-[2] shrink-0">
						<ul className="m-0 font-inherit text-[length:inherit] pl-[21px]">
							<li className="mb-3">Improvement areas</li>
							<li className="mb-3">Strengths</li>
							<li className="mb-3">Growth milestones</li>
							<li>Learning consistency</li>
						</ul>
					</div>
					<img className="w-[calc(100%_-_377px)] h-[340px] absolute !!m-[0 important] right-[0px] bottom-[0px] left-[377px] max-w-full overflow-hidden shrink-0 object-contain z-[3]" src="/card6.png" alt="" />
				</Card>
			</div>
		</div>
	);
};

export default LearningSystemSection;
