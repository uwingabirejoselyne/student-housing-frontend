import React, { useState } from 'react';
import { Search, MapPin } from 'lucide-react';

interface HeroSectionProps {
  onSearch: (query: string, location: string) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');

  const handleSearch = () => {
    if (searchQuery.trim() || location.trim()) {
      onSearch(searchQuery, location);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <section className="w-full bg-gray-50 pt-24 pb-20">
      <div className=" px-4 sm:px-6 lg:px-8">
        {/* Headline */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Find Your Perfect Student<br />Room Near Campus
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connect with verified landlords and discover safe, affordable housing near
            universities across Rwanda. Your home away from home starts here.
          </p>
        </div>

        {/* Search Bar */}
        <div className="">
          <div className="bg-white rounded-2xl shadow-lg p-4 border border-gray-200">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Input */}
              <div className="flex-1 flex items-center px-4 py-3 bg-gray-50 rounded-xl border border-gray-200">
                <Search className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search by university or area..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full bg-transparent text-gray-900 outline-none placeholder-gray-500"
                />
              </div>

              {/* Location Input */}
              <div className="flex-1 flex items-center px-4 py-3 bg-gray-50 rounded-xl border border-gray-200">
                <MapPin className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Location (e.g., Kigali, Huye)"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full bg-transparent text-gray-900 outline-none placeholder-gray-500"
                />
              </div>

              {/* Search Button */}
              <button
                onClick={handleSearch}
                className="px-8 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors font-medium whitespace-nowrap"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;