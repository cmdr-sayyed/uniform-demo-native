# Uniform.dev React Native App - Complete Project Flow Explanation

## 📱 Overview

This is a React Native mobile app built with **Expo** that integrates **Uniform.dev** (a headless CMS/composition platform). Since Uniform.dev doesn't provide official React Native packages, this project implements a custom integration using Uniform's JavaScript SDK (`@uniformdev/canvas`).

---

## 🏗️ Architecture Overview

### Tech Stack
- **React Native** (0.81.5) - Mobile framework
- **Expo** (~54.0) - Development platform and tooling
- **Expo Router** (~6.0) - File-based routing (similar to Next.js)
- **@uniformdev/canvas** (^20.43.0) - Uniform.dev JavaScript SDK
- **React Navigation** - Navigation library (used by Expo Router)

### Project Structure
```
uniform-demo-native/
├── app/                    # Expo Router file-based routing
│   ├── _layout.tsx        # Root layout (navigation setup)
│   ├── (tabs)/            # Tab navigation group
│   │   ├── _layout.tsx   # Tab bar configuration
│   │   ├── index.tsx     # Home tab (shows root composition)
│   │   └── explore.tsx   # Explore tab (demo content)
│   └── composition/       # Dynamic route for Uniform compositions
│       └── [...path].tsx  # Catch-all route for any Uniform path
├── components/            # React Native components
│   ├── CompositionRenderer.tsx  # Recursively renders Uniform components
│   ├── UniformSlot.tsx          # Renders slot content
│   ├── resolver.tsx             # Maps Uniform types → React Native components
│   ├── Header.tsx               # Header component implementation
│   ├── Hero.tsx                 # Hero component implementation
│   └── Container.tsx            # Page container component
├── services/
│   └── uniformService.ts        # Uniform API client wrapper
├── screens/
│   └── CompositionScreen.tsx    # Screen for rendering compositions
└── utils/
    └── parameterHelpers.ts      # Helper functions for Uniform parameters
```

---

## 🔄 Complete Application Flow

### 1. **App Initialization** (`app/_layout.tsx`)

When the app starts:

```typescript
RootLayout() → Sets up:
  - Theme (light/dark mode)
  - Navigation Stack
  - Status Bar
```

**Key Points:**
- Uses Expo Router's `Stack` navigator
- Configures two main routes:
  - `(tabs)` - Tab navigation (Home & Explore)
  - `modal` - Modal screens
- Applies theme based on system preference

---

### 2. **Tab Navigation** (`app/(tabs)/_layout.tsx`)

Sets up bottom tab bar with:
- **Home Tab** (`index.tsx`) - Shows Uniform composition
- **Explore Tab** (`explore.tsx`) - Demo/example content

---

### 3. **Home Screen - Loading Uniform Content** (`app/(tabs)/index.tsx`)

**Flow:**
```
1. Component mounts
2. Creates UniformService instance (with API key & project ID from app.json)
3. Calls fetchCompositionByRoute([]) → Fetches root composition ("/")
4. Sets loading state → Shows ActivityIndicator
5. On success → Passes composition to CompositionRenderer
6. On error → Shows error message
```

**Key Code:**
```typescript
const uniformService = new UniformService({
  apiKey: Constants.expoConfig?.extra?.uniformApiKey,
  projectId: Constants.expoConfig?.extra?.uniformProjectId,
});

const comp = await uniformService.fetchCompositionByRoute([]);
```

---

### 4. **Uniform Service** (`services/uniformService.ts`)

This is your **bridge to Uniform.dev API**:

**What it does:**
- Wraps Uniform's `CanvasClient`
- Provides methods to fetch compositions:
  - `fetchCompositionByRoute(path[])` - Get composition by URL path
  - `fetchCompositionById(id)` - Get composition by ID
  - `fetchRoutes()` - Get all available routes

