# CDS Parser Page - Visual Structure

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│               🔍 CDS Expression Parser                       │
│     Parse CDS (Core Data Services) SELECT statements         │
│              into CQN (CDS Query Notation)                   │
│                                                              │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│  📚 Examples                                                  │
│                                                              │
│  [Simple SELECT] [SELECT with WHERE] [SELECT with ORDER BY] │
│  [SELECT with Alias] [Complex Query]                        │
│                                                              │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│  📝 CDS Query                    [Pretty JSON▼] [Clear] [Parse→] │
│  ┌──────────────────────────────────────────────────────────┐│
│  │ SELECT from Books { ID, title }                          ││
│  │                                                          ││
│  │                                                          ││
│  └──────────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│  📤 CQN Output                                                │
│  ┌──────────────────────────────────────────────────────────┐│
│  │ {                                                        ││
│  │   "SELECT": {                                            ││
│  │     "from": { "ref": ["Books"] },                        ││
│  │     "columns": [                                         ││
│  │       { "ref": ["ID"] },                                 ││
│  │       { "ref": ["title"] }                               ││
│  │     ]                                                    ││
│  │   }                                                      ││
│  │ }                                                        ││
│  └──────────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│  ℹ️ Supported Features                                        │
│                                                              │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │ ✅ SELECT       │  │ ✅ WHERE        │  │ ✅ ORDER BY  │ │
│  │ Statements      │  │ Clauses         │  │              │ │
│  └─────────────────┘  └─────────────────┘  └──────────────┘ │
│                                                              │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │ ✅ Column       │  │ ✅ Nested       │  │ ✅ GROUP BY  │ │
│  │ Aliases         │  │ Fields          │  │              │ │
│  └─────────────────┘  └─────────────────┘  └──────────────┘ │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│  📖 Documentation                                             │
│                                                              │
│  This tool is based on SAP CAP CDS Query Language.          │
│  For more information:                                        │
│                                                              │
│  → SAP CAP CDS Documentation                                 │
│  → CDS Query Language Reference                              │
│  → CQN Specification                                         │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

## Color Scheme

```
Header Background:    Linear gradient #667eea → #764ba2 (purple)
Card Background:      White (#ffffff)
Code Output:          Dark theme (#1e1e1e)
Primary Buttons:      Gradient purple
Secondary Buttons:    Light gray (#f0f0f0)
Text:                 Dark (#333) on light, Light (#d4d4d4) on dark
Shadows:              Subtle box-shadows for depth
```

## Interactive Elements

### Buttons
- **Example buttons**: Purple gradient, hover lift effect
- **Parse button**: Purple gradient with arrow (→)
- **Clear button**: Gray, simple hover effect
- **Format select**: Dropdown with border highlight on focus

### Textarea
- **Input area**: Monospace font, border focus effect
- **Auto-resize**: Vertical resize handle
- **Placeholder**: Helpful text

### Output
- **Code block**: Dark VS Code-like theme
- **Scrollable**: Both vertical and horizontal
- **Formatted**: Syntax-preserved JSON

### Error Display
- **Background**: Light red (#fee)
- **Border**: Red outline
- **Icon**: Warning emoji (⚠️)

## Responsive Breakpoint

```
Desktop (> 768px)
- Multi-column feature grid
- Side-by-side controls
- Full width layout

Mobile (≤ 768px)
- Single column layout
- Stacked controls
- Full width buttons
```

## Accessibility

- ✅ Semantic HTML
- ✅ ARIA labels where needed
- ✅ Keyboard navigation
- ✅ Focus indicators
- ✅ Color contrast (WCAG AA)
- ✅ Responsive text sizing

## Page Flow

```
User Journey:
1. Land on /cds-parser page
2. See title and description
3. Click an example OR type own query
4. Click "Parse →" button
5. View formatted CQN output
6. Modify query and re-parse
7. Learn from feature cards
8. Follow documentation links
```

## Section Descriptions

### Header
- **Purpose**: Introduce the tool
- **Content**: Title, subtitle
- **Style**: Centered, white text on purple gradient

### Examples
- **Purpose**: Quick start with pre-made queries
- **Content**: 5 clickable example buttons
- **Interaction**: Click to populate input

### Input
- **Purpose**: Query entry
- **Content**: Textarea + format selector + action buttons
- **Features**: Clear and Parse actions

### Output
- **Purpose**: Display results
- **Content**: Formatted CQN or error message
- **Style**: Code editor aesthetic (dark theme)

### Features
- **Purpose**: Explain capabilities
- **Content**: 6 feature cards in grid
- **Style**: Gradient cards with hover lift

### Documentation
- **Purpose**: Link to official docs
- **Content**: 3 external links
- **Style**: Simple list with arrow icons
