import type { FunctionComponent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import SectionContainer from '../../components/landing/SectionContainer';
import LearningSystemSection from '../../components/landing/LearningSystemSection';
import LearningPathSection from '../../components/landing/LearningPathSection';
import SystemWorksSection from '../../components/landing/SystemWorksSection';
import ResultsSection from '../../components/landing/ResultsSection';
import CoachesSection from '../../components/landing/CoachesSection';
import FaqSection from '@/components/landing/FaqSection';
import BottomCtaSection from '../../components/landing/BottomCtaSection';
import Footer from '../../components/landing/Footer';


export const LandingPage: FunctionComponent = () => {
  const navigate = useNavigate();

  return (
    <div className="relative w-screen min-h-screen overflow-x-hidden overflow-y-auto flex flex-col text-white font-inter bg-black">
      {/* Hero Section Container (Full Viewport Height with background) */}
      <div className="relative w-full min-h-screen flex flex-col justify-between shrink-0 z-10">
        {/* Background Image - Confined to Hero section */}
        <picture className="absolute inset-0 w-full h-full z-0">
          {/* Mobile background placeholder */}
          <source media="(max-width: 767px)" srcSet="/hero-bg-mobile.png" />
          <img
            className="w-full h-full object-cover object-center"
            alt="Chess Background"
            src="/Hero-bg.webp"
          />
        </picture>

        {/* Navigation Header */}
        <header className="w-full relative bg-black flex items-center justify-between py-4 px-4 md:px-10 box-border isolate gap-5 text-left text-[16px] text-black font-inter z-10">
          <img
            className="h-8 md:h-10 w-[114px] md:w-[142px] relative z-[0] shrink-0 cursor-pointer object-contain"
            alt="Expertisor Academy for Chess Logo"
            src="/logo.svg"
            onClick={() => navigate('/')}
          />
          <div className="flex items-center gap-2 z-[1] shrink-0">
            <div
              onClick={() => navigate('/dashboard')}
              className="[background:linear-gradient(90deg,_#fff200,_#fff87b),_linear-gradient(#fff200,_#fff200)] flex items-center justify-center py-2 md:py-3 px-3 md:px-4 shrink-0 cursor-pointer"
            >
              <div className="relative text-[12px] md:text-xs leading-5 font-semibold">Book Free Assessment</div>
            </div>
            <div
              onClick={() => navigate('/dashboard')}
              className="bg-yellow hidden items-center justify-center py-[10.5px] px-[21.5px] shrink-0 font-gordita cursor-pointer"
            >
              <div className="relative font-medium">Join Academy</div>
            </div>
          </div>
          <nav className="!m-0 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-neutral-900 border border-neutral-800 hidden lg:flex items-center justify-center p-1 gap-2 z-[2] shrink-0 text-white">
            <div className="rounded-sm [background:linear-gradient(180deg,_rgba(0,_0,_0,_0.1),_rgba(255,_242,_0,_0.1)),_linear-gradient(#282828,_#282828)] border-neutral-700 border-solid border-[1px] flex items-center justify-center py-3 px-3 cursor-pointer">
              <div className="relative leading-5">Home</div>
            </div>
            <div className="relative leading-5 font-gordita hidden">Webinar</div>
            <div className="h-[43px] rounded-sm flex items-center justify-center py-3 px-3 box-border cursor-pointer hover:bg-neutral-800 transition-colors">
              <div className="relative leading-5">Learning System</div>
            </div>
            <div className="h-[43px] rounded-sm flex items-center justify-center py-3 px-3 box-border cursor-pointer hover:bg-neutral-800 transition-colors">
              <div className="relative leading-5">Courses</div>
            </div>
            <div className="h-[43px] rounded-sm flex items-center justify-center py-3 px-3 box-border cursor-pointer hover:bg-neutral-800 transition-colors">
              <div className="relative leading-5">Network</div>
            </div>
            <div className="h-[43px] rounded-sm flex items-center justify-center py-3 px-3 box-border cursor-pointer hover:bg-neutral-800 transition-colors">
              <div className="relative leading-5">Jobs</div>
            </div>
            <div className="h-[43px] rounded-sm flex items-center justify-center py-3 px-3 box-border cursor-pointer hover:bg-neutral-800 transition-colors">
              <div className="relative leading-5">Events</div>
            </div>
            <div className="h-[43px] rounded-sm flex items-center justify-center py-3 px-3 box-border cursor-pointer hover:bg-neutral-800 transition-colors">
              <div className="relative leading-5">Contact Us</div>
            </div>
          </nav>
        </header>

        {/* Hero Section using user's exact structure & classes */}
        <main className="flex-1 flex flex-col items-center justify-center py-8 z-10">
          <div className="w-full relative flex flex-col items-center justify-center gap-6 md:gap-10 text-center text-white font-inter px-4 box-border">
            <div className="self-stretch flex flex-col items-center justify-center gap-4">
              <div className="self-stretch flex flex-col items-center">
                <div className="flex flex-wrap items-baseline justify-center gap-x-2 gap-y-1">
                  <div className="relative leading-tight md:leading-num-64 font-semibold text-2xl md:text-5xl lg:text-num-56">Help Your Child Become More</div>
                  <div className="relative leading-tight md:leading-num-64 font-fox-marilyn-local font-normal text-yellow text-2xl md:text-5xl lg:text-num-56">Focused,</div>
                </div>
                <div className="flex flex-wrap items-baseline justify-center gap-x-2 gap-y-1 text-yellow font-fox-marilyn-local font-normal text-2xl md:text-5xl lg:text-num-56">
                  <div className="relative leading-tight md:leading-num-64">Confident</div>
                  <div className="relative leading-tight md:leading-num-64 font-semibold font-inter text-white">and</div>
                  <div className="relative leading-tight md:leading-num-64">Strategic</div>
                  <div className="relative leading-tight md:leading-num-64 font-semibold font-inter text-white">Through</div>
                </div>
                <div className="relative leading-tight md:leading-num-64 font-semibold text-2xl md:text-5xl lg:text-num-56">Structured Chess Learning</div>
              </div>
              <div className="w-full relative text-sm md:text-[18px] leading-relaxed text-silver inline-block max-w-[960px] px-2">
                Expert led chess training supported by AI powered practice tools, personalized progress tracking, and guided tournaments designed to build real thinking skills that improve both chess performance and life skills.
              </div>
            </div>

            <div className="flex flex-col items-center gap-4 text-left text-sm md:text-[16px] text-black w-full">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-lg">
                <div
                  onClick={() => navigate('/dashboard')}
                  className="[background:linear-gradient(90deg,_#fff200,_#fff87b)_padding-box,_linear-gradient(0deg,_#000,_#fff)_border-box] [border:1px_solid_transparent] flex items-center justify-center py-3 px-6 md:px-8 cursor-pointer transition-transform hover:scale-105 active:scale-95 w-full sm:w-auto text-center"
                >
                  <div className="relative leading-6 font-semibold text-xs text-center w-full">Book Free Assessment Class</div>
                </div>
                <div
                  onClick={() => navigate('/dashboard')}
                  className="[background:linear-gradient(180deg,_#222,_#141414)] border-darkslategray border-solid border-[1px] flex items-center justify-center py-3 px-6 md:px-8 text-white cursor-pointer transition-transform hover:scale-105 active:scale-95 w-full sm:w-auto text-center"
                >
                  <div className="relative leading-6 font-medium text-xs text-center w-full">See How Learning Works</div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center p-2 gap-4 md:gap-6 text-center text-xs md:text-num-14 text-darkgray">
                <div className="flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-sm bg-yellow flex items-center justify-center text-black">
                    <Check size={12} strokeWidth={3} />
                  </span>
                  <div className="relative">Live Classes</div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-sm bg-yellow flex items-center justify-center text-black">
                    <Check size={12} strokeWidth={3} />
                  </span>
                  <div className="relative">Progress Tracking</div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-sm bg-yellow flex items-center justify-center text-black">
                    <Check size={12} strokeWidth={3} />
                  </span>
                  <div className="relative">AI Practice Support</div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-sm bg-yellow flex items-center justify-center text-black">
                    <Check size={12} strokeWidth={3} />
                  </span>
                  <div className="relative">FEDA Rated Coaches</div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <footer className="w-full min-h-[65px] py-2 md:py-0 relative [background:linear-gradient(91.18deg,_rgba(0,_0,_0,_0.85),_rgba(34,_32,_13,_0.85)_19.64%,_rgba(63,_56,_0,_0.85)_50%,_rgba(34,_32,_13,_0.85)_76.99%,_rgba(0,_0,_0,_0.85))] text-center text-num-40 text-white font-inter z-10 flex items-center justify-center">
          <div className="w-full max-w-[1200px] px-2 md:px-10 flex flex-row items-center justify-between gap-2 md:gap-5">
            <div className="flex flex-col items-center justify-center gap-[5px] flex-1 min-w-0 md:min-w-[120px]">
              <b className="self-stretch relative font-inter font-bold text-lg md:text-num-40 leading-none tracking-num--0_05 text-center text-transparent !bg-clip-text [background:linear-gradient(180deg,_#fffa99,_#dbd000)] [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]">100+</b>
              <div className="self-stretch relative text-[10px] md:text-num-14 opacity-num-0_5 text-center">Students Trained</div>
            </div>
            <div className="flex flex-col items-center justify-center gap-[5px] flex-1 min-w-0 md:min-w-[120px]">
              <b className="self-stretch relative font-inter font-bold text-lg md:text-num-40 leading-none tracking-num--0_05 text-center text-transparent !bg-clip-text [background:linear-gradient(180deg,_#fffa99,_#dbd000)] [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]">FIDE</b>
              <div className="self-stretch relative text-[10px] md:text-num-14 opacity-num-0_5 text-center">Certified Coaches</div>
            </div>
            <div className="hidden md:flex flex-col items-center justify-center gap-[5px] flex-1 min-w-0 md:min-w-[150px]">
              <b className="self-stretch relative font-inter font-bold text-lg md:text-num-40 leading-none tracking-num--0_05 text-center text-transparent !bg-clip-text [background:linear-gradient(180deg,_#fffa99,_#dbd000)] [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]">40+</b>
              <div className="self-stretch relative text-[10px] md:text-num-14 opacity-num-0_5 text-center">Free Tournaments</div>
            </div>
            <div className="flex flex-col items-center justify-center gap-[5px] flex-1 min-w-0 md:min-w-[180px]">
              <div className="flex items-center justify-center gap-1">
                <b className="relative font-inter font-bold text-lg md:text-num-40 leading-none tracking-num--0_05 text-center text-transparent !bg-clip-text [background:linear-gradient(180deg,_#fffa99,_#dbd000)] [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]">4.8</b>
                <img className="h-3.5 w-3.5 md:h-6 md:w-6 relative" alt="Star" src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23fffa99'><path d='M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z'/></svg>" />
              </div>
              <div className="self-stretch relative text-[10px] md:text-num-14 opacity-num-0_5 text-center">{`Ratings`}</div>
            </div>
            <div className="hidden md:flex flex-col items-center justify-center gap-[5px] flex-1 min-w-0 md:min-w-[100px]">
              <b className="self-stretch relative font-inter font-bold text-lg md:text-num-40 leading-none tracking-num--0_05 text-center text-transparent !bg-clip-text [background:linear-gradient(180deg,_#fffa99,_#dbd000)] [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]">2</b>
              <div className="self-stretch relative text-[10px] md:text-num-14 opacity-num-0_5 text-center">Countries</div>
            </div>
          </div>
        </footer>
      </div>

      {/* New Section Container (Scrollable below Hero) */}
      <div className="w-full bg-black py-12 md:py-24 px-4 md:px-10 flex justify-center z-10">
        <div className="w-full max-w-[1200px]">
          <SectionContainer />
        </div>
      </div>

      {/* Learning System Section */}
      <div className="w-full bg-black py-12 md:py-24 px-4 md:px-10 flex justify-center z-10">
        <div className="w-full max-w-[1200px]">
          <LearningSystemSection />
        </div>
      </div>
      {/* Learning Path Section */}
      <div className="w-full bg-black py-12 md:py-24 px-4 md:px-10 flex justify-center z-10">
        <div className="w-full max-w-[1200px]">
          <LearningPathSection />
        </div>
      </div>
      {/* System Works */}
      <div className="w-full bg-black py-12 md:py-24 px-4 md:px-10 flex justify-center z-10">
        <div className="w-full max-w-[1200px]">
          <SystemWorksSection />
        </div>
      </div>
      {/* Results */}
      <div className="w-full bg-black py-12 md:py-24 px-4 md:px-10 flex justify-center z-10">
        <div className="w-full max-w-[1200px]">
          <ResultsSection />
        </div>
      </div>
      {/* our coaches */}
      <div className="w-full bg-black py-12 md:py-24 px-4 md:px-10 flex justify-center z-10">
        <div className="w-full max-w-[1200px]">
          <CoachesSection />
        </div>
      </div>
      {/* FAQ */}
      <div className="w-full bg-black py-12 md:py-24 px-4 md:px-10 flex justify-center z-10">
        <div className="w-full max-w-[1200px]">
          <FaqSection />
        </div>
      </div>
      {/* Bottom CTA */}
      <div className="w-full z-10">
        <BottomCtaSection />
      </div>
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;
