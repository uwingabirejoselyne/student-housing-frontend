import React from 'react';
import { Search, Shield, Users, Home } from 'lucide-react';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: Search,
      title: 'Search',
      description: 'Find housing near your university using our smart search filters',
    },
    {
      icon: Shield,
      title: 'Verify',
      description: 'Browse verified listings with real photos and honest reviews',
    },
    {
      icon: Users,
      title: 'Connect',
      description: 'Contact landlords directly through our secure messaging platform',
    },
    {
      icon: Home,
      title: 'Move In',
      description: 'Book your room and secure your new home away from home',
    },
  ];

  return (
    <section className="py-16 bg-gray-50" id="works">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-gray-600">
            Find your perfect student accommodation in 4 simple steps
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div key={index} className="text-center">
                {/* Icon */}
                <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-8 h-8 text-white" />
                </div>

                {/* Step Number */}
                <div className="text-sm font-semibold text-gray-500 mb-2">
                  Step {index + 1}
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;