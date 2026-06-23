import { useState } from 'react';
import type { FunctionComponent } from 'react';
import { ChevronDown } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const faqData: FaqItem[] = [
  {
    question: "What age groups do you teach?",
    answer: "We teach children from ages 5 to 15. Our curriculum is tailored for different cognitive development stages to ensure every child learns at an optimal pace."
  },
  {
    question: "Are classes online or offline?",
    answer: "Our classes are fully online, conducted live by expert coaches. We use interactive chessboards and digital training tools to ensure an engaging, classroom-like experience from the comfort of your home."
  },
  {
    question: "Do you offer one-on-one coaching?",
    answer: "Yes, we offer both small group batches and personalized one-on-one coaching sessions. One-on-one sessions are customized entirely to the student's current skill level and tournament preparation needs."
  },
  {
    question: "Are tournaments included and what makes Everyday different?",
    answer: "Yes, internal tournaments are included in the curriculum to give students practical playing experience. What makes us different is our daily structured learning path, AI practice tools, and certified professional coaching."
  },
  {
    question: "How is progress tracked and what happens if I miss a class?",
    answer: "We track progress through monthly performance reports and dashboard stats. If your child misses a class, they can access recorded sessions and coordinate with the coach to ensure they stay on track."
  }
];

const FaqSection: FunctionComponent = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleIndex = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full relative flex flex-col items-center py-0 px-4 md:px-[88px] box-border gap-16 text-center text-[12px] text-yellow font-inter">
      <div className="flex flex-col items-center">
        <div className="flex flex-col items-center gap-3">
          <div className="self-stretch relative tracking-[0.05em] font-medium text-center">FAQ</div>
          <div className="flex flex-col items-center justify-center text-2xl md:text-3xl lg:text-[40px] text-white">
            <div className="self-stretch relative leading-[50px] text-center">
              <span className="font-semibold leading-[50px]">Frequently Asked <br /></span>
              <span className="font-fox-marilyn leading-[50px] text-yellow">Questions</span>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col items-start gap-4 max-w-[960px] text-left text-white">
        {faqData.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="self-stretch bg-neutral-900 border-neutral-800 border-solid border-[1px] flex flex-col items-start p-6 md:p-8 gap-4 rounded-xl cursor-pointer hover:border-yellow/30 transition-all duration-300"
              onClick={() => toggleIndex(index)}
            >
              <div className="self-stretch flex items-center justify-between gap-4">
                <div className="flex-1 text-base md:text-lg font-medium relative">{item.question}</div>
                <ChevronDown className={`h-5 w-5 text-yellow shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
              </div>
              <div
                className={`w-full overflow-hidden transition-all duration-300 ease-in-out ${
                  isOpen ? 'max-h-[200px] opacity-100 mt-2' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="self-stretch relative leading-6 text-silver text-sm md:text-base">
                  {item.answer}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FaqSection;
