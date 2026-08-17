import React, { memo } from 'react';
import { motion } from 'framer-motion';

const WeatherApp = () => {
  const currentHour = new Date().getHours();
  const isDay = currentHour >= 6 && currentHour < 18;

  const forecast = [
    { day: 'Mon', temp: '29°', icon: '☀️' },
    { day: 'Tue', temp: '27°', icon: '⛅' },
    { day: 'Wed', temp: '26°', icon: '🌧️' },
    { day: 'Thu', temp: '28°', icon: '🌤️' },
    { day: 'Fri', temp: '30°', icon: '☀️' }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className={`h-full flex flex-col p-4 sm:p-6 overflow-y-auto text-white transition-colors duration-1000 ${isDay ? 'bg-gradient-to-b from-blue-400 to-blue-800' : 'bg-gradient-to-b from-gray-900 to-blue-900'}`}
    >
      <div className="flex-1 flex flex-col items-center justify-center my-4 sm:my-8">
        <h2 className="text-2xl sm:text-3xl font-light mb-2 text-center">Mangalore, India</h2>
        <div className="text-5xl sm:text-6xl mb-3">{isDay ? '☀️' : '🌙'}</div>
        <div className="text-5xl sm:text-7xl font-bold mb-2">28°C</div>
        <div className="text-lg sm:text-xl capitalize">Partly Cloudy</div>
        <div className="text-xs sm:text-sm opacity-80 mt-1">Feels like 31°C</div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 sm:p-4 flex flex-col items-center">
          <span className="text-xs sm:text-sm opacity-70 mb-1">Humidity</span>
          <span className="text-lg sm:text-xl font-semibold">78%</span>
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 sm:p-4 flex flex-col items-center">
          <span className="text-xs sm:text-sm opacity-70 mb-1">Wind</span>
          <span className="text-lg sm:text-xl font-semibold">12 km/h</span>
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 sm:p-4 flex flex-col items-center">
          <span className="text-xs sm:text-sm opacity-70 mb-1">Pressure</span>
          <span className="text-lg sm:text-xl font-semibold">1013 hPa</span>
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 sm:p-4 flex flex-col items-center">
          <span className="text-xs sm:text-sm opacity-70 mb-1">Visibility</span>
          <span className="text-lg sm:text-xl font-semibold">10 km</span>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 sm:p-4 mb-4">
        <h3 className="text-xs sm:text-sm opacity-80 mb-3 font-semibold uppercase tracking-wider">5-Day Forecast</h3>
        <div className="grid grid-cols-5 gap-1 text-center">
          {forecast.map((f, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <span className="text-xs sm:text-sm mb-1">{f.day}</span>
              <span className="text-xl sm:text-2xl mb-1">{f.icon}</span>
              <span className="text-xs sm:text-sm font-semibold">{f.temp}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center text-xs opacity-50 mt-auto pt-4">
        Simulated data
      </div>
    </motion.div>
  );
};

export default memo(WeatherApp);
