export function TestDashboard() {
  return (
    <div className="w-full h-screen bg-[#01081a] flex flex-col items-center justify-center">
      <div className="text-white text-4xl font-bold mb-4">
        🎉 Dashboard do Figma Funcionando! 🎉
      </div>
      <div className="text-white text-lg">
        Se você está vendo isso, o novo dashboard está funcionando!
      </div>
      <div className="mt-8 p-6 bg-white/10 rounded-xl backdrop-blur-sm">
        <h2 className="text-white text-2xl font-bold mb-4">Hello, how are you?</h2>
        <p className="text-[#f6f6f6] text-base mb-4">
          You are in <span className="text-[#e7eeff] underline font-medium">Uberlândia, MG</span>
        </p>
        <div className="flex gap-4">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <div className="text-4xl mb-2">🌧️</div>
            <p className="text-white text-2xl font-semibold">12º</p>
            <p className="text-[#ededed] text-sm">Tempestade intensa</p>
            <p className="text-white text-lg font-semibold">19:30 às 21:40</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <div className="text-4xl mb-2">⛅</div>
            <p className="text-white text-2xl font-semibold">18º</p>
            <p className="text-[#ededed] text-sm">Parcialmente nublado</p>
            <p className="text-white text-lg font-semibold">22:00 às 06:00</p>
          </div>
        </div>
      </div>
    </div>
  );
}