**How it works:**
```typescript
// Creates CanvasClient with your credentials
this.client = new CanvasClient({
  apiKey: config.apiKey,
  projectId: config.projectId,
  apiHost: 'https://api.uniform.app',
});

// Fetches composition from Uniform
const response = await this.client.getCompositionBySlug({
  slug: routePath,  // e.g., "/" or "/about"
  state: 64,        // Published state (0 = draft)
});
```

**State values:**
- `0` = Draft/Preview mode
- `64` = Published mode

---

### 5. **Composition Renderer** (`components/CompositionRenderer.tsx`)

This is the **core rendering engine** - it recursively renders the Uniform composition tree.

**Flow:**
```
1. Receives ComponentInstance from Uniform
2. Calls resolveComponent() → Maps Uniform type to React Native component
3. Extracts:
   - parameters (component data/props)
   - slots (nested components)
4. Renders the component with:
   - All parameters as props
   - Helper functions (getParameter, getSlot)
5. If component has slots → Recursively renders children
```

**Key Props Passed to Components:**
```typescript
{
  component: ComponentInstance,  // Full Uniform component object
  context: {},                    // Global context (if any)
  parameters: {},                 // All component parameters
  slots: {},                      // All component slots
  getParameter: (id) => value,    // Helper to get param value
  getSlot: (name) => components[] // Helper to get slot components
}
```

---

### 6. **Component Resolver** (`components/resolver.tsx`)

**Maps Uniform component types → React Native components**

This is where you **connect Uniform components to your React Native implementations**:

```typescript
switch (componentType) {
  case 'page':     → Container component
  case 'hero':     → Hero component
  case 'header':   → Header component
  default:         → Fallback (shows "Unknown component type")
}
```

**To add a new component:**
1. Create React Native component (e.g., `ProductCard.tsx`)
2. Add case in `resolver.tsx`
3. Import and map it

---

### 7. **Slot Rendering** (`components/UniformSlot.tsx`)

Uniform uses **slots** to define where nested components can be placed (like children in React).

**How it works:**
- A component can have multiple slots (e.g., `content`, `sidebar`, `footer`)
- Each slot contains an array of `ComponentInstance` objects
- `UniformSlot` iterates through slot components and renders each using `CompositionRenderer`

**Example:**
```typescript
// In Container component
<UniformSlot 
  slot={slots?.content || []}  // Array of components
  context={context}
  slotName="content"
/>
```

---

### 8. **Component Implementations**

#### **Container** (`components/Container.tsx`)
- Represents a "page" type in Uniform
- Renders the `content` slot
- Acts as a wrapper for page-level components

#### **Header** (`components/Header.tsx`)
- Displays brand name and navigation
- Reads parameters: `brandName`, `navPrimaryLabel`, `navPrimaryLink`
- Handles navigation using Expo Router

#### **Hero** (`components/Hero.tsx`)
- Displays hero section with title, description, image, CTA
- Reads parameters: `title`, `description`, `eyebrow`, `primaryCta`, `image`
- Handles button clicks and navigation

**Parameter Access Pattern:**
```typescript
const title = getParameter?.('title') || '';
const image = getParameter?.('image');
```

---

### 9. **Dynamic Routing** (`app/composition/[...path].tsx`)

This handles **any Uniform route** dynamically:

**Flow:**
```
1. User navigates to /composition/about or /composition/products/item
2. Expo Router captures path segments in params.path
3. CompositionScreen:
   - Parses path array
   - Calls uniformService.fetchCompositionByRoute(pathArray)
   - Renders composition using CompositionRenderer
```

**Example:**
- URL: `/composition/about`
- `params.path` = `['about']`
- Fetches composition at route `/about` from Uniform

---

## 🔄 Complete Request Flow Diagram

