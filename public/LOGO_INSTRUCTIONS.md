# Adding Fountain Vitality Logo

## Instructions

1. Place your Fountain Vitality logo file in this `/public` folder
2. Name it: `fountain-vitality-logo.png` (or update the code to match your filename)
3. Recommended size: 300x300px or larger (will be scaled down)
4. Supported formats: PNG, JPG, SVG

## Update the Code

In `components/HeroSection.tsx`, replace the placeholder div with:

```tsx
import Image from 'next/image'

// Then in the logo section:
<Image 
  src="/fountain-vitality-logo.png" 
  alt="Fountain Vitality" 
  width={144} 
  height={144} 
  className="object-contain w-full h-full" 
  priority
/>
```

The logo will automatically appear in the hero section!

