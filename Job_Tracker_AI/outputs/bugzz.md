# Bug Reports  

## Bug 1: Missing Theme Toggle  
**Title:** Missing Dark Mode / Theme Toggle in Settings 
**Environment:** JobTrackerAI application (React frontend) 
**Severity:** Minor 
**Steps to Reproduce:**
 1. Navigate to the sidebar and click on "Settings". 2. Review the settings options available under the "Display" section. 
**Expected Result:** A toggle to switch between Light and Dark modes should be present, as specified in requirements. 
**Actual Result:** Only "Dense table rows", "Show domain", and "Highlight urgent" toggles are present. The Dark Mode toggle is missing entirely. 
**Evidence:** Captured in `jobtracker_full_test_*.webp`.  
---
  

## Bug 2: Unresponsive Delete Button  
**Title:** Delete button in Table view does not remove job 
**Environment:** JobTrackerAI application (React frontend) 
**Severity:** Critical 
**Steps to Reproduce:**
 1. Navigate to the "Dashboard" or "Table View". 2. Add a new job or find an existing one. 3. Hover over the job row and click the red trash "Delete" icon in the Actions column. 
**Expected Result:** The job entry should be removed from the table and the system. 
**Actual Result:** The button click registers, but the job is not deleted. No confirmation prompt is shown, and the job remains in the list. 
**Evidence:** Captured in `jobtracker_full_test_*.webp`.  
---
  

## Bug 3: Missing CSV Export Functionality (API Testing)  
**Title:** Export CSV button fails to trigger file download 
**Environment:** JobTrackerAI application (Client-side HTML/JS) 
**Severity:** Major 
**Steps to Reproduce:**
 1. Navigate to the `Dashboard` or Table View. 2. Ensure there are jobs in the pipeline. 3. Click the "Export CSV" button in the table toolbar. 
**Expected Result:** A Blob URL should be created and a CSV file containing the job data should be downloaded via the Anchor `.click()` API. 
**Actual Result:** The button click registers, but the `exportCSV()` function is completely missing in the codebase, resulting in a ReferenceError and no file download. 
**Evidence:** Verified missing implementation during the File/Blob & Anchor internal API test suite execution.  
---
  

## Bug 4: Incorrect Active Applications & Hardcoded AI Copilot Metrics  
**Title:** AI Copilot Pipeline Health calculations are inaccurate and partially hardcoded 
**Environment:** JobTrackerAI application (Client-side HTML/JS) 
**Severity:** Major 
**Steps to Reproduce:**
 1. Navigate to the Dashboard. 2. Note the total "Applications" count in the sidebar navigation (which correctly excludes Wishlist items). 3. Open the AI Copilot side panel. 4. Review the "Pipeline Health" message. 5. Attempt to add/delete jobs or change their status. 
**Expected Result:** "Active applications" should only count jobs that are NOT in the Wishlist. Furthermore, the "Strongest opportunity" company and stage should dynamically update based on the highest scored job or furthest pipeline stage in the current data. 
**Actual Result:** "Active applications" simply takes the total length of the `jobs` pipeline (including Wishlist). Additionally, the "Strongest opportunity" text evaluates to static hardcoded HTML ("Figma (offer stage)") which never updates when job data changes. 
**Evidence:** Verified via manual review of edge cases in the `updateAll()` calculation function.  
---
  

## Bug 5: Sidebar Collapse Hides Quick Stats Context  
**Title:** Quick Stats lose color status context when sidebar is collapsed 
**Environment:** JobTrackerAI application (Client-side HTML/CSS) 
**Severity:** Minor 
**Steps to Reproduce:**
 1. Navigate to the Job Tracker dashboard. 2. Note the "Quick Stats" section in the left sidebar, which uses colored dots (`sdot`) to indicate the status category (Blue=Applied, Orange=Interviews, etc.). 3. Click the "Collapse" button at the bottom of the sidebar. 4. Observe the Quick Stats section in the collapsed state. 
**Expected Result:** The colored dots should remain visible next to the numerical pill counts to provide vital visual context for what the numbers signify. 
**Actual Result:** The `.stat-card-text` container is blanket-assigned `display: none` in the collapsed CSS rules, hiding both the text label and the colored dot. Users only see floating number pills without context. 
**Evidence:** Visual verification in browser testing.  
---
  

## Bug 6: Kanban Mode Drag and Drop Missing  
**Title:** Kanban interface does not support dragging cards between columns 
**Environment:** JobTrackerAI application (Client-side HTML/JS) 
**Severity:** Major 
**Steps to Reproduce:**
 1. Navigate to the Job Tracker dashboard. 2. Toggle the main view to "Kanban" using the top bar tabs. 3. Click and hold down on any job application card in any column. 4. Attempt to drag the card into a different status column. 
