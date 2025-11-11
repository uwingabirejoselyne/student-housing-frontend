import React from 'react';
import { useNavigate } from 'react-router-dom';
import HeroSection from '../components/landing/HeroSection';
import FeaturedListings from '../components/landing/FeaturedListings';
import HowItWorks from '../components/landing/HowItWorks';

const Landing: React.FC = () => {
  const navigate = useNavigate();

  const handleSearch = (query: string, location: string) => {
    // Navigate to search page with query parameters
    const searchParams = new URLSearchParams();
    if (query) searchParams.append('q', query);
    if (location) searchParams.append('location', location);
    navigate(`/search?${searchParams.toString()}`);
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <HeroSection onSearch={handleSearch} />

      {/* Featured Listings */}
      <FeaturedListings />

      {/* How It Works */}
      <HowItWorks />
    </div>
  );
};

export default Landing;
