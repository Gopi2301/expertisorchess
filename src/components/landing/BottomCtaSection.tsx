import { FunctionComponent } from 'react';
import { useNavigate } from 'react-router-dom';

const BottomCtaSection: FunctionComponent = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-[350px] md:h-[400px] py-12 md:py-0 relative [background:linear-gradient(79.83deg,_#000,_#22200d_19.64%,_#3f3800_50%,_rgba(34,_32,_13,_0.7)_76.99%,_rgba(0,_0,_0,_0.25)),_linear-gradient(79.83deg,_#000,_#22200d_19.64%,_#3f3800_50%,_#22200d_76.99%,_#000)] flex items-center justify-center box-border isolate text-left text-white font-inter overflow-hidden">
      <div className="w-full h-full absolute !m-0 top-0 left-0 z-[0] pointer-events-none opacity-50">
        <img className="absolute inset-0 w-full h-full object-cover mix-blend-color-dodge" src="/Rectangle 33.png" alt="" />
        <img className="absolute inset-0 w-full h-full object-cover mix-blend-color-dodge" src="/Rectangle 33.png" alt="" />
      </div>
      <div className="w-full max-w-[1200px] px-6 md:px-10 flex flex-col items-center md:items-start text-center md:text-left gap-6 z-[1]">
        <div className="self-stretch flex flex-col items-center md:items-start gap-2">
          <div className="w-full max-w-[860px] relative tracking-[-0.03em] text-2xl md:text-4xl lg:text-[56px] leading-tight md:leading-[64px] inline-block font-semibold">
            <span>{`Every Great Chess Player Starts With `}</span>
            <span className="font-fox-marilyn-strokes text-yellow">One Move</span>
          </div>
          <div className="self-stretch relative text-sm md:text-xl leading-relaxed text-neutral-300">Join a learning ecosystem built to help students improve consistently, think strategically, and achieve their goals.</div>
        </div>
        <div
          onClick={() => navigate('/dashboard')}
          className="[background:linear-gradient(90deg,_#fff200,_#fff87b)_padding-box,_linear-gradient(0deg,_#000,_#fff)_border-box] [border:1px_solid_transparent] flex items-center justify-center py-3 px-8 text-base text-black cursor-pointer font-semibold transition-transform hover:scale-105 active:scale-95 w-full sm:w-auto text-center"
        >
          <div className="relative leading-6">Book Free Assessment Class</div>
        </div>
      </div>
    </div>
  );
};

export default BottomCtaSection;