**Expected Result:** The card should visually attach to the cursor on click-and-drag, and dropping it over a new column should instantly update the job's underlying `status` data and re-render the view. 
**Actual Result:** Drag and drop is completely unhandled. The cards do not visually lift, nor do the columns accept dropped elements.  
**Evidence:** Code inspection reveals missing `draggable="true"` attributes and zero standard HTML5 drag event handlers (`ondragstart`, `ondragover`, `ondrop`) in the JavaScript DOM generation logic.  
---
  

## Bug 7: Duplicate `deleteJob` Logic and Invalid ID Handling (Negative Test N6)  
**Title:** `deleteJob` prompts "Remove undefined" on invalid ID due to duplicate function definitions 
**Environment:** JobTrackerAI application (Client-side HTML/JS) 
**Severity:** Minor 
**Steps to Reproduce:**
 1. Manually invoke `deleteJob(9999)` from the browser console (an ID that does not exist). 
**Expected Result:** The function should instantly reject the invalid ID and return silently, or throw a handled error toast. 
**Actual Result:** The browser triggers a native confirmation dialog asking `Remove "undefined â€” undefined"?`. Clicking OK proceeds with the deletion logic safely, but the UI prompt is broken. Code review reveals there are *two* `deleteJob` functions defined in `index.html`. 
**Evidence:** Code inspection of `index.html` shows `deleteJob` defined at line 1238 and line 1674.  
---
  

## Bug 8: Bulk Select UI State Desync on Filtering (Edge Case E11)  
**Title:** 'Select All' checkbox and bulk counter do not update dynamically when filters are applied 
**Environment:** JobTrackerAI application (Client-side HTML/JS) 
**Severity:** Minor 
**Steps to Reproduce:**
 1. Select all jobs using the main table header checkbox. 2. Apply a search filter (e.g., search for a specific company). 3. Observe the main table header checkbox and the "Delete Selected" counter. 
**Expected Result:** The 'Select All' checkbox state (`indeterminate` or `checked`) should instantly recalculate to reflect the newly filtered subset of visible rows. 
**Actual Result:** `renderTable()` does not call `updateBulkUI()`, leading to a stale front-end bulk UI state that is desynced from the filtered rows. 
**Evidence:** Code inspection of `applyFilters()` and `renderTable()` reveals they omit calling `updateBulkUI()`.  
---
  

## Bug 9: Notification Clear Toast Missing Success Styling  
**Title:** "All notifications marked as read" toast appears natively as Info (blue) instead of Success (green) 
**Environment:** JobTrackerAI application (Client-side HTML/JS) 
**Severity:** Minor 
**Steps to Reproduce:**
 1. Open the Notifications panel by clicking the bell icon. 2. Click "Clear all" to mark all notifications as read. 3. Observe the color and icon of the toast notification that appears. 
**Expected Result:** A green success toast should appear reading "All notifications marked as read", as specified by the test cases. 
**Actual Result:** A blue info toast appears because the `type` parameter was completely omitted from the function call. 
**Evidence:** Code inspection of `clearNotifs()` at line 1781 shows `toast('All notifications marked as read');` without providing the `'success'` styling argument.  
---
  

## Bug 10: Theme Toggle (Dark/Light Mode) Non-Functional in React App  
**Title:** Dark/Light mode toggle has no visual effect â€” missing `html.dark` CSS variables  
**Environment:** JobTrackerAI React application running at `localhost:5173` (Vite + React + Zustand)  
**Severity:** Critical  
**Steps to Reproduce:**
 1. Navigate to the Job Tracker AI React app at `http://localhost:5173/`. 2. Look for any theme toggle button in the TopBar, Sidebar, or Settings. 3. If found, click the toggle to switch between dark and light modes.  
**Expected Result:** The entire application UI should transition between light and dark color schemes when the toggle is activated. Dark mode should apply dark backgrounds, light text, and adjusted color tokens across all components.  
**Actual Result:** The React app's `useUIStore.ts` had no `isDarkMode` state, no `toggleTheme` action, and no `localStorage` persistence. The `TopBar.tsx` component had no theme toggle button rendered. Most critically, the `index.css` file was completely missing the `html.dark { }` CSS variable override block, meaning even if the `dark` class was toggled on `<html>`, no visual changes would occur.  
**Root Cause:** Three-fold: 1. `useUIStore.ts` â€” Missing `isDarkMode` state and `toggleTheme` method 2. `TopBar.tsx` â€” No Sun/Moon toggle button rendered in the topbar 3. `index.css` â€” Missing `html.dark` CSS variable block with dark-palette overrides  
**Resolution:** âœ… **FIXED** â€” Added `isDarkMode` state with `toggleTheme` action and `localStorage` persistence to `useUIStore.ts`. Added Sun/Moon toggle button to `TopBar.tsx`. Added complete `html.dark { }` CSS variable override block to `index.css`. Also fixed hard-coded `#fff` background values in focus states that broke dark mode visuals.  
**Retest Status:** âœ… **PASSED** â€” Dark mode toggles correctly, all UI components (KPI cards, table, sidebar, copilot panel, badges) render with proper dark palette. Light mode reverts cleanly. Theme preference persists across page reloads via localStorage.  
**Evidence:** Verified via browser testing at `localhost:5173`. Screenshots confirm dark and light mode switching.  
---
  

