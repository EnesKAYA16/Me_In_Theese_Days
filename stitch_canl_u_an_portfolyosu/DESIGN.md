---
name: Authentic Presence
colors:
  surface: '#f8f9fa'
  surface-dim: '#d9dadb'
  surface-bright: '#f8f9fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f5'
  surface-container: '#edeeef'
  surface-container-high: '#e7e8e9'
  surface-container-highest: '#e1e3e4'
  on-surface: '#191c1d'
  on-surface-variant: '#45474c'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f2'
  outline: '#75777d'
  outline-variant: '#c5c6cd'
  surface-tint: '#545f73'
  primary: '#091426'
  on-primary: '#ffffff'
  primary-container: '#1e293b'
  on-primary-container: '#8590a6'
  inverse-primary: '#bcc7de'
  secondary: '#006a61'
  on-secondary: '#ffffff'
  secondary-container: '#86f2e4'
  on-secondary-container: '#006f66'
  tertiary: '#1e1200'
  on-tertiary: '#ffffff'
  tertiary-container: '#35260c'
  on-tertiary-container: '#a38c6a'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d8e3fb'
  primary-fixed-dim: '#bcc7de'
  on-primary-fixed: '#111c2d'
  on-primary-fixed-variant: '#3c475a'
  secondary-fixed: '#89f5e7'
  secondary-fixed-dim: '#6bd8cb'
  on-secondary-fixed: '#00201d'
  on-secondary-fixed-variant: '#005049'
  tertiary-fixed: '#fadfb8'
  tertiary-fixed-dim: '#ddc39d'
  on-tertiary-fixed: '#271902'
  on-tertiary-fixed-variant: '#564427'
  background: '#f8f9fa'
  on-background: '#191c1d'
  surface-variant: '#e1e3e4'
  background-warm: '#FDFCFB'
  text-charcoal: '#1E293B'
  accent-teal: '#0D9488'
  status-orange: '#F59E0B'
  status-purple: '#8B5CF6'
  border-subtle: '#E2E8F0'
typography:
  display:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  metadata:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max: 720px
  section-gap: 4rem
  stack-gap: 1.5rem
  gutter: 1.5rem
  margin-mobile: 1.25rem
  margin-desktop: 2rem
---

## Brand & Style

This design system is built for the "Now" movement—a personal, real-time snapshot of a person's current life priorities. The brand personality is **honest, calm, and professional yet personal**. It moves away from the chaotic noise of traditional social media toward a quiet, intentional space for reflection and sharing.

The visual style is **Minimalism with Tonal Depth**. It prioritizes high-quality typography and generous whitespace to create a "digital sanctuary" feel. The interface stays out of the way of the content, using soft background layers and intentional pops of color to denote current status and activity. The emotional response should be one of clarity and focus, inviting the reader to engage with the author's current journey without distraction.

## Colors

The palette is anchored by a soft, off-white background (`#FDFCFB`) to reduce eye strain and provide a more "paper-like" feel than pure white. 

- **Primary:** A deep charcoal/indigo used for all body text and headings to ensure maximum readability and a grounded, professional tone.
- **Secondary/Accent:** A vibrant teal serves as the primary action and status color. It is energetic but stays within the calm spectrum of the design.
- **Status Indicators:** Use the named colors (Teal, Orange, Purple) to categorize different types of "Now" entries (e.g., 'Learning', 'Building', 'Reading'). 
- **Neutral:** Used for secondary metadata, borders, and subtle container fills to maintain the minimalist hierarchy.

## Typography

This design system uses **Inter** exclusively to achieve a modern, systematic, and highly readable interface. The type scale is optimized for long-form reading and clear information hierarchy.

- **Headlines:** Use tight letter spacing and heavier weights to create a strong visual anchor for the page.
- **Body Text:** Set with generous line heights to ensure the "Now" descriptions feel airy and easy to digest.
- **Labels:** Used for status badges and the "Last Updated" timestamp; these use uppercase styling or slightly increased letter spacing to distinguish them from body copy.
- **Metadata:** Smaller, medium-weight text for dates and secondary information.

## Layout & Spacing

The layout follows a **Fixed Grid** approach for the main content well, centered on the screen to mimic the feel of a personal essay or a focused document.

- **Content Width:** The primary content column is restricted to a maximum of 720px to maintain optimal line lengths for reading.
- **Vertical Rhythm:** Large gaps (64px+) between major sections (e.g., Intro, Now, Archive) create a sense of pace.
- **Responsive Behavior:** 
  - **Desktop:** Center-aligned column with wide margins.
  - **Tablet:** Margin reduces to 2rem; content scales to fill width until 720px.
  - **Mobile:** Margins drop to 1.25rem. The "Last Updated" timestamp moves from a sidebar position to the top of the main stack.

## Elevation & Depth

Depth is conveyed through **Tonal Layers** and **Ambient Shadows**. This design avoids heavy shadows in favor of subtle definition.

- **Surface Levels:** The main page uses the warm background color. Cards and input fields use the secondary neutral or pure white to "pop" slightly.
- **Shadows:** Use a single, very soft ambient shadow for cards (`0 4px 20px rgba(0,0,0,0.04)`). The goal is to make the card feel like it's resting gently on the surface, not floating high above it.
- **Interactive States:** On hover, cards may increase their shadow slightly or transition their border color to the accent teal to indicate interactivity.

## Shapes

The shape language is **Rounded**, echoing the friendly and approachable nature of a personal site.

- **Cards & Containers:** Use a consistent 1rem (`rounded-lg`) radius.
- **Buttons & Badges:** Use a fully pill-shaped radius to create a distinct interactive language that contrasts with the structural card shapes.
- **Input Fields:** Match the card radius (1rem) to maintain a cohesive container language.

## Components

- **Cards:** The central component. Use a white or slightly off-white fill, a 1px subtle border (`#E2E8F0`), and a soft shadow. Use for distinct "Now" updates or projects.
- **Status Badges:** Small, pill-shaped indicators. Use a light tinted background of the accent color with the deep-toned text (e.g., Light Teal background with Deep Teal text). 
- **Last Updated Timestamp:** A high-contrast but small label, often paired with a small pulsing "Live" icon (using the Accent Teal) to show the page is current.
- **Buttons:** Primary buttons should be solid charcoal or teal with white text. Secondary buttons should be ghost-style with a subtle border.
- **Lists:** Use simple, bullet-less lists with increased vertical padding between items to maintain the minimalist aesthetic.
- **Input Fields:** Minimalist design with only a bottom border that expands to a full outline on focus using the accent color.