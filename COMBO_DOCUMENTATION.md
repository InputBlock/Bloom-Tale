# Combo Builder System - Documentation

## Overview
The Combo Builder is a sophisticated feature that allows users to create custom product combinations with flowers, balloons, and candles, receiving an automatic 20% discount on their final order.

## Architecture

### 1. **Context Management** (`ComboContext.jsx`)
The combo state is managed globally using React Context API, providing:

#### State Variables:
- `comboItems`: Array of selected products with their configurations
- `pincode`: User's delivery pincode
- `pincodeVerified`: Boolean indicating pincode verification status
- `deliveryOption`: 'today' or 'tomorrow'
- `deliveryCategory`: For 'today' - 'schedule', 'midnight', or 'express'
- `deliveryCharges`: Calculated based on delivery selection

#### Key Functions:
- `addToCombo(product)`: Adds product to combo or updates quantity
- `removeFromCombo(productId, size, color)`: Removes specific item variant
- `updateQuantity(productId, size, color, quantity)`: Updates item quantity
- `verifyPincode(code)`: Validates pincode (< 500000)
- `selectDeliveryOption(option, category)`: Sets delivery preference and charges
- `calculateTotal()`: Returns subtotal before discount
- `calculateDiscount()`: Returns 20% discount amount
- `calculateFinalTotal()`: Returns total with discount and delivery charges

### 2. **Main Combo Page** (`Combo.jsx`)

#### Features:
- **Hero Section**: Eye-catching header with 20% discount badge
- **How It Works**: 4-step visual guide
- **Product Grid**: Responsive grid showing available combo products
- **Floating Cart Button**: Mobile-optimized quick access
- **Benefits Section**: Highlights combo advantages

#### User Flow:
1. Browse available products (flowers, balloons, candles)
2. Click product to open customization modal
3. Customize and add to combo
4. View combo in sidebar
5. Verify pincode
6. Select delivery option
7. Add combo to cart

### 3. **Combo Sidebar** (`ComboSidebar.jsx`)

#### Sections:

**A. Header**
- Displays combo item count
- Prominent branding with gradient background

**B. Pincode Verification**
- Input for 6-digit pincode
- Real-time validation
- "Change" option for verified pincodes
- Error messages for invalid/unserviceable pincodes

**C. Delivery Options** (shown after pincode verification)
- **Today or Tomorrow toggle**
- **Today options:**
  - Schedule (3-5 hours) - ₹99
  - Midnight (By 12 AM) - ₹199
  - Express (Within 2 hours) - ₹299
- **Tomorrow:**
  - Fixed ₹249 delivery charge

**D. Combo Items List**
- Product image thumbnails
- Item details (size, color)
- Quantity controls (+/-)
- Remove button
- Individual and total pricing

**E. Price Summary**
- Subtotal
- 20% Combo Discount (highlighted in green)
- Delivery Charges
- Final Total

**F. Action Button**
- Context-aware text:
  - "Verify Pincode First" (if not verified)
  - "Select Delivery Option" (if verified but no delivery)
  - "Add to Cart" (when ready)

### 4. **Product Detail Modal** (`ComboProductDetail.jsx`)

#### Dynamic Content Based on Product Type:

**For Flowers:**
- Size selection: Small, Medium, Large
- Pricing based on size
- Variant-specific pricing display

**For Balloons/Candles:**
- Color selection: 8 predefined colors with visual swatches
- Single price point

#### Features:
- Large product image
- Category badge
- Description
- Stock status
- Quantity selector
- Real-time price calculation
- Pincode verification prompt (if not verified)

#### Interaction Flow:
1. User clicks product from grid
2. Modal opens with product details
3. User selects size/color
4. User adjusts quantity
5. User clicks "Add to Your Combo"
6. If pincode not verified, shows verification modal
7. Upon verification, item added to sidebar
8. Modal closes, user continues shopping

