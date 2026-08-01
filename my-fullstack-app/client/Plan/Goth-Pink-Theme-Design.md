---
name: Neon Blossom
colors:
  surface: '#131318'
  surface-dim: '#131318'
  surface-bright: '#39383e'
  surface-container-lowest: '#0e0e13'
  surface-container-low: '#1b1b20'
  surface-container: '#1f1f25'
  surface-container-high: '#2a292f'
  surface-container-highest: '#35343a'
  on-surface: '#e4e1e9'
  on-surface-variant: '#e3bdc6'
  inverse-surface: '#e4e1e9'
  inverse-on-surface: '#303036'
  outline: '#aa8890'
  outline-variant: '#5b3f47'
  surface-tint: '#ffb1c6'
  primary: '#ffb1c6'
  on-primary: '#650031'
  primary-container: '#ff4992'
  on-primary-container: '#59002a'
  inverse-primary: '#ba005f'
  secondary: '#ffb0d0'
  on-secondary: '#63003d'
  secondary-container: '#90015a'
  on-secondary-container: '#ff99c6'
  tertiary: '#3cd7ff'
  on-tertiary: '#003642'
  tertiary-container: '#009ebe'
  on-tertiary-container: '#002e3a'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffd9e1'
  primary-fixed-dim: '#ffb1c6'
  on-primary-fixed: '#3f001c'
  on-primary-fixed-variant: '#8e0047'
  secondary-fixed: '#ffd8e6'
  secondary-fixed-dim: '#ffb0d0'
  on-secondary-fixed: '#3d0024'
  on-secondary-fixed-variant: '#8c0058'
  tertiary-fixed: '#b4ebff'
  tertiary-fixed-dim: '#3cd7ff'
  on-tertiary-fixed: '#001f27'
  on-tertiary-fixed-variant: '#004e5f'
  background: '#131318'
  on-background: '#e4e1e9'
  surface-variant: '#35343a'
  sakura-pink: '#FFB6D9'
  deep-navy: '#0D0D1A'
  charcoal: '#1A1A2E'
  gunmetal: '#2A2A3D'
  cosmic-purple: '#4A1A6B'
  star-white: '#E8E0F0'
  mist-gray: '#8888AA'
typography:
  display-hero:
    fontFamily: Orbitron
    fontSize: 96px
    fontWeight: '900'
    lineHeight: 110%
    letterSpacing: 4px
  display-hero-mobile:
    fontFamily: Orbitron
    fontSize: 48px
    fontWeight: '900'
    lineHeight: 110%
  headline-lg:
    fontFamily: Orbitron
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
  headline-md:
    fontFamily: Orbitron
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  body-lg:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '400'
    lineHeight: 32px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-caps:
    fontFamily: Rajdhani
    fontSize: 14px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 1px
  label-sm:
    fontFamily: Rajdhani
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 14px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  xxl: 80px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
---

## Brand & Style

The design system embodies a **Gothic Cyberpunk x Kawaii Punk** aesthetic. It is tailored for the Fridge-to-Food (F2F) platform, transforming a utilitarian kitchen tool into a high-energy, mysterious, and alluring digital experience. The brand personality is rebellious yet welcoming—mixing the dark, sharp edges of a "Void" cyberpunk future with the soft, vibrant playfulness of "Kawaii" culture.

The UI should evoke a sense of late-night digital discovery. It uses **Glassmorphism** as its primary structural language, layered over a star-filled cosmic void. Visual motifs include glowing wings, skull-heart icons, and energy trails that pulse with life, suggesting that cooking is an act of "cybernetic alchemy" where disparate ingredients are fused into something powerful.

## Colors

The palette is strictly **Dark Mode**, centered around the contrast between "Void Black" and high-intensity neon pinks.

- **Primary (Neon Pink):** Used for primary actions, critical UI states, and the dominant glow effect.
- **Secondary (Hot Pink):** Used for hover states and secondary accents to provide depth to the pink spectrum.
- **Tertiary (Ice Blue):** A "cyber-eye" accent used sparingly for special highlights, links, or success states to break the warm monochrome.
- **Neutral:** A range of deep, desaturated purples and navies (Void Black to Charcoal) provide the "base" for glassmorphism and depth.

