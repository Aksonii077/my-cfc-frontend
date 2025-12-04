import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
	darkMode: ["class"],
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
		"!./node_modules/**",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				sans: ['Roboto', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Helvetica Neue', 'Arial', 'sans-serif'],
				display: ['Roboto', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
				serif: ['Domaine Display', 'Georgia', 'Times New Roman', 'serif'],
			},
			fontSize: {
				'responsive-heading': ['36px', { lineHeight: '1.2' }],
				'responsive-heading-md': ['64px', { lineHeight: '1.2' }],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: '#2563eb', // minimalist blue
					foreground: '#ffffff',
					light: '#eff6ff', // very light blue
				},
				secondary: {
					DEFAULT: '#f3f4f6', // light gray
					foreground: '#111827',
				},
				destructive: {
					DEFAULT: '#ef4444',
					foreground: '#ffffff',
				},
				muted: {
					DEFAULT: '#f9fafb',
					foreground: '#6b7280',
				},
				accent: {
					DEFAULT: '#2563eb',
					foreground: '#ffffff',
				},
				popover: {
					DEFAULT: '#ffffff',
					foreground: '#111827',
				},
				card: {
					DEFAULT: '#ffffff',
					foreground: '#111827',
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
			},
			borderRadius: {
				DEFAULT: '6px',
				lg: '6px',
				md: '6px',
				sm: '6px'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'slide-in': {
					'0%': {
						transform: 'translateX(-100%)'
					},
					'100%': {
						transform: 'translateX(0)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.5s ease-out',
				'slide-in': 'slide-in 0.5s ease-out'
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'hero-gradient': 'linear-gradient(to right, #1dbf73, #0ea5e9)',
				'fiverr-gradient': 'linear-gradient(to bottom right, #1dbf73, #0ea5e9)',
				'primary-gradient': 'linear-gradient(92.58deg, #3CE5A7 1.95%, #114DFF 100%)'
			}
		}
	},
	plugins: [tailwindcssAnimate],
} satisfies Config;
