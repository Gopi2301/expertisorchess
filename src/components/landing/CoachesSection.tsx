import type { FunctionComponent } from 'react';

const CoachesSection: FunctionComponent = () => {
  return (
    <div className="w-full relative overflow-hidden flex flex-col items-start py-0 px-[88px] box-border gap-16 text-left text-[12px] text-yellow font-inter">
      <div className="w-[1264px] flex items-end justify-between gap-0 shrink-0">
        <div className="flex-1 flex flex-col items-start gap-3">
          <div className="self-stretch relative tracking-[0.05em] font-medium">OUR COACHES</div>
          <div className="self-stretch flex flex-col items-start relative isolate gap-3 text-[40px] text-white">
            <div className="w-[675px] relative leading-[56px] inline-block z-[0] shrink-0">
              <span className="font-semibold leading-[56px]">{`Meet Our `}</span>
              <span className="font-fox-marilyn-strokes leading-[56px]">Expert Mentors</span>
              <span className="font-semibold leading-[56px]"><br />Helping Your Child Master Chess</span>
            </div>
            <img className="w-[130px] h-[107px] absolute !m-0 bottom-[-2px] left-[1074px] object-cover z-[1] shrink-0" src="/Sticker.png" alt="Decoration" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <img className="h-10 w-10 relative object-cover cursor-pointer hover:opacity-80 transition-opacity" src="/buttonLeft.svg" alt="Previous" />
          <img className="h-10 w-10 relative object-cover cursor-pointer hover:opacity-80 transition-opacity" src="/buttonRight.svg" alt="Next" />
        </div>
      </div>

      <div className="w-full h-[640px] overflow-x-auto overflow-y-hidden shrink-0 grid box-border grid-cols-[408.67px_408.67px_408.67px_408.7px] grid-rows-[1fr] [column-gap:20px] text-[24px] text-white">
        {/* Coach 1 */}
        <div className="w-[408.7px] bg-[#171717]  box-border flex flex-col items-center justify-center p-6 gap-6 col-[1] row-[1]">
          <img className="self-stretch flex-1 relative max-w-full overflow-hidden max-h-full object-cover rounded" src="/coach1.png" alt="Vishal Singh" />
          <div className="self-stretch flex flex-col items-start justify-center gap-3">
            <div className="self-stretch flex flex-col items-start gap-1">
              <b className="self-stretch relative">Vishal Singh</b>
              <div className="self-stretch relative text-num-14 text-yellow">FIDE Rated | 5 Years | International Master</div>
            </div>
            <div className="self-stretch relative text-num-14 leading-5 text-silver [display:-webkit-inline-box] overflow-hidden text-ellipsis [-webkit-line-clamp:3] [-webkit-box-orient:vertical]">Specializes in opening theory and middle-game tactics. Vishal has coached over 50 state-level junior champions.</div>
            <div className="flex items-center gap-2">
              <div className="bg-[#262626] border-[#515151] border-solid border-[0.8px] flex items-center p-2 cursor-pointer hover:bg-neutral-800 transition-colors">
                <svg className="h-[18px] w-[18px] text-silver fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </div>
              <div className="bg-[#262626] border-[#515151] border-solid border-[0.8px] flex items-center p-2 cursor-pointer hover:bg-neutral-800 transition-colors">
                <svg className="h-[18px] w-[18px] text-silver fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </div>
              <div className="bg-[#262626] border-[#515151] border-solid border-[0.8px] flex items-center p-2 cursor-pointer hover:bg-neutral-800 transition-colors">
                <svg className="h-[18px] w-[18px] text-silver" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="2" y1="12" x2="22" y2="12"></line>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Coach 2 */}
        <div className="w-[408.7px] bg-[#171717]  box-border flex flex-col items-center justify-center p-6 gap-6 col-[2] row-[1]">
          <img className="self-stretch flex-1 relative max-w-full overflow-hidden max-h-full object-cover rounded" src="/coach2.png" alt="Elena Rodriguez" />
          <div className="self-stretch flex flex-col items-start justify-center gap-3">
            <div className="self-stretch flex flex-col items-start gap-1">
              <b className="self-stretch relative">Elena Rodriguez</b>
              <div className="self-stretch relative text-num-14 text-yellow">FIDE Certified | 8 Years | WFM</div>
            </div>
            <div className="self-stretch relative text-num-14 leading-5 text-silver [display:-webkit-inline-box] overflow-hidden text-ellipsis [-webkit-line-clamp:3] [-webkit-box-orient:vertical]">Expert in positional chess and endgame precision. Elena focuses on developing structural thinking skills in young learners.</div>
            <div className="flex items-center gap-2">
              <div className="bg-[#262626] border-[#515151] border-solid border-[0.8px] flex items-center p-2 cursor-pointer hover:bg-neutral-800 transition-colors">
                <svg className="h-[18px] w-[18px] text-silver fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </div>
              <div className="bg-[#262626] border-[#515151] border-solid border-[0.8px] flex items-center p-2 cursor-pointer hover:bg-neutral-800 transition-colors">
                <svg className="h-[18px] w-[18px] text-silver fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </div>
              <div className="bg-[#262626] border-[#515151] border-solid border-[0.8px] flex items-center p-2 cursor-pointer hover:bg-neutral-800 transition-colors">
                <svg className="h-[18px] w-[18px] text-silver" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="2" y1="12" x2="22" y2="12"></line>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Coach 3 */}
        <div className="w-[408.7px] bg-[#171717] box-border flex flex-col items-center justify-center p-6 gap-6 col-[3] row-[1]">
          <img className="self-stretch flex-1 relative max-w-full overflow-hidden max-h-full object-cover rounded" src="/coach3.png" alt="Marcus Chen" />
          <div className="self-stretch flex flex-col items-start justify-center gap-3">
            <div className="self-stretch flex flex-col items-start gap-1">
              <b className="self-stretch relative">Marcus Chen</b>
              <div className="self-stretch relative text-num-14 text-yellow">National Master | 12 Years Experience</div>
            </div>
            <div className="self-stretch relative text-num-14 leading-5 text-silver [display:-webkit-inline-box] overflow-hidden text-ellipsis [-webkit-line-clamp:3] [-webkit-box-orient:vertical]">Dedicated to the psychological side of chess: patience, decision making, and emotional control under tournament pressure.</div>
            <div className="flex items-center gap-2">
              <div className="bg-[#262626] border-[#515151] border-solid border-[0.8px] flex items-center p-2 cursor-pointer hover:bg-neutral-800 transition-colors">
                <svg className="h-[18px] w-[18px] text-silver fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </div>
              <div className="bg-[#262626] border-[#515151] border-solid border-[0.8px] flex items-center p-2 cursor-pointer hover:bg-neutral-800 transition-colors">
                <svg className="h-[18px] w-[18px] text-silver fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </div>
              <div className="bg-[#262626] border-[#515151] border-solid border-[0.8px] flex items-center p-2 cursor-pointer hover:bg-neutral-800 transition-colors">
                <svg className="h-[18px] w-[18px] text-silver" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="2" y1="12" x2="22" y2="12"></line>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Coach 4 */}
        <div className="w-[408.7px] bg-[#171717] box-border flex flex-col items-center justify-center p-6 gap-6 col-[4] row-[1]">
          <img className="self-stretch flex-1 relative max-w-full overflow-hidden max-h-full object-cover rounded" src="/coach1.png" alt="Marcus Chen" />
          <div className="self-stretch flex flex-col items-start justify-center gap-3">
            <div className="self-stretch flex flex-col items-start gap-1">
              <b className="self-stretch relative">Marcus Chen</b>
              <div className="self-stretch relative text-num-14 text-yellow">National Master | 12 Years Experience</div>
            </div>
            <div className="self-stretch relative text-num-14 leading-5 text-silver [display:-webkit-inline-box] overflow-hidden text-ellipsis [-webkit-line-clamp:3] [-webkit-box-orient:vertical]">Dedicated to the psychological side of chess: patience, decision making, and emotional control under tournament pressure.</div>
            <div className="flex items-center gap-2">
              <div className="bg-[#262626] border-[#515151] border-solid border-[0.8px] flex items-center p-2 cursor-pointer hover:bg-neutral-800 transition-colors">
                <svg className="h-[18px] w-[18px] text-silver fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </div>
              <div className="bg-[#262626] border-[#515151] border-solid border-[0.8px] flex items-center p-2 cursor-pointer hover:bg-neutral-800 transition-colors">
                <svg className="h-[18px] w-[18px] text-silver fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </div>
              <div className="bg-[#262626] border-[#515151] border-solid border-[0.8px] flex items-center p-2 cursor-pointer hover:bg-neutral-800 transition-colors">
                <svg className="h-[18px] w-[18px] text-silver" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="2" y1="12" x2="22" y2="12"></line>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoachesSection;
