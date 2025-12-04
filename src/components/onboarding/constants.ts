import {
  Rocket,
  Target,
  Code,
  Building,
  Truck,
  Search,
  BookOpen,
  DollarSign,
} from 'lucide-react'

export const COUNTRY_CODES = [
  { code: '+1', country: 'US', flag: '🇺🇸' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+91', country: 'IN', flag: '🇮🇳' },
  { code: '+61', country: 'AU', flag: '🇦🇺' },
  { code: '+971', country: 'AE', flag: '🇦🇪' },
] as const

export const USER_ROLES = [
  { id: 'founder', label: 'Founder', icon: Rocket },
  { id: 'mentor', label: 'Mentor', icon: Building },
  { id: 'investor', label: 'Investor', icon: DollarSign },
  { id: 'freelancer', label: 'Freelancer', icon: Code },
  { id: 'service_provider', label: 'Service Provider', icon: Target },
  { id: 'student', label: 'Student', icon: BookOpen },
  { id: 'job_seeker', label: 'Job Seeker', icon: Search },
  { id: 'supplier', label: 'Supplier', icon: Truck },
] as const