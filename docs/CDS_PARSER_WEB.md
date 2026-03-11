# CDS Parser Web Integration

## Overview

The CDS Expression Parser has been successfully integrated into your Next.js resume/profile website as an interactive web page.

## Accessing the Page

Once the development server is running, you can access the CDS Parser at:

```
http://localhost:3000/cds-parser
```

Or in production:
```
https://upinggo.github.io/profile/cds-parser
```

## Features

### 🎨 Interactive UI
- **Live parsing** - Type CDS queries and see results instantly
- **Example queries** - Click pre-loaded examples to test quickly
- **Multiple output formats** - Switch between Pretty JSON and Compact JSON
- **Error handling** - Clear error messages when parsing fails
- **Responsive design** - Works on desktop, tablet, and mobile

### 🔍 Query Examples
The page includes 5 built-in examples:
1. Simple SELECT
2. SELECT with WHERE
3. SELECT with ORDER BY
4. SELECT with Alias
5. Complex Query

### 📚 Documentation
The page includes:
- List of supported features
- Links to SAP CAP documentation
- Feature cards explaining capabilities

## Files Created

### Main Page Component
**`src/app/cds-parser/page.tsx`**
- Client-side React component
- Embedded CDS Parser class (TypeScript version)
- Interactive UI with state management
- Example queries and documentation

### Styling
**`src/app/cds-parser/cds-parser.module.css`**
- Modern gradient design (purple theme)
- Responsive layout
- Smooth animations and transitions
- Dark theme code editor for output
- Feature cards with hover effects

### Navigation Update
**`src/app/ProfileContainer/page.tsx`**
- Added "🔍 CDS Expression Parser" link
- Positioned between Technology Stack and LeetCode links

## Design Highlights

### Color Scheme
- **Primary gradient**: Purple (`#667eea` to `#764ba2`)
- **Background**: White cards with shadows
- **Code output**: Dark theme (`#1e1e1e` background)
- **Accents**: Gradient buttons and hover effects

### Layout
- **Centered content**: Max-width 1200px
- **Card-based sections**: Distinct areas for different functions
- **Grid layout**: Feature cards in responsive grid
- **Flexible controls**: Responsive button layout

### User Experience
- **One-click examples**: Try queries instantly
- **Clear visual feedback**: Parse button with gradient
- **Error visibility**: Red background for errors
- **Smooth interactions**: Transitions on hover and click

## Usage Guide

### Basic Usage
1. Visit `/cds-parser` page
2. Type or select an example CDS query
3. Click "Parse →" button
4. View the CQN output

### Example Workflow
```
1. Click "Simple SELECT" example
2. Query appears: SELECT from Books { ID, title }
3. Click "Parse →"
4. See CQN output:
   {
     "SELECT": {
       "from": { "ref": ["Books"] },
       "columns": [
         { "ref": ["ID"] },
         { "ref": ["title"] }
       ]
     }
   }
```

### Modifying Queries
- Edit the textarea directly
- Try different operators: `=`, `!=`, `<`, `>`, `<=`, `>=`
- Add WHERE clauses
- Include ORDER BY with ASC/DESC
- Use column aliases with AS

## Technical Details

### Component Structure
```tsx
CDSParserPage
├── Header (title and subtitle)
├── Examples Section (quick examples)
├── Input Section (textarea + controls)
├── Output Section (CQN display or errors)
├── Info Section (feature cards)
└── Documentation Section (external links)
```

### State Management
- `input`: Current query text
- `output`: Parsed CQN result
- `error`: Error message if parsing fails
- `format`: Output format (json/pretty)

### Parser Integration
- **Client-side only**: No server required
- **Embedded parser**: TypeScript class included in component
- **Browser-compatible**: No Node.js dependencies
- **Type-safe**: Full TypeScript support

## Building for Production

The page is fully static and will be included in production builds:

```bash
npm run build
```

Output shows:
```
Route (app)                    Size     First Load JS
├ ○ /cds-parser               3.06 kB   90.5 kB
```

## Testing

### Local Development
```bash
npm run dev
# Visit http://localhost:3000/cds-parser
```

### Production Build
```bash
npm run build
npm run preview
# Visit http://localhost:3000/cds-parser
```

### Test Cases
1. ✅ Simple SELECT query
2. ✅ Query with WHERE clause
3. ✅ Query with ORDER BY
4. ✅ Column aliases
5. ✅ Nested field references
6. ✅ Error handling (empty/invalid queries)
7. ✅ Format switching (JSON/Pretty)
8. ✅ Example button clicks
9. ✅ Clear functionality
10. ✅ Responsive design

## Navigation Integration

The CDS Parser is now accessible from your main profile page:
- Listed in "Additional Resources" section
- Positioned prominently with an icon (🔍)
- Uses the same Navigation component as other links

## Responsive Design

### Desktop (> 768px)
- Full-width layout with max 1200px
- Side-by-side controls
- 2-3 column feature grid

### Mobile (< 768px)
- Stacked layout
- Full-width buttons
- Single column feature grid
- Adjusted font sizes

## Browser Support

✅ Chrome/Edge (latest)
✅ Firefox (latest)
✅ Safari (latest)
✅ Mobile browsers

## Performance

- **Fast parsing**: Client-side, no network requests
- **Small bundle**: ~3KB additional size
- **No runtime dependencies**: Pure TypeScript
- **Static generation**: Pre-rendered HTML

## Future Enhancements

Potential improvements:
- [ ] Save/load queries from localStorage
- [ ] Share queries via URL parameters
- [ ] Export CQN as file
- [ ] Syntax highlighting for input
- [ ] More example queries
- [ ] Query history
- [ ] Visual query builder
- [ ] Integration with actual CDS data

## Troubleshooting

### Page not found
- Ensure dev server is running: `npm run dev`
- Check route: `/cds-parser` (not `/cds-parser/`)

### Parser errors
- Check query syntax matches CDS format
- Use single quotes for strings: `'value'`
- Verify column names are valid

### Styling issues
- CSS module should be co-located with component
- Check browser console for errors
- Verify CSS imports in page.tsx

## Links

- **Live page**: http://localhost:3000/cds-parser (dev)
- **GitHub**: https://github.com/upinggo/profile
- **SAP CAP Docs**: https://cap.cloud.sap/docs/node.js/cds-ql

---

**Created**: 2026-03-11
**Status**: ✅ Fully Functional
**Build**: ✅ Passing
**Tests**: ✅ Manual testing complete
