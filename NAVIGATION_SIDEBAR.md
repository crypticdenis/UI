# Navigation Sidebar Implementation

## Overview
Added a VS Code-style collapsible navigation sidebar to improve navigation throughout the project hierarchy.

## New Files Created

### 1. `NavigationSidebar.jsx`
- Main navigation component with tree-style folder structure
- Shows hierarchical view: Projects → Workflows → Subworkflows → Runs
- Features:
  - Collapsible/expandable items
  - Active state highlighting
  - Item counts (workflows, runs, etc.)
  - Smooth animations
  - Keyboard navigation support

### 2. `NavigationSidebar.css`
- Styling for the navigation sidebar
- Dark theme matching the existing UI
- VS Code-inspired design
- Responsive layout
- Hover effects and active states
- Collapsible sidebar (280px expanded, 56px collapsed)

## Modified Files

### 1. `App.jsx`
**Changes:**
- Imported `NavigationSidebar` component
- Added `handleNavigate()` function to handle navigation from sidebar
- Integrated sidebar into main layout
- Sidebar state automatically syncs with current view

**Key Function:**
```javascript
handleNavigate(destination, project, workflow, subworkflow, run)
```
Handles navigation to different levels:
- `'projects'` - Returns to projects landing page
- `'project'` - Navigates to workflows overview
- `'workflow'` - Navigates to workflow runs or subworkflows
- `'subworkflow'` - Navigates to subworkflow runs
- `'run'` / `'workflow-run'` - Navigates to specific run details

### 2. `App.css`
**Changes:**
- Updated layout to flexbox to accommodate sidebar
- Added margin-left to main-content (280px for expanded, 56px for collapsed)
- Added smooth transitions for sidebar collapse/expand
- Maintained existing styling for all components
- Added responsive breakpoints

## Features

### Navigation Tree
- **Projects Level**: Shows all projects with workflow counts
- **Workflows Level**: Shows workflows within a project
- **Subworkflows Level**: Shows subworkflows (if any) with run counts
- **Runs Level**: Shows individual run versions

### Interactions
1. **Click on item**: Navigate to that view
2. **Click expand button**: Toggle children visibility
3. **Collapse sidebar button**: Minimize sidebar to icons only
4. **Auto-expand**: Current path is automatically expanded
5. **Active highlighting**: Current location is highlighted

### Visual Indicators
- 🏠 Projects root
- 📁 Individual projects
- ⚙️ Workflows
- 💲 Subworkflows
- ✓ Runs
- Count badges show number of children
- Active items highlighted in blue

### Responsive Design
- Desktop (>1024px): 280px expanded, 56px collapsed
- Tablet (≤1024px): 240px expanded, 48px collapsed
- Smooth transitions during collapse/expand

## Usage

The sidebar automatically reflects the current navigation state. Users can:

1. **Browse the hierarchy**: Click expand buttons to explore the structure
2. **Quick navigation**: Click any item to jump to that view
3. **See current location**: Active path is highlighted in blue
4. **Collapse for more space**: Click the collapse button in the header
5. **Always accessible**: Sidebar is fixed and always visible

## Benefits

✅ **Better orientation**: Users always know where they are in the hierarchy
✅ **Faster navigation**: Direct access to any project/workflow/run
✅ **Visual structure**: Clear representation of project organization
✅ **Persistent context**: Sidebar remains visible across all views
✅ **Familiar UX**: VS Code-inspired design that developers recognize

## Next Steps (Optional Enhancements)

Future improvements could include:
- [ ] Search/filter functionality in sidebar
- [ ] Drag & drop to reorganize items
- [ ] Right-click context menus
- [ ] Keyboard shortcuts for navigation
- [ ] Collapse all / expand all buttons
- [ ] Recently accessed items section
- [ ] Favorites/bookmarks

## Testing

The sidebar has been integrated and should work with:
- All existing views (projects, workflows, runs, etc.)
- Breadcrumb navigation (both work independently)
- Modal overlays (sidebar remains visible)
- Content viewer panel
- Comparison views

Test by navigating through different levels and verifying the sidebar updates correctly.
