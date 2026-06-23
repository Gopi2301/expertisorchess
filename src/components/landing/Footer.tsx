import { FunctionComponent } from 'react';

const Footer: FunctionComponent = () => {
  	return (
    		<div className="w-full relative bg-black flex items-start justify-between p-20 box-border gap-5 text-center text-[20px] text-white font-font-awesome-5-brands">
      			<div className="w-[340px] flex flex-col items-start gap-4">
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
        				<div className="relative text-[16px] leading-num-20 font-plus-jakarta-sans whitespace-pre-wrap shrink-0">© 2026 Expertisor Academy Chess.  All Rights Reserved</div>
      			</div>
      			<div className="flex items-start gap-10 text-left text-[16px] font-plus-jakarta-sans">
        				<div className="flex flex-col items-start gap-[13px]">
          					<div className="self-stretch relative leading-6 font-semibold">Products</div>
          					<div className="flex flex-col items-start gap-2 text-num-14 text-gray">
            						<div className="relative leading-num-20">Expertisor Academy</div>
            						<div className="self-stretch relative leading-num-20">Expertisor Jobs</div>
            						<div className="self-stretch relative leading-num-20">Expertisor</div>
            						<div className="self-stretch relative leading-num-20">Expertisor Sites</div>
          					</div>
        				</div>
        				<div className="w-[132px] flex flex-col items-start gap-[13px]">
          					<div className="self-stretch relative leading-6 font-semibold">Resources</div>
          					<div className="self-stretch flex flex-col items-start gap-2 text-num-14 text-gray">
            						<div className="self-stretch relative leading-num-20">Blogs</div>
            						<div className="self-stretch relative leading-num-20">Articles</div>
            						<div className="self-stretch relative leading-num-20">Templates</div>
            						<div className="self-stretch relative leading-num-20">Micro Learning</div>
          					</div>
        				</div>
        				<div className="w-[132px] flex flex-col items-start gap-[13px]">
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
