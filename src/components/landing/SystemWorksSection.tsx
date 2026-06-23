import type { FunctionComponent } from 'react';
import { Check, X } from 'lucide-react';

const SystemWorksSection: FunctionComponent = () => {
  	return (
    		<div className="w-full relative flex flex-col items-center py-0 px-[88px] box-border gap-16 text-left text-base text-white font-inter">
      			<div className="flex flex-col items-center text-center text-xs text-yellow">
        				<div className="w-[720px] flex flex-col items-start gap-3">
          					<div className="self-stretch relative tracking-[0.05em] font-medium">WHY THIS SYSTEM WORKS</div>
          					<div className="self-stretch flex flex-col items-start gap-3 text-[40px] text-white font-fox-marilyn">
            						<div className="self-stretch relative">
              							<span>Learning Happens</span>
              							<span className="font-semibold font-inter"> Between Classes, Not Just During Them</span>
            						</div>
            						<div className="self-stretch relative text-base leading-6 font-inter text-gray-100">Expertisor creates a complete learning ecosystem where students continue improving through guided practice, AI assisted reinforcement, progress tracking, tournament experience, and ongoing mentor support.</div>
          					</div>
        				</div>
      			</div>
      			<div className="w-[960px] rounded-2xl bg-black overflow-hidden flex items-center isolate">
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
      			<div className="w-full h-[102px] bg-neutral-900 border border-yellow/20 box-border flex items-center justify-between py-2 pl-[120px] pr-4 relative isolate gap-0 max-w-[960px] rounded-xl">
        				<img className="h-[120px] w-[120px] absolute !m-0 top-[-29px] left-[-4px] object-contain z-[0] shrink-0" src="/rook.png" alt="Rook" />
        				<div className="flex-1 flex flex-col items-start justify-center gap-1 z-[1] shrink-0">
          					<div className="self-stretch relative leading-6 font-semibold text-white">Not sure what’s right for your child?</div>
            						<div className="self-stretch relative text-sm leading-5 text-gray-400">Every child learns differently. Talk to our experts and get a personalized learning plan tailored to your child’s level and goals.</div>
            						</div>
            						<button className="[background:linear-gradient(90deg,_#fff200,_#fff87b)_padding-box,_linear-gradient(0deg,_#000,_#fff)_border-box] border border-transparent flex items-center justify-center py-3 px-8 z-[2] shrink-0 text-black font-semibold cursor-pointer rounded transition-transform hover:scale-105 active:scale-95">
              							Speak to an Advisor
            						</button>
            						</div>
            						</div>);
          					};
          					
export default SystemWorksSection;
