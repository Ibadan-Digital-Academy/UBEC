## Packages
framer-motion | Smooth animations for page transitions and interactions
clsx | Utility for constructing className strings conditionally
tailwind-merge | Utility for merging Tailwind CSS classes
lucide-react | Icon set to replace Material Icons for better React integration
@radix-ui/react-dialog | For modal dialogs (Shadcn UI dependency)
@radix-ui/react-slot | For slot functionality (Shadcn UI dependency)
@radix-ui/react-label | For form labels (Shadcn UI dependency)
@radix-ui/react-select | For dropdown selects (Shadcn UI dependency)
@radix-ui/react-scroll-area | For scrollable areas (Shadcn UI dependency)
date-fns | Date formatting utilities

## Notes
Tailwind Config - extend colors:
colors: {
  primary: {
    DEFAULT: "#2E7D32",
    dark: "#1B5E20",
    light: "#4CAF50",
    foreground: "#FFFFFF",
  },
  background: {
    light: "#F9FAFB",
    dark: "#121212",
  },
  surface: {
    light: "#FFFFFF",
    dark: "#1E1E1E",
  },
  accent: {
    DEFAULT: "#FFC107",
    foreground: "#000000",
  }
}

The backend API is defined in shared/routes.ts.
We need to support filtering by state, type, level, and LGA.
Pagination is supported by the API.
