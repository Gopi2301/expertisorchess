import type { FunctionComponent } from 'react';
import Frame from './Frame';

const ResultsSection: FunctionComponent = () => {
	return (
		<div className="w-full relative flex flex-col items-center py-0 px-4 md:px-[88px] box-border gap-8 md:gap-16 text-center text-[12px] text-yellow font-inter">
			<div className="flex flex-col items-center w-full">
				<div className="flex flex-col items-center gap-3">
					<div className="self-stretch relative tracking-[0.05em] font-medium">RESULTS</div>
					<div className="flex flex-col items-center justify-center gap-3 text-2xl md:text-3xl lg:text-[40px] text-white font-fox-marilyn-strokes text-center">
						<div className="self-stretch relative leading-tight">
							<span>Improvements <br /></span>
							<span className="font-semibold font-inter">That Go Beyond Chess</span>
						</div>
						<Frame />
					</div>
				</div>
			</div>
			<div className="flex flex-col items-center gap-5 text-sm md:text-[18px] text-silver w-full">
				<div className="w-full max-w-[1266px] grid grid-cols-1 lg:grid-cols-2">
					<div className="bg-[#171717] flex flex-col items-center justify-center p-6 md:p-8 relative isolate gap-6 min-h-[300px]">
						<img className="w-10 h-6 relative z-[0] shrink-0" src="/comma.png" alt="" />
						<div className="w-full max-w-[447px] relative leading-relaxed inline-block z-[1] shrink-0">
							<span className="leading-relaxed">{`I used to just move pieces randomly and lose every game in school. After joining, I finally `}</span>
							<i className="font-medium font-roboto-serif text-yellow leading-relaxed">understand how to think</i>
							<span className="leading-relaxed">
								<span className="text-white leading-relaxed">{` `}</span>
								<span className="leading-relaxed">2–3 moves ahead. I’m actually winning matches now.</span>
							</span>
						</div>
						<div className="flex flex-col items-center gap-1 z-[2] shrink-0 text-sm md:text-[16px] text-white">
							<div className="relative font-semibold">Arjun</div>
							<div className="relative text-xs md:text-num-14 text-silver">Varanasi</div>
						</div>
						<div className="w-[40px] h-[40px] absolute !m-0 top-[0px] left-[0px] bg-gray-100 z-[3] shrink-0 opacity-10" />
						<div className="w-[40px] h-[40px] absolute !m-0 right-[0px] bottom-[0px] bg-gray-100 z-[4] shrink-0 opacity-10" />
					</div>
					<div className="bg-[#0D0D0D] flex flex-col items-center justify-center p-6 md:p-8 relative isolate gap-6 min-h-[300px]">
						<img className="w-10 h-6 relative z-[0] shrink-0" src="/comma.png" alt="" />
						<div className="w-full max-w-[447px] relative leading-relaxed inline-block z-[1] shrink-0">
							<span className="leading-relaxed">{`My daughter was interested in chess but had no structure. Within a month here, she `}</span>
							<i className="font-roboto-serif text-yellow leading-relaxed">started recognizing patterns</i>
							<span className="leading-relaxed"> and even corrected me while we were playing at home.</span>
						</div>
						<div className="flex flex-col items-center gap-1 z-[2] shrink-0 text-sm md:text-[16px] text-white">
							<div className="relative font-semibold">Sneha Patel</div>
							<div className="relative text-xs md:text-num-14 text-silver">Pondicherry</div>
						</div>
						<div className="w-[40px] h-[40px] absolute !m-0 bottom-[0px] left-[0px] bg-gray-300 z-[3] shrink-0 opacity-10" />
						<div className="w-[40px] h-[40px] absolute !m-0 top-[0px] right-[0px] bg-gray-300 z-[4] shrink-0 opacity-10" />
					</div>
					<div className="bg-[#0D0D0D] flex flex-col items-center justify-center p-6 md:p-8 relative isolate gap-6 min-h-[300px]">
						<img className="w-10 h-6 relative z-[0] shrink-0" src="/comma.png" alt="" />
						<div className="w-full max-w-[447px] relative leading-relaxed inline-block z-[1] shrink-0">
							<span className="leading-relaxed">{`The coach explains `}</span>
							<i className="font-medium font-roboto-serif text-yellow leading-relaxed">why a move works</i>
							<span className="leading-relaxed">, not just what to play. That changed everything for me I stopped memorizing and started understanding.</span>
						</div>
						<div className="flex flex-col items-center gap-1 z-[2] shrink-0 text-sm md:text-[16px] text-white">
							<div className="relative font-semibold">Rohan</div>
							<div className="relative text-xs md:text-num-14 text-silver">Mysore</div>
						</div>
						<div className="w-[40px] h-[40px] absolute !m-0 top-[0px] right-[0px] bg-gray-300 z-[3] shrink-0 opacity-10" />
						<div className="w-[40px] h-[40px] absolute !m-0 bottom-[0px] left-[0px] bg-gray-300 z-[4] shrink-0 opacity-10" />
					</div>
					<div className="bg-[#171717] flex flex-col items-center justify-center p-6 md:p-8 relative isolate gap-6 min-h-[300px]">
						<img className="w-10 h-6 relative z-[0] shrink-0" src="/comma.png" alt="" />
						<div className="w-full max-w-[447px] relative leading-relaxed inline-block z-[1] shrink-0">
							<span className="leading-relaxed">{`YouTube tutorials never worked for me because I didn’t know what to learn next. Here, everything is `}</span>
							<i className="font-medium font-roboto-serif text-yellow leading-relaxed">structured</i>
							<span className="leading-relaxed"> and I can actually see progress.</span>
						</div>
						<div className="flex flex-col items-center gap-1 z-[2] shrink-0 text-sm md:text-[16px] text-white">
							<div className="relative font-semibold">Aarav Sharma</div>
							<div className="relative text-xs md:text-num-14 text-silver">Udaipur</div>
						</div>
						<div className="w-[40px] h-[40px] absolute !m-0 top-[0px] left-[0px] bg-gray-100 z-[3] shrink-0 opacity-10" />
						<div className="w-[40px] h-[40px] absolute !m-0 right-[0px] bottom-[0px] bg-gray-100 z-[4] shrink-0 opacity-10" />
					</div>
				</div>
				<div className="w-full grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
					<div className="bg-gray-400 flex flex-col items-center justify-center p-0 relative isolate gap-8 aspect-video w-full rounded overflow-hidden">
						<img className="self-stretch flex-1 relative max-w-full overflow-hidden max-h-full object-cover z-[0]" src="/video1.png" alt="" />
						<img className="w-12 h-12 md:w-[90px] md:h-[90px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1] cursor-pointer hover:scale-105 transition-transform" src='Play Button.svg' alt="Play" />
					</div>
					<div className="bg-gray-400 flex flex-col items-center justify-center p-0 relative isolate gap-8 aspect-video w-full rounded overflow-hidden">
						<img className="self-stretch flex-1 relative max-w-full overflow-hidden max-h-full object-cover z-[0]" src="/video2.png" alt="" />
						<img className="w-12 h-12 md:w-[90px] md:h-[90px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1] cursor-pointer hover:scale-105 transition-transform" src='Play Button.svg' alt="Play" />
					</div>
					<div className="bg-gray-400 flex flex-col items-center justify-center p-0 relative isolate gap-8 aspect-video w-full rounded overflow-hidden">
						<img className="self-stretch flex-1 relative max-w-full overflow-hidden max-h-full object-cover z-[0]" src="/video3.png" alt="" />
						<img className="w-12 h-12 md:w-[90px] md:h-[90px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1] cursor-pointer hover:scale-105 transition-transform" src='Play Button.svg' alt="Play" />
					</div>
				</div>
			</div>
		</div>);
};

export default ResultsSection;