## Bug 11: Sidebar Collapse Button Non-Functional in React App  
**Title:** Sidebar "Collapse" button does not minimize the sidebar to icon-only state  
**Environment:** JobTrackerAI React application running at `localhost:5173` (Vite + React + Zustand)  
**Severity:** Major  
**Steps to Reproduce:**
 1. Navigate to the Job Tracker AI React app at `http://localhost:5173/`. 2. Scroll down to the bottom of the left sidebar. 3. Click the "Collapse" footer item. 4. Observe the sidebar behavior.  
**Expected Result:** The sidebar should animate to a narrow, icon-only collapsed state (56px width), hiding all text labels, filter sections, and footer text. The main content area should expand to fill the freed space.  
**Actual Result:** The sidebar toggle was functional â€” `Sidebar.tsx` correctly applied the `collapsed` class via the `sidebarOpen` state in `useUIStore.ts`, and the CSS rules in `index.css` (`.sidebar.collapsed`) were already defined and correct. The sidebar collapses properly.  
**Root Cause:** Upon investigation, the sidebar collapse feature was already working correctly. The initial testing reported it as broken due to the sidebar needing to be scrolled to reach the Collapse button, and the tester may have encountered a click-target misalignment.  
**Resolution:** âœ… **VERIFIED WORKING** â€” No code changes needed. The sidebar collapse/expand functionality works as designed.  
**Retest Status:** âœ… **PASSED** â€” Sidebar collapses to icon-only (56px) state and expands back to full width (224px). Navigation icons remain accessible in collapsed state.  
**Evidence:** Verified via browser testing at `localhost:5173`. Screenshot confirms sidebar in collapsed icon-only state with main content expanded.   

## Bug 12: Missing "Columns" Menu Interface  
**Title:** "Columns" toolbar button does not open a menu and triggers a placeholder toast  
**Environment:** JobTracker AI Enterprise UI (index.html) running at localhost:5173  
**Severity:** Moderate  
**Steps to Reproduce:**
 1. Navigate to the Dashboard table view. 2. Click the "Columns" button in the table toolbar.  
**Expected Result:** A dropdown or modal should appear allowing the user to toggle visibility of specific table columns.  
**Actual Result:** The button executes 	oggleColMenu() which only displays a toast notification saying "Column visibility — toggle 'Show domain' in Settings".  
**Evidence:** Browser Subagent testing ( edesign_qa_1774163628774.webp) and index.html source code inspection.  
---
  

## Bug 13: Incomplete Sidebar Navigation Links  
**Title:** "Applications", "Interviews", and "Documents" sidebar links display placeholder toasts instead of changing views  
**Environment:** JobTracker AI Enterprise UI (index.html) running at localhost:5173  
**Severity:** Major  
**Steps to Reproduce:**
 1. Click "Applications", "Interviews", or "Documents" in the left sidebar. 2. Observe the main view.  
**Expected Result:** The main view should update to show specific views (e.g. filtered by status or specific content).  
**Actual Result:** The main layout does not update. A toast notification appears saying "[Page title] — full view in v2".  
**Evidence:** Browser Subagent navigation testing ( edesign_qa_1774163628774.webp) and source code review of  avTo() function. 

## Bug 14: XSS Vulnerability in Job Inputs

**Title:** User inputs are not sanitized, leading to Cross-Site Scripting (XSS) execution

**Environment:** JobTracker AI Enterprise UI (index.html) running at localhost:5173

**Severity:** Critical

**Steps to Reproduce:**
1. Click "New Job" to open the Add Job modal.
2. In the "Company" or "Role" fields, input `<script>alert('XSS Demo')</script>`.
3. Click "Add Job" to save the entry.
4. Observe the Dashboard or Kanban views.

**Expected Result:** The input should be encoded/escaped as plaintext and render safely in the DOM without executing.

**Actual Result:** The script tag is injected directly into the `innerHTML` of the table and grid cards without sanitization. If actual javascript is provided, it fires immediately (XSS execution).

**Evidence:** Static Application Security Testing (SAST) and manual dynamic parameter injection during testing.

---

## Bug 15: Discarded Data upon Session Reload (No Persistence)

**Title:** Newly created jobs are lost upon tab reload due to absent data persistence

**Environment:** JobTracker AI Enterprise UI (index.html) running at localhost:5173

**Severity:** Critical

**Steps to Reproduce:**
1. Add a new job to the pipeline.
2. Ensure the job correctly appears in the Dashboard list.
3. Refresh the browser tab (F5).

**Expected Result:** The newly added job should still be present in the pipeline upon reloading the page.

**Actual Result:** The job disappears because the `jobs` array states are only held in temporary browser memory and are not synchronized with `localStorage` or any database. The state is permanently lost across sessions.

**Evidence:** Data Endurance testing, Recovery testing, and manual load reviews.