```
User Opens App
    ↓
app/_layout.tsx (Root Layout)
    ↓
app/(tabs)/_layout.tsx (Tab Navigation)
    ↓
app/(tabs)/index.tsx (Home Screen)
    ↓
Creates UniformService
    ↓
Fetches Composition from Uniform API
    ↓
Receives ComponentInstance (JSON tree)
    ↓
CompositionRenderer receives composition
    ↓
resolveComponent() maps type → React Native component
    ↓
Component renders with parameters & slots
    ↓
If slots exist → UniformSlot renders children
    ↓
Recursively renders entire tree
    ↓
User sees fully rendered page
```

---

## 🆚 Differences from Next.js Implementation

### **Next.js (Web)**
- Uses Uniform's official React components
- Server-side rendering (SSR) support
- Uses HTML elements (`<div>`, `<img>`, etc.)
- Web-specific features (SEO, meta tags)

### **React Native (This Project)**
- **Custom implementation** - No official Uniform React Native package
- Uses React Native components (`<View>`, `<Text>`, `<Image>`, etc.)
- Client-side only (no SSR)
- Mobile-specific features (touch gestures, native navigation)
- Uses Expo Router (file-based routing like Next.js)

---

## 🔑 Key Concepts for React Native Beginners

### **1. Components vs. Screens**
- **Screens** = Full page views (like `index.tsx`)
- **Components** = Reusable UI pieces (like `Header.tsx`, `Hero.tsx`)

### **2. Expo Router (File-based Routing)**
- Similar to Next.js
- File structure = Route structure
- `app/(tabs)/index.tsx` → `/` route
- `app/composition/[...path].tsx` → `/composition/*` (catch-all)

### **3. React Native Components**
- `<View>` = Like `<div>` (container)
- `<Text>` = Like `<p>` or `<span>` (text only)
- `<Image>` = Like `<img>` (but uses `source` prop)
- `<ScrollView>` = Scrollable container
- `<TouchableOpacity>` = Clickable button

### **4. Styling**
- Uses `StyleSheet.create()` (not CSS)
- Similar to CSS but camelCase (`backgroundColor` not `background-color`)
- No CSS classes - styles are JavaScript objects

### **5. Navigation**
- Uses Expo Router's `router.push()` for navigation
- Can pass params: `router.push({ pathname: '/route', params: { id: '123' } })`

---

## 🛠️ How to Add a New Uniform Component

1. **Create React Native Component** (`components/MyComponent.tsx`):
```typescript
import { ComponentInstance } from '@uniformdev/canvas';
import { View, Text } from 'react-native';

interface MyComponentProps {
  component: ComponentInstance;
  getParameter?: (id: string) => any;
}

export function MyComponent({ component, getParameter }: MyComponentProps) {
  const title = getParameter?.('title') || '';
  
  return (
    <View>
      <Text>{title}</Text>
    </View>
  );
}
```

2. **Add to Resolver** (`components/resolver.tsx`):
```typescript
import { MyComponent } from './MyComponent';

// In resolveComponent function:
case 'myComponent':
  return { component: MyComponent };
```

3. **That's it!** Uniform will now render your component when it encounters that type.

---

## 📝 Configuration

**Uniform Credentials** (`app.json`):
```json
"extra": {
  "uniformApiKey": "your-api-key",
  "uniformProjectId": "your-project-id"
}
```

These are accessed via:
```typescript
Constants.expoConfig?.extra?.uniformApiKey
```

---

## 🎯 Summary

**The app works by:**
1. Fetching composition data from Uniform.dev API
2. Recursively rendering the component tree
3. Mapping Uniform component types to React Native components
4. Passing parameters and slots to each component
5. Handling navigation between compositions

**Key Innovation:**
Since Uniform doesn't support React Native, you've built a custom renderer that:
- Uses Uniform's JavaScript SDK to fetch data
- Maps Uniform's component structure to React Native components
- Handles slots and parameters manually
- Implements navigation using Expo Router

This gives you the flexibility of Uniform.dev's headless CMS while using native mobile components!

