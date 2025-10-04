import imgMoonlitRainWeatherIconK022K1 from "figma:asset/bf1a2cc5606758d5adae2f8e7178ec842b5add92.png";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";
import { useIsMobile } from "./ui/use-mobile";

// Componente do Header
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

// Componente individual do card de clima
function Frame29({ temperature, condition, timeRange }: { temperature: string; condition: string; timeRange: string }) {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start not-italic relative shrink-0 w-full">
      <p className="font-['Poppins:SemiBold',_sans-serif] leading-none relative shrink-0 text-[24px] text-nowrap text-white tracking-[0.48px] whitespace-pre">{temperature}</p>
      <p className="font-['Poppins:Regular',_sans-serif] leading-[normal] min-w-full relative shrink-0 text-[#ededed] text-[14px] tracking-[0.28px] w-[min-content]">{condition}</p>
      <p className="font-['Poppins:SemiBold',_sans-serif] leading-[normal] min-w-full relative shrink-0 text-[18px] text-white tracking-[0.36px] w-[min-content]">{timeRange}</p>
    </div>
  );
}

function Frame22({ temperature, condition, timeRange }: { temperature: string; condition: string; timeRange: string }) {
  const isMobile = useIsMobile();
  
  return (
    <div className={`box-border content-stretch flex flex-col gap-[32px] items-start p-[16px] relative rounded-[12px] shrink-0 bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-sm border border-white/10 ${
      isMobile ? 'w-[200px]' : 'w-[240px]'
    }`}>
      <div className="h-[62px] relative shrink-0 w-[72px]" data-name="Moonlit Rain Weather Icon.K02.2k 1">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-[161.29%] left-[-19.44%] max-w-none top-[-30.65%] w-[138.89%]" src={imgMoonlitRainWeatherIconK022K1} />
        </div>
      </div>
      <Frame29 temperature={temperature} condition={condition} timeRange={timeRange} />
    </div>
  );
}

// Dados de exemplo para o carrossel
const weatherData = [
  { temperature: "12º", condition: "Tempestade intensa", timeRange: "19:30 às 21:40" },
  { temperature: "15º", condition: "Chuva moderada", timeRange: "21:40 às 23:15" },
  { temperature: "18º", condition: "Nublado", timeRange: "23:15 às 01:30" },
  { temperature: "14º", condition: "Garoa", timeRange: "01:30 às 03:45" },
  { temperature: "16º", condition: "Parcialmente nublado", timeRange: "03:45 às 06:00" },
  { temperature: "20º", condition: "Ensolarado", timeRange: "06:00 às 08:30" },
];

// Componente do carrossel responsivo
function Frame28() {
  const isMobile = useIsMobile();
  
  return (
    <div className="content-stretch relative shrink-0 w-full">
      <Carousel
        opts={{
          align: "start",
          loop: true,
          dragFree: true,
          slidesToScroll: isMobile ? 1 : 2,
        }}
        className="w-full"
      >
        <CarouselContent className={isMobile ? "-ml-2" : "-ml-4"}>
          {weatherData.map((weather, index) => (
            <CarouselItem key={index} className={isMobile ? "pl-2 basis-auto" : "pl-4 basis-auto"}>
              <Frame22 
                temperature={weather.temperature}
                condition={weather.condition}
                timeRange={weather.timeRange}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}

export default function ResponsiveWeatherCarousel() {
  return (
    <div className="bg-[#01081a] relative rounded-tl-[32px] rounded-tr-[32px] w-full" data-name="card central">
      <div className="w-full">
        <div className="box-border content-stretch flex flex-col gap-[24px] items-start pt-[32px] px-[16px] pb-[40px] relative w-full">
          <Frame19 />
          <Frame28 />
        </div>
      </div>
    </div>
  );
}