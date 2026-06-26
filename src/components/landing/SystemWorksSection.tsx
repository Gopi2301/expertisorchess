import type { FunctionComponent } from 'react';
import { Check, X } from 'lucide-react';

const SystemWorksSection: FunctionComponent = () => {
  	return (
    		<div className="w-full relative flex flex-col items-center py-0 px-4 md:px-[88px] box-border gap-8 md:gap-16 text-left text-base text-white font-inter">
      			<div className="flex flex-col items-center text-center text-xs text-yellow w-full">
        				<div className="w-full max-w-[720px] flex flex-col items-center gap-3">
          					<div className="self-stretch relative tracking-[0.05em] font-medium">WHY THIS SYSTEM WORKS</div>
          					<div className="self-stretch flex flex-col items-center gap-3 text-2xl md:text-3xl lg:text-[40px] text-white font-fox-marilyn text-center">
            						<div className="self-stretch relative leading-tight">
              							<span>Learning Happens</span>
              							<span className="font-semibold font-inter"> Between Classes, Not Just During Them</span>
            						</div>
            						<div className="self-stretch relative text-sm md:text-base leading-6 font-inter text-gray-100">Expertisor creates a complete learning ecosystem where students continue improving through guided practice, AI assisted reinforcement, progress tracking, tournament experience, and ongoing mentor support.</div>
          					</div>
        				</div>
      			</div>
      			{/* Desktop Layout - Hidden on mobile */}
      			<div className="w-full hidden md:block overflow-x-auto pb-4 scrollbar-thin">
        				<div className="w-[960px] rounded-2xl bg-black overflow-hidden flex items-center isolate mx-auto">
          					<div className="flex-1 flex flex-col items-start z-[3]">
            						<div className="self-stretch flex items-center justify-center py-[26px] px-6 opacity-0">
              							<div className="relative leading-5">Others</div>
            						</div>
            						<div className="self-stretch bg-neutral-900 flex items-center justify-center py-4 px-6">
              							<div className="flex-1 relative leading-6">Live Chess Classes</div>
            						</div>
            						<div className="self-stretch bg-black flex items-center justify-center py-4 px-6">
              							<div className="flex-1 relative leading-6">Learning Roadmap</div>
            						</div>
            						<div className="self-stretch bg-neutral-900 flex items-center justify-center py-4 px-6">
              							<div className="flex-1 relative leading-6">Updates to Parents</div>
            						</div>
            						<div className="self-stretch bg-black flex items-center justify-center py-4 px-6">
              							<div className="flex-1 relative leading-6">Monthly Progress Reports</div>
            						</div>
            						<div className="self-stretch bg-neutral-900 flex items-center justify-center py-4 px-6">
              							<div className="flex-1 relative leading-6">Certifications</div>
            						</div>
            						<div className="self-stretch bg-black flex items-center justify-center py-4 px-6">
              							<div className="flex-1 relative leading-6">Doubt Clearing Support</div>
            						</div>
            						<div className="self-stretch bg-neutral-900 flex items-center justify-center py-4 px-6">
              							<div className="flex-1 relative leading-6">AI Assisted Coaching</div>
            						</div>
            						<div className="self-stretch bg-black flex items-center justify-center py-4 px-6">
              							<div className="flex-1 relative leading-6">Tournaments</div>
            						</div>
          					</div>
          					<div className="w-[250px] flex flex-col items-start z-[2] text-gray-400">
            						<div className="self-stretch flex items-center justify-center py-[26px] px-4 text-white">
              							<div className="relative leading-5">Others</div>
            						</div>
            						<div className="self-stretch bg-neutral-900 flex items-center justify-center p-4">
              							<div className="relative leading-6">Weekly Classes</div>
            						</div>
            						<div className="self-stretch bg-black flex items-center justify-center p-4">
              							<div className="relative leading-6">Basic Levels</div>
            						</div>
            						<div className="self-stretch bg-neutral-900 flex items-center justify-center p-4">
              							<div className="relative leading-6">Limited Updates</div>
            						</div>
            						<div className="self-stretch bg-black flex items-center justify-center p-4">
              							<X className="h-5 w-5 text-neutral-600" />
            						</div>
            						<div className="self-stretch bg-neutral-900 flex items-center justify-center p-4">
              							<div className="relative leading-6">Rare</div>
            						</div>
            						<div className="self-stretch bg-black flex items-center justify-center p-4">
              							<X className="h-5 w-5 text-neutral-600" />
            						</div>
            						<div className="self-stretch bg-neutral-900 flex items-center justify-center p-4">
              							<X className="h-5 w-5 text-neutral-600" />
            						</div>
            						<div className="self-stretch bg-black flex items-center justify-center p-4">
              							<div className="relative leading-6">Few Events</div>
            						</div>
          					</div>
          					<div className="w-[276px] shadow-[0px_0px_50px_rgba(255,_242,_0,_0.05)_inset] [background:linear-gradient(180deg,_#4c4800,_#b2a900)_border-box] border border-transparent box-border overflow-hidden shrink-0 flex flex-col items-start py-0 px-0 relative isolate z-[1]">
            						<div className="self-stretch flex flex-col items-center justify-center p-4 z-[0] shrink-0">
              							<img className="w-[139px] h-10 relative object-contain" src="/logo.svg" alt="Expertisor" />
            						</div>
            						<div className="self-stretch bg-neutral-900/50 flex items-center justify-center p-4 z-[1] shrink-0">
              							<div className="relative leading-6">Live Interactive Classes</div>
            						</div>
            						<div className="self-stretch bg-black/50 flex items-center justify-center p-4 z-[2] shrink-0">
              							<div className="relative leading-6">Step by Step Roadmap</div>
            						</div>
            						<div className="self-stretch bg-neutral-900/50 flex items-center justify-center p-4 z-[3] shrink-0">
              							<div className="relative leading-6">Regular Updates</div>
            						</div>
            						<div className="self-stretch bg-black/50 flex items-center justify-center p-4 z-[4] shrink-0">
              							<Check className="h-5 w-5 text-yellow" />
            						</div>
            						<div className="self-stretch bg-neutral-900/50 flex items-center justify-center p-4 z-[5] shrink-0">
              							<div className="relative leading-6">Included</div>
            						</div>
            						<div className="self-stretch bg-black/50 flex items-center justify-center p-4 gap-2 z-[6] shrink-0">
              							<Check className="h-5 w-5 text-yellow" />
              							<div className="relative leading-6">Quick Support</div>
            						</div>
            						<div className="self-stretch bg-neutral-900/50 flex items-center justify-center p-4 z-[7] shrink-0">
              							<Check className="h-5 w-5 text-yellow" />
            						</div>
            						<div className="self-stretch bg-black/50 flex items-center justify-center p-4 z-[8] shrink-0">
              							<div className="relative leading-6">Free Regular Tournaments</div>
            						</div>
            						<div className="w-[274px] h-full absolute !m-0 top-[0px] left-[0px] [background:linear-gradient(180deg,_rgba(72,_69,_0,_0.35),_#605b00)] opacity-[0.2] z-[9] shrink-0" />
          					</div>
          					<div className="w-14 flex flex-col items-start z-[0]">
            						<div className="self-stretch flex items-center justify-center py-[26px] px-4 opacity-0">
              							<div className="relative leading-5 opacity-0">0</div>
            						</div>
            						<div className="self-stretch bg-neutral-900 flex items-center justify-center p-4">
              							<div className="relative leading-6 opacity-0">0</div>
            						</div>
            						<div className="self-stretch bg-black flex items-center justify-center p-4">
              							<div className="relative leading-6 opacity-0">0</div>
            						</div>
            						<div className="self-stretch bg-neutral-900 flex items-center justify-center p-4">
              							<div className="relative leading-6 opacity-0">0</div>
            						</div>
            						<div className="self-stretch bg-black flex items-center justify-center p-4">
              							<div className="relative leading-6 opacity-0">0</div>
            						</div>
            						<div className="self-stretch bg-neutral-900 flex items-center justify-center p-4">
              							<div className="relative leading-6 opacity-0">0</div>
            						</div>
            						<div className="self-stretch bg-black flex items-center justify-center p-4">
              							<div className="relative leading-6 opacity-0">0</div>
            						</div>
            						<div className="self-stretch bg-neutral-900 flex items-center justify-center p-4">
              							<div className="relative leading-6 opacity-0">0</div>
            						</div>
            						<div className="self-stretch bg-black flex items-center justify-center p-4">
              							<div className="relative leading-6 opacity-0">0</div>
            						</div>
          					</div>
        				</div>
      			</div>

      			{/* Mobile Stacked Layout - Shown on mobile only */}
      			<div className="w-full flex md:hidden flex-col items-start justify-center gap-6 text-left text-base text-white font-inter">
        				{/* Expertisor Features Card */}
        				<div className="self-stretch shadow-[0px_0px_50px_rgba(255,_242,_0,_0.05)_inset] [background:linear-gradient(180deg,_#4c4800,_#b2a900)_border-box] border border-transparent overflow-hidden flex flex-col items-start relative isolate shrink-0 rounded-xl">
          					<div className="self-stretch flex flex-col items-center justify-center p-4 z-[0] shrink-0">
            						<img className="w-[139px] h-10 relative object-contain" src="/logo.svg" alt="Expertisor" />
          					</div>
          					<div className="self-stretch bg-neutral-900/50 flex items-center p-4 gap-3 z-[1] shrink-0">
            						<div className="flex-1 relative leading-6">Live Interactive Classes</div>
            						<Check className="h-5 w-5 text-yellow shrink-0" />
          					</div>
          					<div className="self-stretch bg-black flex items-center p-4 gap-3 z-[2] shrink-0">
            						<div className="flex-1 relative leading-6">Step by Step Roadmap</div>
            						<Check className="h-5 w-5 text-yellow shrink-0" />
          					</div>
          					<div className="self-stretch bg-neutral-900/50 flex items-center p-4 gap-3 z-[3] shrink-0">
            						<div className="flex-1 relative leading-6">Regular Updates to Parents</div>
            						<Check className="h-5 w-5 text-yellow shrink-0" />
          					</div>
          					<div className="self-stretch bg-black flex items-center p-4 gap-3 z-[4] shrink-0">
            						<div className="flex-1 relative leading-6">Monthly Progress Reports</div>
            						<Check className="h-5 w-5 text-yellow shrink-0" />
          					</div>
          					<div className="self-stretch bg-neutral-900/50 flex items-center p-4 gap-3 z-[5] shrink-0">
            						<div className="flex-1 relative leading-6">Certifications</div>
            						<Check className="h-5 w-5 text-yellow shrink-0" />
          					</div>
          					<div className="self-stretch bg-black flex items-center p-4 gap-3 z-[6] shrink-0">
            						<div className="flex-1 relative leading-6">Quick Support</div>
            						<Check className="h-5 w-5 text-yellow shrink-0" />
          					</div>
          					<div className="self-stretch bg-neutral-900/50 flex items-center p-4 gap-3 z-[7] shrink-0">
            						<div className="flex-1 relative leading-6">AI Assisted Coaching</div>
            						<Check className="h-5 w-5 text-yellow shrink-0" />
          					</div>
          					<div className="self-stretch bg-black flex items-center p-4 gap-3 z-[8] shrink-0">
            						<div className="flex-1 relative leading-6">Free Regular Tournaments</div>
            						<Check className="h-5 w-5 text-yellow shrink-0" />
          					</div>
          					<div className="w-full h-full absolute !m-0 top-[0px] right-[0px] left-[0px] [background:linear-gradient(180deg,_rgba(72,_69,_0,_0.35),_#605b00)] opacity-[0.2] z-[9] shrink-0 pointer-events-none" />
        				</div>

        				{/* Others Features Card */}
        				<div className="self-stretch border-neutral-800 border-solid border-[1px] rounded-xl overflow-hidden flex flex-col items-start shrink-0 text-gray-400 bg-neutral-950">
          					<div className="self-stretch flex items-center justify-center py-[20px] px-4 text-white font-semibold border-b border-neutral-900">
            						<div className="relative leading-5">Others</div>
          					</div>
          					<div className="self-stretch bg-neutral-900/50 flex items-center justify-between p-4 gap-2">
            						<div className="flex-1 relative leading-6 text-sm">Weekly Classes</div>
          					</div>
          					<div className="self-stretch bg-black flex items-center justify-between p-4 gap-2">
            						<div className="flex-1 relative leading-6 text-sm">Basic Levels</div>
          					</div>
          					<div className="self-stretch bg-neutral-900/50 flex items-center justify-between p-4 gap-2">
            						<div className="flex-1 relative leading-6 text-sm">Limited Updates</div>
          					</div>
          					<div className="self-stretch bg-black flex items-center justify-between p-4 gap-2">
            						<div className="flex-1 relative leading-6 text-sm">Monthly Progress Reports</div>
            						<X className="h-5 w-5 text-neutral-600 shrink-0" />
          					</div>
          					<div className="self-stretch bg-neutral-900/50 flex items-center justify-between p-4 gap-2">
            						<div className="flex-1 relative leading-6 text-sm">Certifications</div>
          					</div>
          					<div className="self-stretch bg-black flex items-center justify-between p-4 gap-2">
            						<div className="flex-1 relative leading-6 text-sm">Quick Support</div>
            						<X className="h-5 w-5 text-neutral-600 shrink-0" />
          					</div>
          					<div className="self-stretch bg-neutral-900/50 flex items-center justify-between p-4 gap-2">
            						<div className="flex-1 relative leading-6 text-sm">AI Assisted Coaching</div>
            						<X className="h-5 w-5 text-neutral-600 shrink-0" />
          					</div>
          					<div className="self-stretch bg-black flex items-center justify-between p-4 gap-2">
            						<div className="flex-1 relative leading-6 text-sm">Few Events</div>
          					</div>
        				</div>
      			</div>
      			<div className="w-full min-h-[102px] py-4 bg-neutral-900 border border-yellow/20 box-border flex flex-col md:flex-row items-center justify-between px-6 md:pl-[120px] md:pr-4 relative isolate gap-4 max-w-[960px] rounded-xl text-center md:text-left">
        				<img className="h-[120px] w-[120px] absolute !m-0 top-[-29px] left-[-4px] object-contain z-[0] shrink-0 hidden md:block" src="/rook.png" alt="Rook" />
        				<div className="flex-1 flex flex-col items-center md:items-start justify-center gap-1 z-[1] shrink-0">
          					<div className="self-stretch relative leading-6 font-semibold text-white text-base md:text-lg">Not sure what’s right for your child?</div>
            						<div className="self-stretch relative text-xs md:text-sm leading-relaxed text-gray-400">Every child learns differently. Talk to our experts and get a personalized learning plan tailored to your child’s level and goals.</div>
            						</div>
            						<button className="[background:linear-gradient(90deg,_#fff200,_#fff87b)_padding-box,_linear-gradient(0deg,_#000,_#fff)_border-box] border border-transparent flex items-center justify-center py-3 px-8 z-[2] shrink-0 text-black font-semibold cursor-pointer rounded transition-transform hover:scale-105 active:scale-95 w-full md:w-auto">
              							Speak to an Advisor
            						</button>
            						</div>
            						</div>);
          					};
          					
export default SystemWorksSection;
