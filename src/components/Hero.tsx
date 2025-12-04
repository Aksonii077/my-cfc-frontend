
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { ArrowRight, Search } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-white py-16 md:py-24">
      {/* Background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute right-0 bottom-0 w-80 h-80 rounded-full bg-fiverr-green transform translate-x-1/4 translate-y-1/4"></div>
        <div className="absolute left-0 top-0 w-64 h-64 rounded-full bg-blue-500 transform -translate-x-1/4 -translate-y-1/4"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 text-center md:text-left mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-fiverr-dark leading-tight animate-fade-in">
              Find the perfect <span className="text-fiverr-green">entrepreneurial</span> match
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-fiverr-light animate-fade-in max-w-xl" style={{ animationDelay: "0.2s" }}>
              Join a community where entrepreneurs, consumers, and investors connect to bring innovative ideas to life.
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-lg mx-auto md:mx-0 mb-8 animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <div className="flex shadow-md rounded overflow-hidden">
                <input
                  type="text"
                  placeholder="Search for startups, ideas, or partners..."
                  className="flex-grow px-4 py-3 focus:outline-none text-base"
                />
                <button className="bg-fiverr-green hover:bg-green-600 text-white px-4 flex items-center">
                  <Search className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <Link to="/startups">
                <Button className="bg-fiverr-green hover:bg-green-600 text-white font-medium rounded py-3 px-8 text-base">
                  Explore Startups
                </Button>
              </Link>
              <Link to="/">
                <Button variant="outline" className="border-fiverr-border text-fiverr-dark hover:bg-fiverr-hover font-medium rounded py-3 px-8 text-base">
                  <span>Join Circle</span>
                  <ArrowRight size={16} />
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="md:w-1/2 flex justify-center md:justify-end">
            <div className="relative">
              {/* Main image */}
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1742&q=80" 
                alt="Entrepreneurs collaborating" 
                className="rounded-lg shadow-xl z-20 relative max-w-full w-full md:max-w-md lg:max-w-lg"
              />
              
              {/* Floating stats card */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-lg shadow-lg p-4 z-30 animate-fade-in border border-fiverr-border" style={{ animationDelay: "0.6s" }}>
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 rounded-full p-3">
                    <div className="w-10 h-10 rounded-full bg-fiverr-green flex items-center justify-center text-white font-bold">
                      5K+
                    </div>
                  </div>
                  <div>
                    <p className="text-fiverr-light text-sm">Active Members</p>
                    <p className="font-semibold text-fiverr-dark">Growing Community</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto text-center">
          <div className="bg-white shadow-sm rounded-lg p-4 border border-fiverr-border transform hover:shadow-md transition-all hover:-translate-y-1">
            <div className="text-3xl font-bold text-fiverr-dark">500+</div>
            <div className="text-fiverr-light">Startups</div>
          </div>
          <div className="bg-white shadow-sm rounded-lg p-4 border border-fiverr-border transform hover:shadow-md transition-all hover:-translate-y-1">
            <div className="text-3xl font-bold text-fiverr-dark">₹100Cr+</div>
            <div className="text-fiverr-light">Investments</div>
          </div>
          <div className="bg-white shadow-sm rounded-lg p-4 border border-fiverr-border transform hover:shadow-md transition-all hover:-translate-y-1">
            <div className="text-3xl font-bold text-fiverr-dark">5,000+</div>
            <div className="text-fiverr-light">Entrepreneurs</div>
          </div>
          <div className="bg-white shadow-sm rounded-lg p-4 border border-fiverr-border transform hover:shadow-md transition-all hover:-translate-y-1">
            <div className="text-3xl font-bold text-fiverr-dark">300+</div>
            <div className="text-fiverr-light">Investors</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
