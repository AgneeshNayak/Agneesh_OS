import { useState, useEffect, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// WMO Weather Interpretation Code mapper
const getWeatherDetails = (code, isDay = 1) => {
  switch (code) {
    case 0:
      return { condition: 'Clear Sky', icon: isDay ? '☀️' : '🌙' };
    case 1:
      return { condition: 'Mainly Clear', icon: isDay ? '🌤️' : '🌙' };
    case 2:
      return { condition: 'Partly Cloudy', icon: isDay ? '⛅' : '☁️' };
    case 3:
      return { condition: 'Overcast', icon: '☁️' };
    case 45:
    case 48:
      return { condition: 'Foggy', icon: '🌫️' };
    case 51:
    case 53:
    case 55:
      return { condition: 'Light Drizzle', icon: '🌧️' };
    case 56:
    case 57:
      return { condition: 'Freezing Drizzle', icon: '🌧️' };
    case 61:
    case 63:
      return { condition: 'Rainy', icon: '🌧️' };
    case 65:
      return { condition: 'Heavy Rain', icon: '🌧️' };
    case 66:
    case 67:
      return { condition: 'Freezing Rain', icon: '🌧️' };
    case 71:
    case 73:
    case 75:
    case 77:
      return { condition: 'Snowfall', icon: '❄️' };
    case 80:
    case 81:
    case 82:
      return { condition: 'Rain Showers', icon: '🌦️' };
    case 85:
    case 86:
      return { condition: 'Snow Showers', icon: '🌨️' };
    case 95:
    case 96:
    case 99:
      return { condition: 'Thunderstorm', icon: '⛈️' };
    default:
      return { condition: 'Partly Cloudy', icon: isDay ? '⛅' : '🌙' };
  }
};

const DEFAULT_LOCATION = {
  name: 'Mangalore, India',
  lat: 12.9141,
  lon: 74.8560,
};

const POPULAR_CITIES = [
  { name: 'Mangalore', lat: 12.9141, lon: 74.8560 },
  { name: 'Bengaluru', lat: 12.9716, lon: 77.5946 },
  { name: 'Mumbai', lat: 19.0760, lon: 72.8777 },
  { name: 'Delhi', lat: 28.6139, lon: 77.2090 },
  { name: 'London', lat: 51.5074, lon: -0.1278 },
  { name: 'New York', lat: 40.7128, lon: -74.0060 },
];

const WeatherApp = () => {
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchWeather = useCallback(async (lat, lon) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,surface_pressure,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`
      );
      if (!res.ok) throw new Error('Failed to fetch weather data');
      const data = await res.json();
      setWeatherData(data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error(err);
      setError('Unable to load realtime weather data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWeather(location.lat, location.lon);
  }, [location, fetchWeather]);

  const handleGeolocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const userLoc = {
            name: 'Your Location',
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
          };
          setLocation(userLoc);
        },
        () => {
          fetchWeather(location.lat, location.lon);
        }
      );
    }
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const res = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchQuery)}&count=5&language=en&format=json`
      );
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        setSearchResults(data.results);
      } else {
        setSearchResults([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const selectCity = (city) => {
    const locName = `${city.name}${city.admin1 ? ', ' + city.admin1 : ''}, ${city.country}`;
    setLocation({
      name: locName,
      lat: city.latitude,
      lon: city.longitude,
    });
    setSearchQuery('');
    setSearchResults([]);
  };

  const isDay = weatherData?.current ? weatherData.current.is_day === 1 : (new Date().getHours() >= 6 && new Date().getHours() < 18);
  const currentCondition = weatherData?.current ? getWeatherDetails(weatherData.current.weather_code, weatherData.current.is_day) : { condition: 'Partly Cloudy', icon: isDay ? '☀️' : '🌙' };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`h-full flex flex-col p-4 sm:p-6 overflow-y-auto text-white transition-colors duration-1000 font-sans ${
        isDay
          ? 'bg-gradient-to-b from-sky-600 via-blue-700 to-indigo-900'
          : 'bg-gradient-to-b from-gray-950 via-slate-900 to-indigo-950'
      }`}
    >
      {/* Header & Search Controls */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>REALTIME WEATHER</span>
          </div>
          
          <button
            onClick={() => fetchWeather(location.lat, location.lon)}
            disabled={loading}
            className="text-xs font-mono bg-white/10 hover:bg-white/20 active:scale-95 px-3 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
            title="Refresh weather data"
          >
            <span>↻</span>
            <span>{loading ? 'Updating...' : 'Refresh'}</span>
          </button>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search any city worldwide..."
              className="flex-1 bg-black/30 border border-white/20 focus:border-white/50 text-white placeholder-white/50 text-xs sm:text-sm rounded-xl px-3.5 py-2 outline-none transition-all font-mono"
            />
            <button
              type="submit"
              className="bg-white/20 hover:bg-white/30 text-white text-xs px-3.5 py-2 rounded-xl font-mono cursor-pointer transition-all"
            >
              {isSearching ? '...' : 'Search'}
            </button>
            <button
              type="button"
              onClick={handleGeolocation}
              className="bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-300 text-xs px-3 py-2 rounded-xl font-mono cursor-pointer transition-all flex items-center gap-1"
              title="Use current location"
            >
              📍
            </button>
          </div>

          {/* Search Dropdown Results */}
          <AnimatePresence>
            {searchResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="absolute left-0 right-0 top-full mt-2 bg-slate-900/95 border border-white/20 rounded-xl overflow-hidden shadow-2xl z-50 backdrop-blur-xl"
              >
                {searchResults.map((city) => (
                  <button
                    key={`${city.id}-${city.latitude}`}
                    type="button"
                    onClick={() => selectCity(city)}
                    className="w-full text-left px-4 py-2.5 text-xs sm:text-sm hover:bg-white/10 text-gray-200 border-b border-white/5 last:border-none cursor-pointer flex items-center justify-between"
                  >
                    <span className="font-semibold">{city.name}</span>
                    <span className="text-[11px] text-gray-400 font-mono">
                      {city.admin1 ? `${city.admin1}, ` : ''}{city.country}
                    </span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </form>

        {/* Quick Location Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-[11px] font-mono">
          {POPULAR_CITIES.map((c) => (
            <button
              key={c.name}
              onClick={() => {
                setLocation({ name: `${c.name}, India`, lat: c.lat, lon: c.lon });
              }}
              className={`px-2.5 py-0.5 rounded-full border transition-all cursor-pointer whitespace-nowrap ${
                location.name.includes(c.name)
                  ? 'bg-white/30 border-white/60 font-bold'
                  : 'bg-white/5 border-white/15 text-white/70 hover:bg-white/15'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Display */}
      {loading && !weatherData ? (
        <div className="flex-1 flex flex-col items-center justify-center space-y-3 py-12">
          <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin" />
          <p className="text-xs font-mono opacity-80">Fetching realtime weather...</p>
        </div>
      ) : error ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <span className="text-4xl mb-3">⚠️</span>
          <p className="text-sm font-mono text-red-200 mb-4">{error}</p>
          <button
            onClick={() => fetchWeather(location.lat, location.lon)}
            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl text-xs font-mono cursor-pointer"
          >
            Retry
          </button>
        </div>
      ) : (
        <>
          <div className="flex-1 flex flex-col items-center justify-center my-3 sm:my-6 text-center">
            <h2 className="text-xl sm:text-2xl font-medium tracking-wide mb-1 opacity-90">
              {location.name}
            </h2>
            <div className="text-6xl sm:text-7xl my-2 filter drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
              {currentCondition.icon}
            </div>
            <div className="text-6xl sm:text-7xl font-extrabold tracking-tight my-1">
              {Math.round(weatherData.current.temperature_2m)}°C
            </div>
            <div className="text-base sm:text-lg font-medium capitalize tracking-wide text-white/90">
              {currentCondition.condition}
            </div>
            <div className="text-xs sm:text-sm text-white/70 font-mono mt-1">
              Feels like {Math.round(weatherData.current.apparent_temperature)}°C
            </div>
          </div>

          {/* Grid Metrics */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5 mb-5">
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-3 flex flex-col items-center justify-center">
              <span className="text-[11px] sm:text-xs opacity-70 mb-1 font-mono uppercase tracking-wider">Humidity</span>
              <span className="text-lg sm:text-xl font-bold font-mono">{weatherData.current.relative_humidity_2m}%</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-3 flex flex-col items-center justify-center">
              <span className="text-[11px] sm:text-xs opacity-70 mb-1 font-mono uppercase tracking-wider">Wind</span>
              <span className="text-lg sm:text-xl font-bold font-mono">{Math.round(weatherData.current.wind_speed_10m)} km/h</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-3 flex flex-col items-center justify-center">
              <span className="text-[11px] sm:text-xs opacity-70 mb-1 font-mono uppercase tracking-wider">Pressure</span>
              <span className="text-lg sm:text-xl font-bold font-mono">{Math.round(weatherData.current.surface_pressure)} hPa</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-3 flex flex-col items-center justify-center">
              <span className="text-[11px] sm:text-xs opacity-70 mb-1 font-mono uppercase tracking-wider">Precipitation</span>
              <span className="text-lg sm:text-xl font-bold font-mono">{weatherData.current.precipitation} mm</span>
            </div>
          </div>

          {/* 7-Day Realtime Forecast */}
          {weatherData.daily && (
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-3.5 mb-2">
              <h3 className="text-xs opacity-80 mb-3 font-semibold font-mono uppercase tracking-wider">
                Realtime 7-Day Forecast
              </h3>
              <div className="grid grid-cols-7 gap-1 text-center">
                {weatherData.daily.time.slice(0, 7).map((dateStr, idx) => {
                  const dateObj = new Date(dateStr);
                  const dayName = idx === 0 ? 'Today' : dateObj.toLocaleDateString('en-US', { weekday: 'short' });
                  const cond = getWeatherDetails(weatherData.daily.weather_code[idx], 1);
                  const maxT = Math.round(weatherData.daily.temperature_2m_max[idx]);
                  const minT = Math.round(weatherData.daily.temperature_2m_min[idx]);

                  return (
                    <div key={dateStr} className="flex flex-col items-center py-1 rounded-lg hover:bg-white/5 transition-colors">
                      <span className="text-[10px] sm:text-xs font-mono font-medium mb-1 opacity-90">{dayName}</span>
                      <span className="text-base sm:text-xl mb-1">{cond.icon}</span>
                      <span className="text-[11px] sm:text-xs font-bold font-mono">{maxT}°</span>
                      <span className="text-[9px] sm:text-[10px] font-mono opacity-60">{minT}°</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}

      {/* Footer Timestamp */}
      <div className="text-center text-[10px] font-mono opacity-50 mt-auto pt-2 flex items-center justify-between">
        <span>Source: Open-Meteo Live API</span>
        {lastUpdated && <span>Updated: {lastUpdated.toLocaleTimeString()}</span>}
      </div>
    </motion.div>
  );
};

export default memo(WeatherApp);
