import type { FunctionComponent } from 'react';

const Frame: FunctionComponent = () => {
	return (
		<div className="relative w-full flex flex-col items-start pt-3 px-0 pb-0 box-border text-center text-sm text-darkgray font-inter">
			<div className="[background:linear-gradient(180deg,_#191900,_#161500)] flex items-center p-4 gap-6">
				<div className="flex items-center gap-1 shrink-0">
					<img src="/checkBox.svg" alt="" />
					<div className="relative">Improved concentration</div>
				</div>
				<div className="flex items-center gap-1 shrink-0">
					<img src="/checkBox.svg" alt="" />
					<div className="relative">Greater Discipline</div>
				</div>
				<div className="hidden items-center gap-1 shrink-0">
					<img src="/checkBox.svg" alt="" />
					<div className="relative">Higher Confidence</div>
				</div>
				<div className="hidden items-center gap-1 shrink-0">
					<img src="/checkBox.svg" alt="" />
					<div className="relative">Recorded Lessons</div>
				</div>
				<div className="flex items-center gap-1 shrink-0">
					<img src="/checkBox.svg" alt="" />
					<div className="relative">Academic Growth</div>
				</div>
				<div className="flex items-center gap-1 shrink-0">
					<img src="/checkBox.svg" alt="" />
					<div className="relative">Better Decisions</div>
				</div>
			</div>
		</div>);
};

export default Frame;