## Key UI/UX Decisions

### 1. **Visual Hierarchy**
- Gradient backgrounds for emphasis
- Large, readable typography (Playfair Display for headings)
- Clear CTAs with sufficient contrast
- Consistent color scheme (#3e4026 brand color)

### 2. **Progressive Disclosure**
- Pincode input visible from start
- Delivery options shown only after verification
- Sidebar expands when items added
- Detailed product info in modal, not cluttering main view

### 3. **Feedback & Validation**
- Real-time pincode validation
- Visual success/error states
- Loading states for async operations
- Disabled states with clear messaging

### 4. **Mobile Optimization**
- Responsive grid layouts
- Touch-friendly button sizes
- Floating action button for cart access
- Full-screen modals on mobile
- Sidebar becomes overlay on small screens

### 5. **Micro-interactions**
- Smooth transitions and animations
- Hover effects on products
- Quantity button feedback
- Pulse animations for verified status
- Gradient hover on CTAs

## Data Flow

```
User Action → ComboContext → ComboSidebar/ComboPage
     ↓
Product Selection → ComboProductDetail Modal
     ↓
Customization → addToCombo()
     ↓
Pincode Entry → verifyPincode()
     ↓
Delivery Selection → selectDeliveryOption()
     ↓
Add to Cart → CartContext
```

## Integration Points

### With Cart System:
The combo is added to cart as a **single product** with:
```javascript
{
  product_id: `combo_${timestamp}`,
  name: "Custom Combo",
  items: [...comboItems],
  subtotal: calculateTotal(),
  discount: calculateDiscount(),
  deliveryCharges: deliveryCharges,
  total: calculateFinalTotal(),
  pincode: pincode,
  deliveryOption: deliveryOption,
  deliveryCategory: deliveryCategory,
  quantity: 1,
  isCombo: true
}
```

### Backend Requirements:
1. Products must have `pricing` object with size/color variants
2. Product categories should include: 'flower', 'balloon', 'candle'
3. Cart endpoint should handle combo products with `isCombo: true`
4. Order processing should maintain combo integrity

## Styling Conventions

### Color Palette:
- Primary: `#3e4026` (Dark olive)
- Secondary: `#5a5c3d` (Medium olive)
- Background: `#f9f8f6` (Warm white)
- Accent: `#eef0e8` (Soft green)
- Success: Green tones
- Error: Red tones

### Typography:
- Headings: 'Playfair Display, serif'
- Body: System fonts
- Tracking: `0.12em` for labels

### Spacing:
- Consistent use of Tailwind spacing scale
- Generous padding for touch targets (min 44px)
- Responsive gaps in grids

## Future Enhancements

1. **Save Combos**: Allow users to save combo configurations
2. **Share Combos**: Generate shareable links
3. **Combo Templates**: Pre-made popular combinations
4. **Image Collage**: Generate preview image of combo items
5. **Recommendations**: Suggest complementary products
6. **Bulk Pricing**: Additional discounts for large combos
7. **Gift Wrapping**: Option to add gift wrapping to combo
8. **Custom Messages**: Include greeting cards

## Accessibility

- Semantic HTML structure
- ARIA labels where needed
- Keyboard navigation support
- Focus states for all interactive elements
- High contrast text
- Screen reader friendly

## Performance Optimizations

- Lazy loading of product images
- Debounced pincode validation
- Memoized calculations
- Conditional rendering of heavy components
- CSS animations over JS animations

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Responsive design (320px - 4K)
- Touch and mouse input support
- Graceful degradation for older browsers

---

## Quick Start Guide

1. Navigate to `/combo` route
2. Browse products in grid
3. Click product to customize
4. Select size/color and quantity
5. Add to combo
6. Verify pincode in sidebar
7. Choose delivery option
8. Review combo summary
9. Add to cart
10. Proceed to checkout

The combo will appear in cart as a single item with all products bundled together!
