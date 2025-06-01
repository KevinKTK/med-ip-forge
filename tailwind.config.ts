
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
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
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
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
				// Muted cyberpunk aesthetic colors - updated to more refined purples
				cyber: {
					purple: '#6B46C1',      // More muted primary purple
					violet: '#8B5CF6',      // Softer violet
					indigo: '#7C3AED',      // Muted indigo
					pink: '#D946EF',        // Softer pink
					magenta: '#C084FC',     // Muted magenta
					cyan: '#22D3EE',        // Softer cyan
					orange: '#F97316',      // Muted orange
					yellow: '#EAB308'       // Softer yellow
				},
				neon: {
					blue: '#3B82F6',
					purple: '#8B5CF6',
					cyan: '#06B6D4',
					pink: '#EC4899',
					magenta: '#C084FC'
				},
				retro: {
					dark: '#0A0A0A',
					darkest: '#000000',
					grid: '#1A1A1A'
				}
			},
			fontFamily: {
				'pixel': ['VT323', 'monospace'],
				'retro': ['Press Start 2P', 'monospace'],
				sans: ['Inter', 'sans-serif']
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
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
				'pulse-glow': {
					'0%, 100%': {
						boxShadow: '0 0 3px rgba(107, 70, 193, 0.3)'
					},
					'50%': {
						boxShadow: '0 0 8px rgba(107, 70, 193, 0.5), 0 0 15px rgba(107, 70, 193, 0.2)'
					}
				},
				'gradient-shift': {
					'0%, 100%': {
						backgroundPosition: '0% 50%'
					},
					'50%': {
						backgroundPosition: '100% 50%'
					}
				},
				'pixel-pulse': {
					'0%, 100%': {
						transform: 'scale(1)',
						filter: 'brightness(1)'
					},
					'50%': {
						transform: 'scale(1.02)',
						filter: 'brightness(1.1)'
					}
				},
				'scan-line': {
					'0%': {
						transform: 'translateY(-100%)'
					},
					'100%': {
						transform: 'translateY(100vh)'
					}
				},
				'glitch': {
					'0%, 100%': {
						transform: 'translate(0)'
					},
					'20%': {
						transform: 'translate(-1px, 1px)'
					},
					'40%': {
						transform: 'translate(-1px, -1px)'
					},
					'60%': {
						transform: 'translate(1px, 1px)'
					},
					'80%': {
						transform: 'translate(1px, -1px)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
				'gradient-shift': 'gradient-shift 3s ease infinite',
				'pixel-pulse': 'pixel-pulse 2s ease-in-out infinite',
				'scan-line': 'scan-line 2s linear infinite',
				'glitch': 'glitch 0.3s ease-in-out infinite'
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
				'cyber-grid': 'linear-gradient(rgba(107, 70, 193, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(107, 70, 193, 0.08) 1px, transparent 1px)',
				'retro-gradient': 'linear-gradient(135deg, #000000 0%, #1a1a1a 25%, #000000 50%, #1a0a1a 75%, #000000 100%)',
				'neon-gradient': 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
				'cyber-gradient': 'linear-gradient(135deg, #6B46C1 0%, #D946EF 50%, #C084FC 100%)',
				'gradient-border': 'linear-gradient(135deg, rgba(107, 70, 193, 0.4), rgba(139, 92, 246, 0.3), rgba(192, 132, 252, 0.2))'
			},
			boxShadow: {
				'pixel': '3px 3px 0px rgba(0, 0, 0, 0.4)',
				'neon': '0 0 5px currentColor, 0 0 10px currentColor',
				'cyber': '0 0 15px rgba(107, 70, 193, 0.3), inset 0 0 15px rgba(107, 70, 193, 0.1)',
				'gradient-border': '0 0 0 1px transparent'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
