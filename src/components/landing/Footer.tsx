import type { FunctionComponent } from 'react';

const Footer: FunctionComponent = () => {
  	return (
    		<div className="w-full relative bg-black flex flex-col md:flex-row items-center md:items-start justify-between p-10 md:p-20 box-border gap-10 md:gap-5 text-center md:text-left text-[20px] text-white font-inter">
      			<div className="w-full max-w-[340px] flex flex-col items-center md:items-start gap-4 text-center md:text-left">
        				<img className="w-[142px] h-10 relative shrink-0" alt="" src="/logo.svg" />
        				<div className="flex items-start justify-center gap-[5.6px] shrink-0">
          					<div className="flex items-start justify-center py-[5px] px-[13px]">
             						<div className="relative leading-num-20 inline-block overflow-hidden w-5 h-5 shrink-0" />
          					</div>
          					<div className="flex items-start justify-center py-[5px] px-[13px]">
             						<div className="relative leading-num-20 inline-block overflow-hidden w-[13px] h-5 shrink-0" />
          					</div>
          					<div className="flex items-start justify-center py-[5px] px-[13px]">
             						<div className="relative leading-num-20 inline-block overflow-hidden w-[18px] h-5 shrink-0" />
          					</div>
          					<div className="flex items-start justify-center py-[5px] px-[13px]">
             						<div className="relative leading-num-20 inline-block overflow-hidden w-[23px] h-5 shrink-0" />
          					</div>
        				</div>
        				<div className="relative text-[14px] md:text-[16px] leading-num-20 font-plus-jakarta-sans whitespace-pre-wrap shrink-0 opacity-60">© 2026 Expertisor Academy Chess. All Rights Reserved</div>
      			</div>
      			<div className="flex flex-wrap md:flex-nowrap items-start justify-center md:justify-start gap-8 md:gap-10 text-left text-[16px] font-plus-jakarta-sans w-full md:w-auto">
        				<div className="flex flex-col items-start gap-[13px] min-w-[120px]">
          					<div className="self-stretch relative leading-6 font-semibold">Products</div>
          					<div className="flex flex-col items-start gap-2 text-num-14 text-gray">
            						<div className="relative leading-num-20">Expertisor Academy</div>
            						<div className="self-stretch relative leading-num-20">Expertisor Jobs</div>
            						<div className="self-stretch relative leading-num-20">Expertisor</div>
            						<div className="self-stretch relative leading-num-20">Expertisor Sites</div>
          					</div>
        				</div>
        				<div className="flex flex-col items-start gap-[13px] min-w-[120px]">
          					<div className="self-stretch relative leading-6 font-semibold">Resources</div>
          					<div className="self-stretch flex flex-col items-start gap-2 text-num-14 text-gray">
            						<div className="self-stretch relative leading-num-20">Blogs</div>
            						<div className="self-stretch relative leading-num-20">Articles</div>
            						<div className="self-stretch relative leading-num-20">Templates</div>
            						<div className="self-stretch relative leading-num-20">Micro Learning</div>
          					</div>
        				</div>
        				<div className="flex flex-col items-start gap-[13px] min-w-[120px]">
          					<div className="self-stretch relative leading-6 font-semibold">Company</div>
          					<div className="self-stretch flex flex-col items-start gap-2 text-num-14 text-gray">
            						<div className="self-stretch relative leading-num-20">Contact Us</div>
            						<div className="self-stretch relative leading-num-20">About Us</div>
            						<div className="self-stretch relative leading-num-20">Refund Policy</div>
            						<div className="self-stretch relative leading-num-20">FAQs</div>
          					</div>
        				</div>
      			</div>
    		</div>);
};

export default Footer;
