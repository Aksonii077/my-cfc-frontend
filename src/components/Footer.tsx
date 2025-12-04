
import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, HandCoins, Video, Activity, Tv, Building, LayoutDashboard, FileText, Calculator, Calendar, Briefcase, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-xl font-semibold mb-4 flex flex-col items-start gap-1">
              CoFounder Circle
              <span className="font-semibold text-blue-300 text-sm tracking-widest mt-1">
                Ideas. Startups. YOU
              </span>
            </h3>
            <p className="text-gray-400 mb-4">
              Where entrepreneurs, investors, consumers, and service providers come together to co-build the next generation of startups.<br />
              From idea to IPO, it's your all-in-one startup operating system — powered by AI, driven by community.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/feed" className="text-gray-400 hover:text-white transition-colors flex items-center gap-1">
                  <Activity size={16} />
                  Feed
                </Link>
              </li>
              <li><Link to="/ideas" className="text-gray-400 hover:text-white transition-colors">Ideas</Link></li>
              <li><Link to="/startups" className="text-gray-400 hover:text-white transition-colors">Start-ups</Link></li>
              <li><Link to="/people-jobs" className="text-gray-400 hover:text-white transition-colors">People & Jobs</Link></li>
              <li><Link to="/partners" className="text-gray-400 hover:text-white transition-colors">Partners</Link></li>
              <li><Link to="/investments" className="text-gray-400 hover:text-white transition-colors">Investments</Link></li>
              <li>
                <Link to="/pitch-tank" className="text-gray-400 hover:text-white transition-colors flex items-center gap-1">
                  <Tv size={16} />
                  Pitch Tank
                </Link>
              </li>
              <li>
                <Link to="/angel" className="text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1">
                  <HandCoins size={16} />
                  Angel Investors
                  <span className="ml-2 bg-purple-900 text-purple-300 text-xs px-2 py-0.5 rounded-full">
                    New
                  </span>
                </Link>
              </li>
              <li>
                <Link to="/pitches-meetups" className="text-gray-400 hover:text-white transition-colors flex items-center gap-1">
                  <Video size={16} />
                  Pitches & Meetups
                </Link>
              </li>
              <li>
                <Link to="/startup-tools" className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1">
                  <Building size={16} />
                  Startup Tools
                </Link>
              </li>
              <li><Link to="/startup-wizard" className="text-gray-400 hover:text-white transition-colors">Startup Wizard</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link to="/dashboard" className="text-gray-400 hover:text-white transition-colors">Dashboard</Link></li>
              <li><Link to="/platform-stock" className="text-gray-400 hover:text-white transition-colors">Platform Stock</Link></li>
              <li><Link to="/people-jobs" className="text-gray-400 hover:text-white transition-colors">Jobs</Link></li>
              <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Sign Up</Link></li>
              <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Login</Link></li>
              <li><Link to="/platform-integrations" className="text-green-400 hover:text-green-300 transition-colors">Platform Integrations</Link></li>
              <li>
                <Link to="/documentation" className="text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1">
                  <FileText size={16} />
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  to="/documentation-tabs"
                  className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
                >
                  <FileText size={16} />
                  Documentation Tabs
                </Link>
              </li>
              <li>
                <Link to="/super-admin" className="text-red-400 hover:text-red-300 transition-colors flex items-center gap-1">
                  <LayoutDashboard size={16} />
                  Admin
                </Link>
              </li>
              <li>
                <Link to="/testing-dashboard" className="text-gray-400 hover:text-white transition-colors flex items-center gap-1">
                  <LayoutDashboard size={16} />
                  Testing Dashboard
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Mail size={20} className="mr-2 mt-1 text-gray-400" />
                <span className="text-gray-400">info@cofoundercircle.com</span>
              </li>
              <li className="flex items-start">
                <Phone size={20} className="mr-2 mt-1 text-gray-400" />
                <span className="text-gray-400">+91 98765 43210</span>
              </li>
            </ul>
            
            <h3 className="text-xl font-semibold mb-4 mt-8">Startup Tools</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/startup-tools/hr/payroll" className="text-green-400 hover:text-green-300 transition-colors flex items-center gap-1">
                  <Briefcase size={16} />
                  HR Payroll
                </Link>
              </li>
              <li>
                <Link to="/startup-tools/hr/payslip" className="text-green-400 hover:text-green-300 transition-colors flex items-center gap-1">
                  <FileText size={16} />
                  Payslip Generator
                </Link>
              </li>
              <li>
                <Link to="/startup-tools/hr/leave-tracker" className="text-green-400 hover:text-green-300 transition-colors flex items-center gap-1">
                  <Calendar size={16} />
                  Leave Tracker
                </Link>
              </li>
              <li>
                <Link to="/startup-tools/business-plan" className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1">
                  <FileText size={16} />
                  Business Plan Builder
                </Link>
              </li>
              <li>
                <Link to="/startup-tools/budget-calculator" className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1">
                  <Calculator size={16} />
                  Budget Calculator
                </Link>
              </li>
              <li>
                <Link to="/startup-tools/crm" className="text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1">
                  <Users size={16} />
                  CRM Tool
                </Link>
              </li>
              <li>
                <Link to="/startup-tools/social-calendar" className="text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1">
                  <Calendar size={16} />
                  Social Calendar
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 mt-8 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} CoFounder Circle. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
