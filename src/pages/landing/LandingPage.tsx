import React from 'react';
import { Link } from 'react-router-dom';
import useTranslation from '../../hooks/useTranslation';

const LandingPage: React.FC = () => {
  const { t } = useTranslation();
  
  // Demo features section data
  const features = [
    {
      title: 'Smart Crop Recommendations',
      description: 'Get AI-powered crop recommendations based on soil conditions, climate, and historical data.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
    },
    {
      title: 'Satellite Field Mapping',
      description: 'Map your fields accurately using satellite imagery and get insights on crop health.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      ),
    },
    {
      title: 'Weather Alerts',
      description: 'Receive timely notifications about weather changes that might affect your crops.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        </svg>
      ),
    },
  ];

  // Demo testimonials section data
  const testimonials = [
    {
      quote: "SmartKissan has increased my crop yield by 30% with its precise recommendations!",
      author: "Rajesh Kumar",
      location: "Punjab"
    },
    {
      quote: "The weather alerts saved my wheat crop from unexpected rainfall last season.",
      author: "Sunita Devi",
      location: "Uttar Pradesh"
    },
    {
      quote: "Field mapping technology helped me optimize irrigation and reduce water usage by 25%.",
      author: "Venkatesh S",
      location: "Karnataka"
    }
  ];

  return (
    <div className="relative isolate">
      {/* Hero section with background gradient */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-900 dark:to-gray-800" aria-hidden="true" />
        <div className="absolute inset-0 opacity-10" aria-hidden="true">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
            <defs>
              <pattern id="dot-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="10" cy="10" r="2" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dot-pattern)" />
          </svg>
        </div>
        
        <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center md:mx-auto lg:col-span-6 lg:text-left">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
                SmartKissan: AI-Powered Farming Insights
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
                Get personalized crop recommendations, yield predictions, and real-time agricultural insights
                tailored for smallholder farmers in India.
              </p>
              <div className="mt-10 flex flex-col items-center gap-y-4 sm:flex-row sm:gap-x-6 lg:justify-start">
                <Link to="/dashboard" className="w-full sm:w-auto px-6 py-3 text-base font-semibold text-white shadow-sm bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 rounded-md transition-colors duration-200 text-center">
                  Get Started
                </Link>
                <Link to="/help" className="group flex items-center text-sm font-semibold leading-6 text-gray-900 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200">
                  Learn more <span aria-hidden="true" className="ml-1 transition-transform duration-200 group-hover:translate-x-1">→</span>
                </Link>
              </div>
            </div>
            <div className="relative mt-16 h-80 lg:col-span-6 lg:mt-0">
              <div className="absolute top-0 bottom-0 right-0 left-0 rounded-2xl bg-white/5 ring-1 ring-inset ring-white/10 overflow-hidden shadow-xl">
                <div className="relative h-full w-full">
                  <img 
                    src="https://images.pexels.com/photos/2382904/pexels-photo-2382904.jpeg?auto=compress&cs=tinysrgb&w=1280&h=720&dpr=1" 
                    alt="SmartKissan" 
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      // Fallback to a different image if the primary one fails to load
                      target.src = "https://images.pexels.com/photos/2382904/pexels-photo-2382904.jpeg?auto=compress&cs=tinysrgb&w=800";
                      
                      // If the online fallback also fails, show the hidden fallback div
                      target.onerror = () => {
                        target.style.display = 'none';
                        const fallbackEl = document.getElementById('image-fallback');
                        if (fallbackEl) {
                          fallbackEl.style.display = 'flex';
                        }
                      };
                    }}
                  />
                  <div 
                    id="image-fallback"
                    className="absolute inset-0 hidden flex-col items-center justify-center bg-gradient-to-r from-green-600 to-green-700 text-white"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-xl font-semibold">Photo by Kelly on Pexels</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features section */}
      <div className="py-24 sm:py-32 bg-white dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-green-600 dark:text-green-400">Smart Agriculture</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">Everything you need for successful farming</p>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              Our AI-powered platform provides all the tools you need to make data-driven farming decisions.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3 lg:gap-y-16">
              {features.map((feature, index) => (
                <div key={index} className="relative pl-16 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                  <dt className="text-base font-semibold leading-7 text-gray-900 dark:text-white">
                    <div className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 dark:bg-green-900">
                      {feature.icon}
                    </div>
                    {feature.title}
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-gray-600 dark:text-gray-300">{feature.description}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Testimonials section */}
      <div className="bg-green-50 dark:bg-gray-800 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-lg font-semibold leading-8 tracking-tight text-green-600 dark:text-green-400">Testimonials</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Hear from our farmers
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="flex flex-col justify-between rounded-2xl bg-white dark:bg-gray-700 p-8 shadow-lg ring-1 ring-gray-200 dark:ring-gray-600">
                <div>
                  <div className="flex items-center gap-x-2">
                    {[0, 1, 2, 3, 4].map((star) => (
                      <svg key={star} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-yellow-400">
                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                      </svg>
                    ))}
                  </div>
                  <div className="mt-6">
                    <p className="text-lg font-semibold leading-6 text-gray-900 dark:text-white">"{testimonial.quote}"</p>
                  </div>
                </div>
                <div className="mt-8 border-t border-gray-100 dark:border-gray-600 pt-4">
                  <div className="text-base font-semibold text-gray-900 dark:text-white">{testimonial.author}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{testimonial.location}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="bg-white dark:bg-gray-900">
        <div className="mx-auto max-w-7xl py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="relative isolate overflow-hidden bg-gradient-to-br from-green-500 to-green-600 dark:from-green-700 dark:to-green-900 px-6 py-24 text-center shadow-2xl sm:rounded-3xl sm:px-16">
            <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to transform your farming?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-green-50">
              Join thousands of farmers who are already using SmartKissan to improve yields and reduce costs.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                to="/register"
                className="rounded-md bg-white px-6 py-3 text-base font-semibold text-green-600 shadow-sm hover:bg-green-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-colors duration-200"
              >
                Sign up for free
              </Link>
              <Link to="/login" className="text-base font-semibold leading-6 text-white hover:underline">
                Log in <span aria-hidden="true">→</span>
              </Link>
            </div>
            {/* Background pattern */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1024 1024"
              className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-x-1/2 -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)]"
              aria-hidden="true"
            >
              <circle cx="512" cy="512" r="512" fill="url(#gradient)" fillOpacity="0.15" />
              <defs>
                <radialGradient id="gradient">
                  <stop stopColor="white" />
                  <stop offset="1" stopColor="white" />
                </radialGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage; 