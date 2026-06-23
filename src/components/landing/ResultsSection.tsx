import type { FunctionComponent } from 'react';
import Frame from './Frame';

const ResultsSection: FunctionComponent = () => {
	return (
		<div className="w-full relative flex flex-col items-center py-0 px-[88px] box-border gap-16 text-center text-[12px] text-yellow font-inter">
			<div className="flex flex-col items-center">
				<div className="flex flex-col items-start gap-3">
					<div className="self-stretch relative tracking-[0.05em] font-medium">RESULTS</div>
					<div className="flex flex-col items-center justify-center gap-3 text-[40px] text-white font-fox-marilyn-strokes">
						<div className="self-stretch relative">
							<span>Improvements <br /></span>
							<span className="font-semibold font-inter">That Go Beyond Chess</span>
						</div>
						<Frame />
					</div>
				</div>
			</div>
			<div className="flex flex-col items-start gap-5 text-[18px] text-silver">
				<div className="w-[1266px] h-[747px]  grid grid-cols-[repeat(2,_1fr)] grid-rows-[repeat(2,_1fr)]">
					<div className="bg-[#171717] flex flex-col items-center justify-center p-num-24 relative isolate gap-8 col-[1] row-[1]">
						<img className="w-11 h-[27px] relative z-[0] shrink-0" src="/comma.png" alt="" />
						<div className="w-[447px] relative leading-num-28 inline-block z-[1] shrink-0">
							<span className="leading-num-28">{`I used to just move pieces randomly and lose every game in school. After joining, I finally `}</span>
							<i className="font-medium font-roboto-serif text-yellow leading-num-28">understand how to think</i>
							<span className="leading-num-28">
								<span className="text-white leading-num-28">{` `}</span>
								<span className="leading-num-28">2–3 moves ahead. I’m actually winning matches now.</span>
							</span>
						</div>
						<div className="flex flex-col items-center gap-1 z-[2] shrink-0 text-[16px] text-white">
							<div className="relative font-semibold">Arjun</div>
							<div className="relative text-num-14 text-silver">Varanasi</div>
						</div>
						<div className="w-[62px] h-num-62 absolute !m-0 top-[0px] left-[0px] bg-gray-100 z-[3] shrink-0" />
						<div className="w-[62px] h-num-62 absolute !m-0 right-[0px] bottom-[-0.5px] bg-gray-100 z-[4] shrink-0" />
					</div>
					<div className="bg-[#0D0D0D] flex flex-col items-center justify-center p-num-24 relative isolate gap-8 col-[2] row-[1]">
						<img className="w-11 h-[27px] relative z-[0] shrink-0" src="/comma.png" alt="" />
						<div className="w-[447px] relative leading-num-28 inline-block z-[1] shrink-0">
							<span className="leading-num-28">{`My daughter was interested in chess but had no structure. Within a month here, she `}</span>
							<i className="font-roboto-serif text-yellow leading-num-28">started recognizing patterns</i>
							<span className="leading-num-28"> and even corrected me while we were playing at home.</span>
						</div>
						<div className="flex flex-col items-center gap-1 z-[2] shrink-0 text-[16px] text-white">
							<div className="relative font-semibold">Sneha Patel</div>
							<div className="relative text-num-14 text-silver">Pondicherry</div>
						</div>
						<div className="w-[62px] h-num-62 absolute !m-0 bottom-[-0.5px] left-[0px] bg-gray-300 z-[3] shrink-0" />
						<div className="w-[62px] h-num-62 absolute !m-0 top-[0px] right-[0px] bg-gray-300 z-[4] shrink-0" />
					</div>
					<div className="bg-[#0D0D0D] flex flex-col items-center justify-center p-num-24 relative isolate gap-8 col-[1] row-[2]">
						<img className="w-11 h-[27px] relative z-[0] shrink-0" src="/comma.png" alt="" />
						<div className="w-[447px] relative leading-num-28 inline-block z-[1] shrink-0">
							<span className="leading-num-28">{`The coach explains `}</span>
							<i className="font-medium font-roboto-serif text-yellow leading-num-28">why a move works</i>
							<span className="leading-num-28">, not just what to play. That changed everything for me I stopped memorizing and started understanding.</span>
						</div>
						<div className="flex flex-col items-center gap-1 z-[2] shrink-0 text-[16px] text-white">
							<div className="relative font-semibold">Rohan</div>
							<div className="relative text-num-14 text-silver">Mysore</div>
						</div>
						<div className="w-[62px] h-num-62 absolute !m-0 top-[0.5px] right-[0px] bg-gray-300 z-[3] shrink-0" />
						<div className="w-[62px] h-num-62 absolute !m-0 bottom-[-1px] left-[0px] bg-gray-300 z-[4] shrink-0" />
					</div>
					<div className="bg-[#171717] flex flex-col items-center justify-center p-num-24 relative isolate gap-8 col-[2] row-[2]">
						<img className="w-11 h-[27px] relative z-[0] shrink-0" src="/comma.png" alt="" />
						<div className="w-[447px] relative leading-num-28 inline-block z-[1] shrink-0">
							<span className="leading-num-28">{`YouTube tutorials never worked for me because I didn’t know what to learn next. Here, everything is `}</span>
							<i className="font-medium font-roboto-serif text-yellow leading-num-28">structured</i>
							<span className="leading-num-28"> and I can actually see progress.</span>
						</div>
						<div className="flex flex-col items-center gap-1 z-[2] shrink-0 text-[16px] text-white">
							<div className="relative font-semibold">Aarav Sharma</div>
							<div className="relative text-num-14 text-silver">Udaipur</div>
						</div>
						<div className="w-[62px] h-num-62 absolute !m-0 top-[0.5px] left-[0px] bg-gray-100 z-[3] shrink-0" />
						<div className="w-[62px] h-num-62 absolute !m-0 right-[0px] bottom-[-1px] bg-gray-100 z-[4] shrink-0" />
					</div>
				</div>
				<div className="self-stretch h-[640px] grid box-border grid-cols-[repeat(3,_1fr)] grid-rows-[1fr] [column-gap:20px]">
					<div className="bg-gray-400  flex flex-col items-center justify-center p-num-24 relative isolate gap-8 col-[1] row-[1]">
						<img className="self-stretch flex-1 relative max-w-full overflow-hidden max-h-full object-cover z-[0]" src="/video1.png" alt="" />
						<img className="w-[90px] h-[90px] absolute !m-0 top-[275px] left-[159px] rounded-[45px] z-[1]" src='Play Button.svg' alt="" />
					</div>
					<div className="bg-gray-400 flex flex-col items-center justify-center p-num-24 relative isolate gap-8 col-[2] row-[1]">
						<img className="self-stretch flex-1 relative max-w-full overflow-hidden max-h-full object-cover z-[0]" src="/video2.png" alt="" />
						<img className="w-[90px] h-[90px] absolute !m-0 top-[275px] left-[159px] rounded-[45px] z-[1]" src='Play Button.svg' alt="" />
					</div>
					<div className="bg-gray-400  flex flex-col items-center justify-center p-num-24 relative isolate gap-8 col-[3] row-[1]">
						<img className="self-stretch flex-1 relative max-w-full overflow-hidden max-h-full object-cover z-[0]" src="/video3.png" alt="" />
						<img className="w-[90px] h-[90px] absolute !m-0 top-[275px] left-[159px] rounded-[45px] z-[1]" src='Play Button.svg' alt="" />
					</div>
				</div>
			</div>
		</div>);
};

export default ResultsSection;
