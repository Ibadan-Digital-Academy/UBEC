# School Mapping Platform Design Guidelines

## Design Approach
**Hybrid System**: Material Design foundation + inspiration from Google Maps (interface patterns) + Linear (modern data UI) + Mapbox (cartographic excellence)

**Rationale**: Data-heavy mapping application requiring clear hierarchy, robust filtering, and intuitive spatial navigation.

---

## Typography System

**Primary Font**: Inter (Google Fonts)
**Secondary Font**: JetBrains Mono (for data/coordinates)

**Hierarchy**:
- Hero/Page Titles: text-4xl to text-6xl, font-bold
- Section Headers: text-2xl to text-3xl, font-semibold
- Card Titles: text-lg, font-semibold
- Body Text: text-base, font-normal
- Metadata/Labels: text-sm, font-medium
- Fine Print: text-xs

---

## Layout System

**Spacing Primitives**: Use Tailwind units of **2, 4, 6, 8, 12, 16** (p-2, m-4, gap-6, py-8, etc.)

**Grid Structure**:
- Container: max-w-7xl mx-auto px-4
- Card grids: grid gap-6, responsive cols (grid-cols-1 md:grid-cols-2 lg:grid-cols-3)
- Split layouts: 60/40 or 70/30 for map/sidebar combinations

---

## Core Components

### Navigation Header
- Fixed top bar, backdrop-blur effect with semi-transparent background
- Left: Logo + platform name
- Center: Search bar with school name/location input
- Right: User avatar + dropdown menu
- Height: h-16, shadow-sm

### Authentication Pages (Login/Register)
- Split-screen layout: 50/50 on desktop, stacked on mobile
- Left: Form container (max-w-md, centered vertically)
- Right: Abstract geometric pattern or school illustration
- Forms: Single column, generous spacing (space-y-6), large input fields (h-12)
- Floating labels with smooth transitions

### Map Interface (Primary View)
**Layout**: Sidebar (w-96) + Full-width map
- Sidebar: Filters + school list (scrollable, h-screen)
- Map: Fills remaining viewport space
- Toggle button to collapse/expand sidebar

**Filter Panel**:
- Accordion-style sections (School Type, Grade Level, District, Rating, Amenities)
- Chip-based selections with count badges
- "Apply Filters" button (sticky bottom of sidebar)
- Clear all option

**School List Cards** (in sidebar):
- Compact cards: h-24, flex layout
- Left: School icon/image (w-16 h-16, rounded)
- Center: Name (font-semibold), address (text-sm), distance badge
- Right: Bookmark icon, hover to show quick actions
- Active state: Highlighted border when selected on map

### Map Markers
- Custom pin design: Circular base with school icon
- Size variations based on zoom level
- Cluster markers for grouped schools (show count)
- Selected state: Larger, pulsing animation

### School Detail Panel
- Slide-in panel from right (w-full md:w-[480px])
- Header: School image (h-48), overlay with name + category badge
- Content sections: Overview, Statistics grid (2x2), Contact info, Amenities list
- Action buttons: Download Data (primary), Save to Favorites, Get Directions
- Close button (top-right, blurred background on overlay)

### Data Download Modal
- Center overlay modal (max-w-2xl)
- Format selection: Radio buttons (CSV, JSON, PDF)
- Field selection: Checkboxes with "Select All" option
- Preview: Sample data table (first 3 rows)
- Download button with file size estimate

### Statistics Dashboard (Optional Dashboard View)
- Grid layout: 4 stat cards (grid-cols-1 md:grid-cols-2 lg:grid-cols-4)
- Large number display with trend indicators
- Charts: Bar charts for category distribution, simple line graphs
- Use visualization library (Chart.js or Recharts)

---

## Component Patterns

**Buttons**:
- Primary: Solid, h-10 to h-12, px-6, rounded-lg
- Secondary: Outline, same dimensions
- Icon buttons: w-10 h-10, rounded-full
- Buttons on images: backdrop-blur-md with semi-transparent background

**Input Fields**:
- Height: h-12
- Border: 2px, rounded-lg
- Focus: Ring effect
- Labels: Floating or top-aligned

**Cards**:
- Border: 1px, rounded-xl
- Shadow: Subtle hover elevation
- Padding: p-4 to p-6

**Badges/Chips**:
- Small: px-2 py-1, text-xs, rounded-full
- Medium: px-3 py-1.5, text-sm, rounded-full

---

## Icons
**Library**: Heroicons (via CDN)
- Navigation: map-pin, magnifying-glass, user-circle
- Actions: download, bookmark, filter, x-mark
- Schools: academic-cap, building-library, building-office

---

## Images

**Hero Section (Landing/About Page)**:
- Large hero image: Diverse students in modern classroom or aerial school campus
- Height: h-[500px] md:h-[600px]
- Overlay: Gradient overlay (dark to transparent, bottom to top)
- Centered content: Platform tagline + CTA button (blurred background)

**Authentication Backgrounds**:
- Abstract geometric patterns or educational illustrations
- Low opacity, non-distracting

**School Thumbnails**:
- Placeholder: Building icon if no image available
- Aspect ratio: square (1:1) or 4:3

---

## Animations
**Minimal, Purposeful Only**:
- Sidebar collapse/expand: Smooth width transition
- Modal entry: Fade + slight scale
- Map marker selection: Gentle pulse
- NO scroll-triggered animations or parallax

---

## Responsive Behavior
- **Mobile**: Stack sidebar below map with toggle, full-width panels
- **Tablet**: Side-by-side with collapsible sidebar
- **Desktop**: Full layout with persistent sidebar