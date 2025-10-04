import imgMoonlitRainWeatherIconK022K1 from "figma:asset/bf1a2cc5606758d5adae2f8e7178ec842b5add92.png";

interface WeatherCardProps {
  temperature: string;
  condition: string;
  timeRange: string;
  icon?: string;
}

export function WeatherCard({ temperature, condition, timeRange }: WeatherCardProps) {
  return (
    <div className="box-border content-stretch flex flex-col gap-[32px] items-start p-[16px] relative rounded-[12px] shrink-0 w-[240px] bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-sm border border-white/10">
      <div className="h-[62px] relative shrink-0 w-[72px]" data-name="Moonlit Rain Weather Icon.K02.2k 1">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-[161.29%] left-[-19.44%] max-w-none top-[-30.65%] w-[138.89%]" src={imgMoonlitRainWeatherIconK022K1} />
        </div>
      </div>
      <div className="content-stretch flex flex-col gap-[4px] items-start not-italic relative shrink-0 w-full">
        <p className="font-['Poppins:SemiBold',_sans-serif] leading-none relative shrink-0 text-[24px] text-nowrap text-white tracking-[0.48px] whitespace-pre">{temperature}</p>
        <p className="font-['Poppins:Regular',_sans-serif] leading-[normal] min-w-full relative shrink-0 text-[#ededed] text-[14px] tracking-[0.28px] w-[min-content]">{condition}</p>
        <p className="font-['Poppins:SemiBold',_sans-serif] leading-[normal] min-w-full relative shrink-0 text-[18px] text-white tracking-[0.36px] w-[min-content]">{timeRange}</p>
      </div>
    </div>
  );
}