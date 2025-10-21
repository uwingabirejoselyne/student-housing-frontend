import React, { useState } from 'react';
import { Search, MapPin, Star, Filter } from 'lucide-react';

const SearchListings: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results] = useState([
    {
      id: '1',
      title: 'Modern Room near University of Rwanda',
      price: 150000,
      location: 'Remera',
      city: 'Kigali',
      rating: 4.8,
      reviewCount: 24,
    },
    {
      id: '2',
      title: 'Shared Apartment near AUCA',
      price: 100000,
      location: 'Gikondo',
      city: 'Kigali',
      rating: 4.5,
      reviewCount: 18,
    },
  ]);

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Search Bar */}
        <div className="py-8">
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex gap-4">
              <div className="flex-1 flex items-center px-4 bg-gray-50 rounded-lg">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search university, location, or property type..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 ml-2 bg-transparent outline-none"
                />
              </div>
              <button className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800">
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-4 sticky top-24">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                <Filter className="w-5 h-5 mr-2" />
                Refine Results
              </h3>
              {/* Add filter options here */}
            </div>
          </div>

          {/* Results List */}
          <div className="lg:col-span-3">
            <div className="space-y-4">
              {results.map((result) => (
                <div key={result.id} className="bg-white rounded-lg p-6 hover:shadow-md transition-shadow flex gap-4">
                  <div className="w-40 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex-shrink-0" />
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{result.title}</h3>
                    <p className="text-gray-600 flex items-center mb-3">
                      <MapPin className="w-4 h-4 mr-1" />
                      {result.location}, {result.city}
                    </p>

                    <div className="flex justify-between items-center">
                      <div className="text-2xl font-bold text-gray-900">
                        {result.price.toLocaleString()} RWF
                      </div>
                      <div className="flex items-center">
                        <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                        <span className="ml-1 text-sm text-gray-700">
                          {result.rating} ({result.reviewCount})
                        </span>
                      </div>
                    </div>
                  </div>

                  <button className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 self-start">
                    View
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchListings;