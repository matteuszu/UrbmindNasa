import ResponsiveWeatherCarousel from "./components/ResponsiveWeatherCarousel";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <ResponsiveWeatherCarousel />
      </div>
    </div>
  );
}