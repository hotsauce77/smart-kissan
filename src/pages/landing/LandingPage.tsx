import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  return (
    <div className="relative isolate">
      <div className="mx-auto max-w-4xl py-32 sm:py-48 lg:py-56">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            AI-Powered Farming Insights for Better Yields
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Get personalized crop recommendations, yield predictions, and real-time agricultural insights
            tailored for smallholder farmers in India.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link to="/dashboard" className="btn-primary">
              Get Started
            </Link>
            <Link to="/help" className="text-sm font-semibold leading-6 text-gray-900">
              Learn more <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage; 