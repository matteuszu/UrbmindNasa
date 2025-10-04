import React from 'react';

export function Header() {
  return (
    <div className="absolute top-3 left-1/2 transform -translate-x-1/2 z-30 w-full max-w-[343px] px-4">
      <div className="backdrop-blur-md bg-black/20 rounded-full h-[68px] flex items-center justify-center px-5">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-white rounded-full"></div>
          <span className="text-white font-semibold text-lg">urbmind</span>
        </div>
      </div>
    </div>
  );
}
