---
name: Etheric Harmony
colors:
  surface: '#fbf9f8'
  surface-dim: '#dbd9d9'
  surface-bright: '#fbf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3f3'
  surface-container: '#efeded'
  surface-container-high: '#eae8e7'
  surface-container-highest: '#e4e2e2'
  on-surface: '#1b1c1c'
  on-surface-variant: '#43474d'
  inverse-surface: '#303030'
  inverse-on-surface: '#f2f0f0'
  outline: '#73777e'
  outline-variant: '#c3c6ce'
  surface-tint: '#436182'
  primary: '#002542'
  on-primary: '#ffffff'
  primary-container: '#1b3b5a'
  on-primary-container: '#87a5ca'
  inverse-primary: '#abc9ef'
  secondary: '#556254'
  on-secondary: '#ffffff'
  secondary-container: '#d6e3d2'
  on-secondary-container: '#5a6658'
  tertiary: '#26231e'
  on-tertiary: '#ffffff'
  tertiary-container: '#3b3933'
  on-tertiary-container: '#a7a29a'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d1e4ff'
  primary-fixed-dim: '#abc9ef'
  on-primary-fixed: '#001d35'
  on-primary-fixed-variant: '#2a4968'
  secondary-fixed: '#d9e6d5'
  secondary-fixed-dim: '#bdcab9'
  on-secondary-fixed: '#131e13'
  on-secondary-fixed-variant: '#3e4a3d'
  tertiary-fixed: '#e7e2d9'
  tertiary-fixed-dim: '#cbc6bd'
  on-tertiary-fixed: '#1d1b16'
  on-tertiary-fixed-variant: '#494640'
  background: '#fbf9f8'
  on-background: '#1b1c1c'
  surface-variant: '#e4e2e2'
typography:
  headline-xl:
    fontFamily: Noto Serif
    fontSize: 40px
    fontWeight: '400'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Noto Serif
    fontSize: 32px
    fontWeight: '400'
    lineHeight: '1.3'
  headline-md:
    fontFamily: Noto Serif
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.2'
    letterSpacing: 0.1em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  margin-mobile: 24px
  margin-desktop: 64px
  gutter: 16px
  section-gap: 48px
---

## Brand & Style

This design system is rooted in the philosophy of "Digital Stillness." It is designed for practitioners of mindfulness, yoga, and meditation who seek a sanctuary from the high-stimulation environments of traditional apps. The brand personality is wise, gentle, and spacious, evoking the feeling of a quiet morning in a secluded garden.

The visual style follows a **Minimalist** approach infused with **Organic Minimalism**. It prioritizes breathability over density. By utilizing generous whitespace and soft transitions, the UI acts as a digital exhale, guiding the user toward focus and internal peace without unnecessary cognitive load.

## Colors

The palette is inspired by the transition from earth to sky. 

*   **Primary (Deep Blue):** Represents the depth of the subconscious and the vastness of the evening sky. Used for primary actions and grounding elements.
*   **Secondary (Sage Earth):** A soft, desaturated green that connects the user to nature and growth. Used for progress indicators and accents.
*   **Tertiary (Warm Cream):** The foundation of the interface. This color replaces pure white to reduce eye strain and provide a sense of warmth and antiquity, like aged parchment.
*   **Neutrals:** Soft charcoals and muted taupes are used for text and borders to maintain high readability without the harshness of pure black.

## Typography

Typography in this design system is an exercise in elegance and clarity. 

**Noto Serif** is utilized for headlines to provide a literary, authoritative, and timeless feel. It invites the user to slow down and read with intention. **Manrope** is used for body text and functional labels; its balanced and modern geometric construction ensures that even long meditative passages remain highly readable and unobtrusive.

Line heights are intentionally set wider than standard presets to allow "air" between lines, preventing the text from feeling cramped or urgent.

## Layout & Spacing

This design system employs a **Fixed Grid** model with significantly expanded safe areas. 

The spacing rhythm is built on an 8px base unit, but it leans heavily into larger increments (24px, 32px, 48px) to create "islands" of content. This prevents the interface from feeling cluttered. Layouts should prioritize vertical flow, mimicking the rhythm of a deep breath. Central alignment is encouraged for focus-heavy screens (like meditation timers), while asymmetrical layouts can be used for discovery screens to mimic organic, natural forms.

## Elevation & Depth

To maintain a sense of lightness, this design system avoids heavy shadows. Instead, it uses **Tonal Layers** and **Glassmorphism**.

Depth is conveyed through subtle color shifts—placing a slightly lighter cream container on a warm cream background. Where physical separation is required, use "Ambient Glows"—very soft, large-radius shadows (20-40px blur) with extremely low opacity (3-5%) tinted with the primary deep blue. Elements may also use backdrop blurs to simulate "frosted glass," suggesting a layer of mist between the user and the background.

## Shapes

The shape language is defined by **Softened Organics**. While a standard 0.5rem (8px) radius is used for functional elements like input fields, larger containers and cards should utilize "super-ellipses" or varying corner radii to feel less mechanical. 

Icons should be "Open Line" style—meaning paths do not always close—to represent the flow of energy. Decorative elements should include subtle "pebble" or "leaf" shapes that break the strict geometry of the grid, providing a sense of natural imperfection.

## Components

*   **Buttons:** Primary buttons are solid Deep Blue with Noto Serif text for a grounded feel. Secondary buttons use a "Ghost" style with a Sage Earth border. All buttons feature high internal padding (16px top/bottom, 32px left/right).
*   **Cards:** Cards use a Tertiary color fill with no border. They should have a large corner radius (1rem or higher) to appear soft and approachable.
*   **Chips:** Used for tag filtering (e.g., "5 min," "Anxiety," "Morning"). These should be pill-shaped with a soft Sage background.
*   **Progress Indicators:** For meditation sessions, use thin, circular strokes rather than heavy bars. The motion should be slow and easing (cubic-bezier easing).
*   **Input Fields:** Minimalist design with only a bottom border that thickens slightly on focus. 
*   **Yoga/Meditation Icons:** Custom-drawn, thin-stroke icons reflecting poses and nature elements (lotus, moon phases, stylized breath waves). Avoid sharp angles; every line should have a rounded terminal.