**Gradients:**
- `cosmic-sky`: A 135-degree blend from `#0A0A0F` through `#1A0A2E` to `#0D0D1A`.
- `neon-energy`: A horizontal sweep of `#FF2D8A`, `#FF69B4`, and `#FFB6D9`.
- `glass-surface`: A translucent overlay using `rgba(255, 45, 138, 0.08)` and `rgba(26, 26, 46, 0.6)`.

## Typography

The typography system balances futuristic aggression with high-density information readability.

- **Orbitron:** Reserved for headlines and major brand moments. It carries a heavy "tech-gothic" weight. Headlines should often feature a multi-layered pink text-shadow to simulate a neon tubes.
- **Inter:** The workhorse for ingredient lists and cooking instructions. It ensures that the "Food" part of Fridge-to-Food remains accessible and clear.
- **Rajdhani:** Used for technical metadata, labels, and "sci-fi" accents (e.g., prep time, calorie counts, or ingredient quantities). It should almost always be displayed in medium to bold weights to maintain its square, industrial character.

## Layout & Spacing

This design system utilizes a **Fluid Grid** model to accommodate the dense information of recipe discovery. 

- **Desktop:** 12-column grid with a maximum container width of 1400px. Gutters are fixed at 24px to maintain a compact, "cockpit" feel. 
- **Mobile:** Single column with 16px side margins. 
- **Rhythm:** All spacing (padding, margins) follows a 4px base unit. 
- **Breathing Room:** While the style is bold, use `xxl` (80px) spacing between major landing page sections to prevent "visual noise" from overwhelming the user.

## Elevation & Depth

Elevation is achieved through **Glassmorphism and Tonal Layering** rather than traditional shadows.

1.  **The Void (Level 0):** Background cosmic gradient with twinkling star particles.
2.  **Backdrop (Level 1):** Large layout sections using Deep Navy or Charcoal.
3.  **The Glass (Level 2):** Primary cards and panels. Features `backdrop-filter: blur(16px)`, a semi-transparent dark fill, and a 1px solid border at 15% opacity of Neon Pink.
4.  **The Glow (Level 3):** Active elements (buttons, active tabs) emit a pulse-glow. Instead of a shadow, these use a `box-shadow` that mimics light diffusion (multiple layers of pink with increasing blur).

**Energy Trails:** Use 2px tall horizontal gradients to separate sections. These should have a CSS animation "sweeping" across the line to imply data flow.

## Shapes

The shape language is "Soft-Tech"—combining structured geometry with human-friendly curves. 

- **Cards & Panels:** Use a standard `rounded-lg` (16px/1rem) to soften the dark aesthetic.
- **Interactive Elements:** Buttons and pill badges use a "Pill" shape (50px or higher) to contrast against the rectangular nature of the glass panels.
- **Motifs:** The "Skull-Heart" icon should be used as a recurring decorative element, replacing standard bullet points or loading spinners.

## Components

- **Buttons:** Primary buttons are pill-shaped with a Neon Pink gradient. On hover, they must trigger a `pulse-glow` animation and scale slightly (1.05x).
- **Glass Cards:** The standard container for recipe previews. On hover, the border opacity should increase, and the card should lift -4px.
- **Input Fields:** Void Black background with a thin Gunmetal border. On focus, the border transitions to Neon Pink with a soft outer glow. Use Rajdhani for placeholder text.
- **Pill Badges (Tags):** Used for ingredient status (e.g., "In Pantry"). High-contrast borders with small Rajdhani caps text.
- **Glow Dividers:** Instead of grey lines, use the `energy-trail` animation—a thin, animated pink line that suggests energy movement between sections.
- **Navigation Bar:** A fixed top glass panel with a 20px blur. The "Active" link is denoted by a 2px neon pink underline that glows.