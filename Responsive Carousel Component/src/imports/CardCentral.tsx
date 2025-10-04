import imgMoonlitRainWeatherIconK022K1 from "figma:asset/bf1a2cc5606758d5adae2f8e7178ec842b5add92.png";

function Frame20() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start not-italic relative shrink-0 w-full">
      <p className="font-['Poppins:Bold',_sans-serif] leading-[normal] relative shrink-0 text-[24px] text-white tracking-[0.48px] w-full">Hello, how are you?</p>
      <p className="font-['Poppins:Regular',_sans-serif] leading-[normal] relative shrink-0 text-[#f6f6f6] text-[16px] tracking-[0.32px] w-full">
        <span>{`You are in `}</span>
        <span className="[text-decoration-skip-ink:none] [text-underline-position:from-font] decoration-solid font-['Poppins:Medium',_sans-serif] not-italic text-[#e7eeff] underline">Uberlândia, MG.</span>
      </p>
    </div>
  );
}

function Frame19() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
      <Frame20 />
    </div>
  );
}

function Frame29() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start not-italic relative shrink-0 w-full">
      <p className="font-['Poppins:SemiBold',_sans-serif] leading-none relative shrink-0 text-[24px] text-nowrap text-white tracking-[0.48px] whitespace-pre">12º</p>
      <p className="font-['Poppins:Regular',_sans-serif] leading-[normal] min-w-full relative shrink-0 text-[#ededed] text-[14px] tracking-[0.28px] w-[min-content]">Tempestade intensa</p>
      <p className="font-['Poppins:SemiBold',_sans-serif] leading-[normal] min-w-full relative shrink-0 text-[18px] text-white tracking-[0.36px] w-[min-content]">19:30 às 21:40</p>
    </div>
  );
}

function Frame22() {
  return (
    <div className="box-border content-stretch flex flex-col gap-[32px] items-start p-[16px] relative rounded-[12px] shrink-0 w-[240px]">
      <div className="h-[62px] relative shrink-0 w-[72px]" data-name="Moonlit Rain Weather Icon.K02.2k 1">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-[161.29%] left-[-19.44%] max-w-none top-[-30.65%] w-[138.89%]" src={imgMoonlitRainWeatherIconK022K1} />
        </div>
      </div>
      <Frame29 />
    </div>
  );
}

function Frame28() {
  return (
    <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full">
      {[...Array(2).keys()].map((_, i) => (
        <Frame22 key={i} />
      ))}
    </div>
  );
}

export default function CardCentral() {
  return (
    <div className="bg-[#01081a] relative rounded-tl-[32px] rounded-tr-[32px] size-full" data-name="card central">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[24px] items-start pb-[40px] pt-[32px] px-[16px] relative size-full">
          <Frame19 />
          <Frame28 />
        </div>
      </div>
    </div>
  );
}