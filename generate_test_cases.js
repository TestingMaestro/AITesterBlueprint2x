// generate_test_cases.js — Generates 100 VWO regression test cases from PRD & Test Plan
const fs = require('fs');

const testCases = [];
let id = 1;
const tc = (module, title, preconditions, steps, expectedResult, priority, type) => {
  testCases.push({
    id: `TC_${String(id++).padStart(3,'0')}`,
    module, title, preconditions, steps, expectedResult, priority, type
  });
};

// ===== AUTHENTICATION (15 cases) =====
tc("Authentication","Valid Login with correct credentials","User has a registered VWO account","1. Navigate to app.vwo.com\n2. Enter valid email\n3. Enter valid password\n4. Click Login","User is redirected to VWO Dashboard successfully","High","Functional");
tc("Authentication","Login with invalid password","User has a registered VWO account","1. Navigate to app.vwo.com\n2. Enter valid email\n3. Enter incorrect password\n4. Click Login","Error message displayed: Invalid credentials","High","Functional");
tc("Authentication","Login with unregistered email","No account exists for the email","1. Navigate to app.vwo.com\n2. Enter unregistered email\n3. Enter any password\n4. Click Login","Error message displayed: Account not found","High","Functional");
tc("Authentication","Login with empty email field","User is on login page","1. Navigate to app.vwo.com\n2. Leave email field empty\n3. Enter password\n4. Click Login","Validation error: Email is required","Medium","UI");
tc("Authentication","Login with empty password field","User is on login page","1. Navigate to app.vwo.com\n2. Enter valid email\n3. Leave password empty\n4. Click Login","Validation error: Password is required","Medium","UI");
tc("Authentication","Forgot Password flow","User has a registered account","1. Click Forgot Password link\n2. Enter registered email\n3. Click Submit\n4. Check email for reset link","Password reset email is sent with a secure token link","High","Functional");
tc("Authentication","Password reset with invalid email","User is on forgot password page","1. Click Forgot Password\n2. Enter unregistered email\n3. Click Submit","Error message: No account found with this email","Medium","Functional");
tc("Authentication","Remember Me checkbox functionality","User has valid credentials","1. Navigate to app.vwo.com\n2. Enter valid credentials\n3. Check Remember Me\n4. Login\n5. Close browser\n6. Reopen app.vwo.com","User session is preserved; user remains logged in","Medium","Functional");
tc("Authentication","Logout from VWO","User is logged into VWO","1. Click user profile/avatar\n2. Click Logout","User is logged out and redirected to login page; session is invalidated","High","Functional");
tc("Authentication","SSO Login integration","Enterprise SSO is configured for user organization","1. Navigate to app.vwo.com\n2. Click SSO Login option\n3. Enter SSO credentials\n4. Authenticate via identity provider","User is authenticated via SSO and redirected to VWO Dashboard","High","Functional");
tc("Authentication","Multi-Factor Authentication setup","User has MFA enabled in settings","1. Login with valid credentials\n2. System prompts for 2FA code\n3. Enter valid 2FA code","User is authenticated and redirected to dashboard","High","Functional");
tc("Authentication","Login with invalid 2FA code","User has MFA enabled","1. Login with valid credentials\n2. Enter invalid 2FA code","Error: Invalid authentication code; access denied","High","Functional");
tc("Authentication","Email format validation on login","User is on login page","1. Enter invalid email format (e.g., user@)\n2. Tab out of email field","Real-time validation error: Please enter a valid email address","Medium","UI");
tc("Authentication","Password strength indicator on signup","User is on registration page","1. Navigate to signup page\n2. Start typing password\n3. Observe strength indicator","Password strength indicator shows Weak/Medium/Strong based on complexity","Low","UI");
tc("Authentication","Rate limiting on failed login attempts","User is on login page","1. Enter wrong password 5 times consecutively","Account is temporarily locked; rate limiting message displayed","High","Regression");

// ===== DASHBOARD & NAVIGATION (10 cases) =====
tc("Dashboard & Navigation","Dashboard loads after login","User is logged in","1. Login with valid credentials\n2. Observe dashboard","Dashboard loads within 2 seconds showing summary widgets and recent activity","High","Functional");
tc("Dashboard & Navigation","Navigation sidebar displays all modules","User is on dashboard","1. Observe left sidebar navigation","Sidebar shows: A/B Testing, Heatmaps, Session Recordings, Funnels, Personalization, Reports, Settings","High","UI");
tc("Dashboard & Navigation","Switch between Light and Dark mode","User is on dashboard","1. Click theme toggle\n2. Select Dark Mode\n3. Verify UI\n4. Switch back to Light Mode","Theme changes successfully; all UI elements render correctly in both modes","Medium","UI");
tc("Dashboard & Navigation","Responsive layout on tablet","User accesses VWO on tablet","1. Open app.vwo.com on tablet browser\n2. Navigate through modules","Layout adapts responsively; no horizontal scroll; all elements accessible","Medium","UI");
tc("Dashboard & Navigation","Responsive layout on mobile","User accesses VWO on mobile","1. Open app.vwo.com on mobile browser\n2. Navigate through modules","Mobile-friendly layout with hamburger menu; touch-friendly controls","Medium","UI");
tc("Dashboard & Navigation","Breadcrumb navigation","User is in a nested page","1. Navigate to A/B Testing > Campaign > Edit\n2. Observe breadcrumb","Breadcrumb shows correct path; clicking parent navigates back correctly","Low","UI");
tc("Dashboard & Navigation","Dashboard recent activity widget","User has prior campaigns","1. Login and view dashboard\n2. Check recent activity section","Recent campaigns, tests, and changes are displayed in chronological order","Medium","Functional");
tc("Dashboard & Navigation","Quick search from dashboard","User is on dashboard","1. Click search bar\n2. Type a campaign name\n3. Press Enter","Relevant campaigns and tests are shown in search results","Medium","Functional");
tc("Dashboard & Navigation","Keyboard navigation accessibility","User is on dashboard","1. Use Tab key to navigate through interactive elements\n2. Use Enter to activate buttons","All interactive elements are accessible via keyboard; focus indicators visible","Medium","Regression");
tc("Dashboard & Navigation","Screen reader compatibility","User is on dashboard with screen reader","1. Enable screen reader\n2. Navigate through dashboard","ARIA labels are announced correctly; all elements are screen-reader accessible","Low","Regression");

// ===== A/B TESTING (15 cases) =====
tc("A/B Testing","Create new A/B test campaign","User is logged in with campaign creation permissions","1. Navigate to A/B Testing\n2. Click Create New Test\n3. Enter campaign name\n4. Define test URL\n5. Save","New A/B test campaign is created and visible in campaigns list","High","Functional");
tc("A/B Testing","Add variation to A/B test","An A/B test campaign exists","1. Open existing campaign\n2. Click Add Variation\n3. Configure variation changes\n4. Save","New variation is added to the campaign and displayed in variations list","High","Functional");
tc("A/B Testing","Configure goals for A/B test","An A/B test campaign exists with variations","1. Open campaign\n2. Navigate to Goals section\n3. Add a goal (e.g., Click, Page Visit, Revenue)\n4. Save","Goal is configured and associated with the campaign","High","Functional");
tc("A/B Testing","Set traffic split between variations","A/B test has 2+ variations","1. Open campaign\n2. Navigate to Traffic Allocation\n3. Set split (e.g., 50/50)\n4. Save","Traffic is split as configured between variations","High","Functional");
tc("A/B Testing","Start A/B test campaign","Campaign has URL, variations, and goals configured","1. Open campaign\n2. Click Start\n3. Confirm","Campaign status changes to Running; tracking begins","High","Functional");
tc("A/B Testing","Pause running A/B test","A campaign is currently running","1. Open running campaign\n2. Click Pause\n3. Confirm","Campaign status changes to Paused; data collection stops","High","Functional");
tc("A/B Testing","Stop and archive A/B test","A campaign is running or paused","1. Open campaign\n2. Click Stop\n3. Confirm\n4. Optionally archive","Campaign is stopped and can be archived; historical data preserved","Medium","Functional");
tc("A/B Testing","Duplicate an existing campaign","An A/B test campaign exists","1. Open campaign\n2. Click Duplicate\n3. Modify name\n4. Save","A copy of the campaign is created with all settings replicated","Medium","Functional");
tc("A/B Testing","Delete an A/B test campaign","A draft or stopped campaign exists","1. Open campaign\n2. Click Delete\n3. Confirm deletion","Campaign is permanently deleted; removed from campaigns list","Medium","Functional");
tc("A/B Testing","View A/B test results","A completed A/B test has collected data","1. Open completed campaign\n2. Navigate to Results tab","Results show conversion rates, statistical significance, and winner declaration","High","Functional");
tc("A/B Testing","Edit variation using Visual Editor","Campaign is in draft state","1. Open campaign variation\n2. Launch Visual Editor\n3. Make element changes\n4. Save","Changes are saved to the variation and reflected in preview","High","Functional");
tc("A/B Testing","Preview A/B test variation","Variations are configured","1. Open campaign\n2. Click Preview on a variation","Variation preview loads showing the modified page correctly","Medium","UI");
tc("A/B Testing","Set audience targeting for campaign","Campaign exists in draft","1. Open campaign\n2. Navigate to Targeting\n3. Set conditions (URL, device, location)\n4. Save","Targeting rules are saved and applied to the campaign","High","Functional");
tc("A/B Testing","Schedule A/B test for future date","Campaign is fully configured","1. Open campaign\n2. Set schedule start date/time\n3. Save","Campaign is scheduled and auto-starts at the configured date/time","Medium","Functional");
tc("A/B Testing","Multi-page A/B test setup","User needs cross-page testing","1. Create campaign\n2. Enable Multi-page test\n3. Add multiple URLs\n4. Configure variations per page\n5. Save","Multi-page test is configured; all pages track together as one campaign","Medium","Regression");

// ===== HEATMAPS & SESSION RECORDINGS (10 cases) =====
tc("Heatmaps & Session Recordings","Create a new heatmap","User is logged in","1. Navigate to Heatmaps\n2. Click Create New\n3. Enter target URL\n4. Save","Heatmap is created and tracking begins on the target URL","High","Functional");
tc("Heatmaps & Session Recordings","View click heatmap data","Heatmap has collected click data","1. Open heatmap\n2. Select Click Map view","Click heatmap displays with color-coded hotspots showing click density","High","Functional");
tc("Heatmaps & Session Recordings","View scroll heatmap data","Heatmap has collected scroll data","1. Open heatmap\n2. Select Scroll Map view","Scroll depth visualization shows percentage of users reaching each section","High","Functional");
tc("Heatmaps & Session Recordings","View mouse tracking heatmap","Heatmap has collected movement data","1. Open heatmap\n2. Select Mouse Tracking view","Mouse movement overlay shows areas of user attention and hover patterns","Medium","Functional");
tc("Heatmaps & Session Recordings","Create session recording","User is logged in","1. Navigate to Session Recordings\n2. Click Create New\n3. Configure target page and sample rate\n4. Save","Session recording is activated on the target page","High","Functional");
tc("Heatmaps & Session Recordings","Playback session recording","Recordings have been captured","1. Navigate to Session Recordings list\n2. Select a recording\n3. Click Play","Session replay shows user interactions including clicks, scrolls, and navigation","High","Functional");
tc("Heatmaps & Session Recordings","Filter session recordings by date","Multiple recordings exist","1. Open Session Recordings\n2. Apply date range filter","Only recordings within the selected date range are displayed","Medium","Functional");
tc("Heatmaps & Session Recordings","Filter session recordings by device","Multiple recordings exist","1. Open Session Recordings\n2. Filter by device type (Desktop/Mobile/Tablet)","Only recordings matching the selected device type are shown","Medium","Functional");
tc("Heatmaps & Session Recordings","Delete a heatmap","A heatmap exists","1. Open Heatmaps list\n2. Select a heatmap\n3. Click Delete\n4. Confirm","Heatmap is deleted; tracking stops; data is removed","Low","Functional");
tc("Heatmaps & Session Recordings","Heatmap data export","Heatmap has data","1. Open heatmap with data\n2. Click Export\n3. Select format","Heatmap data is exported in the selected format (CSV/PDF)","Medium","Regression");

// ===== FUNNELS & FORM ANALYTICS (8 cases) =====
tc("Funnels & Form Analytics","Create a new funnel","User is logged in","1. Navigate to Funnels\n2. Click Create New Funnel\n3. Add funnel steps (URLs)\n4. Save","Funnel is created and begins tracking user progression through steps","High","Functional");
tc("Funnels & Form Analytics","View funnel conversion rates","Funnel has collected data","1. Open funnel\n2. View conversion visualization","Funnel chart shows drop-off rates between each step with percentages","High","Functional");
tc("Funnels & Form Analytics","Edit funnel steps","An existing funnel is created","1. Open funnel\n2. Add/remove/reorder steps\n3. Save","Funnel steps are updated; tracking reflects new step configuration","Medium","Functional");
tc("Funnels & Form Analytics","Create form analytics tracking","User is logged in","1. Navigate to Form Analytics\n2. Click Create New\n3. Enter form page URL\n4. Save","Form analytics tracking is activated on the specified form","High","Functional");
tc("Funnels & Form Analytics","View form field interaction data","Form analytics has collected data","1. Open form analytics report","Report shows field-level metrics: time spent, hesitation, drop-off per field","High","Functional");
tc("Funnels & Form Analytics","Filter funnel data by date range","Funnel has historical data","1. Open funnel\n2. Apply date range filter","Funnel data is filtered to show only the selected date range","Medium","Functional");
tc("Funnels & Form Analytics","Compare funnel segments","Funnel has data from multiple segments","1. Open funnel\n2. Apply segment comparison","Side-by-side comparison shows conversion differences between segments","Medium","Regression");
tc("Funnels & Form Analytics","Delete a funnel","A funnel exists","1. Open Funnels list\n2. Select funnel\n3. Click Delete\n4. Confirm","Funnel is deleted; tracking stops","Low","Functional");

// ===== PERSONALIZATION & FEATURE FLAGS (8 cases) =====
tc("Personalization & Feature Flags","Create personalization campaign","User is logged in with permissions","1. Navigate to Personalization\n2. Click Create Campaign\n3. Define audience segment\n4. Configure personalized content\n5. Save","Personalization campaign is created targeting the specified audience","High","Functional");
tc("Personalization & Feature Flags","Set audience targeting rules","Personalization campaign exists in draft","1. Open campaign\n2. Navigate to Targeting\n3. Add rules (location, device, behavior)\n4. Save","Targeting rules are saved and will filter users for personalization","High","Functional");
tc("Personalization & Feature Flags","Activate personalization campaign","Campaign is fully configured","1. Open campaign\n2. Click Activate\n3. Confirm","Campaign status changes to Active; personalized content serves to matched users","High","Functional");
tc("Personalization & Feature Flags","Create a feature flag","User has feature flag permissions","1. Navigate to Feature Flags\n2. Click Create Flag\n3. Enter flag name and key\n4. Configure rollout percentage\n5. Save","Feature flag is created with specified rollout configuration","High","Functional");
tc("Personalization & Feature Flags","Toggle feature flag on/off","A feature flag exists","1. Open feature flag\n2. Toggle Enable/Disable\n3. Save","Feature flag state changes; feature availability updates accordingly","High","Functional");
tc("Personalization & Feature Flags","Set feature flag rollout percentage","Feature flag exists","1. Open feature flag\n2. Set rollout to 25%\n3. Save","Flag is enabled for 25% of users; gradual rollout works correctly","Medium","Functional");
tc("Personalization & Feature Flags","Delete personalization campaign","A stopped campaign exists","1. Open campaign\n2. Click Delete\n3. Confirm","Campaign is deleted; personalized content no longer serves","Low","Functional");
tc("Personalization & Feature Flags","View personalization campaign results","Campaign has collected data","1. Open campaign\n2. Navigate to Results tab","Results show impressions, conversions, and revenue impact of personalization","Medium","Regression");

// ===== REPORTS & ANALYTICS (10 cases) =====
tc("Reports & Analytics","View campaign summary report","Campaigns have collected data","1. Navigate to Reports\n2. Select campaign\n3. View summary","Summary report shows key metrics: visitors, conversions, revenue, significance","High","Functional");
tc("Reports & Analytics","Export report as PDF","Report data is available","1. Open a report\n2. Click Export\n3. Select PDF format","Report is downloaded as a formatted PDF document","Medium","Functional");
tc("Reports & Analytics","Export report as CSV","Report data is available","1. Open a report\n2. Click Export\n3. Select CSV format","Report data is downloaded as a CSV file with all metrics","Medium","Functional");
tc("Reports & Analytics","Filter report by date range","Report data spans multiple dates","1. Open report\n2. Apply custom date range filter","Report data is filtered to show only the selected period","Medium","Functional");
tc("Reports & Analytics","View real-time analytics","A campaign is currently running","1. Open running campaign\n2. Navigate to Live view","Real-time data shows current visitors, active variations, and live conversions","High","Functional");
tc("Reports & Analytics","Compare variation performance","A/B test has multiple variations with data","1. Open campaign report\n2. View variation comparison","Comparison chart shows performance metrics side-by-side for all variations","High","Functional");
tc("Reports & Analytics","Statistical significance indicator","Campaign has sufficient data","1. Open campaign report\n2. Check significance indicator","Statistical significance percentage is displayed; winner declared when >95%","High","Regression");
tc("Reports & Analytics","Revenue tracking report","Campaign has revenue goals configured","1. Open campaign with revenue goal\n2. View revenue report","Revenue per visitor and total revenue are shown per variation","Medium","Functional");
tc("Reports & Analytics","Segmented report view","Campaign data with segments","1. Open report\n2. Apply segment filter (device, location, browser)","Report shows metrics broken down by the selected segment","Medium","Regression");
tc("Reports & Analytics","Schedule automated report emails","Report exists","1. Open report\n2. Click Schedule Report\n3. Set recipients and frequency\n4. Save","Automated report emails are scheduled and sent at the configured frequency","Low","Functional");

// ===== USER MANAGEMENT & ROLES (8 cases) =====
tc("User Management & Roles","Invite new team member","Admin user is logged in","1. Navigate to Settings > Team\n2. Click Invite\n3. Enter email\n4. Assign role\n5. Send invite","Invitation email is sent; user appears in pending invites list","High","Functional");
tc("User Management & Roles","Assign Admin role to user","Admin is logged in; team member exists","1. Navigate to Team management\n2. Select user\n3. Change role to Admin\n4. Save","User role is updated to Admin with full permissions","High","Functional");
tc("User Management & Roles","Assign Viewer role restrictions","Admin is logged in","1. Navigate to Team management\n2. Select user\n3. Set role to Viewer\n4. Save","User can only view data; create/edit/delete actions are disabled","High","Functional");
tc("User Management & Roles","Remove team member","Admin is logged in; member exists","1. Navigate to Team management\n2. Select user\n3. Click Remove\n4. Confirm","User is removed from the account; access is revoked immediately","High","Functional");
tc("User Management & Roles","View audit trail of user actions","Admin is logged in","1. Navigate to Settings > Audit Log","Audit log shows timestamped entries of all user actions (login, changes, etc.)","Medium","Functional");
tc("User Management & Roles","Edit own profile information","User is logged in","1. Click profile avatar\n2. Edit name/email/photo\n3. Save","Profile information is updated successfully","Low","Functional");
tc("User Management & Roles","Change account password","User is logged in","1. Navigate to Profile > Security\n2. Enter current password\n3. Enter new password\n4. Confirm and Save","Password is updated; user can login with new password","Medium","Regression");
tc("User Management & Roles","Access control for restricted modules","Viewer role user is logged in","1. Login as Viewer role\n2. Try to access Campaign Creation\n3. Try to modify settings","Access denied message shown; restricted actions are blocked","High","Regression");

// ===== INTEGRATIONS & SETTINGS (8 cases) =====
tc("Integrations & Settings","Connect Google Analytics integration","Admin user is logged in","1. Navigate to Integrations\n2. Select Google Analytics\n3. Enter tracking ID\n4. Authenticate\n5. Save","Google Analytics integration is connected and data sync begins","High","Functional");
tc("Integrations & Settings","Configure webhook notification","Admin is logged in","1. Navigate to Integrations\n2. Click Webhooks\n3. Add webhook URL\n4. Select trigger events\n5. Save","Webhook is configured; notifications fire on selected events","Medium","Functional");
tc("Integrations & Settings","Disconnect an integration","An integration is active","1. Navigate to Integrations\n2. Select active integration\n3. Click Disconnect\n4. Confirm","Integration is disconnected; data sync stops","Medium","Functional");
tc("Integrations & Settings","Configure account-level settings","Admin is logged in","1. Navigate to Settings > Account\n2. Update account name, timezone\n3. Save","Account settings are updated and reflected across the platform","Medium","Functional");
tc("Integrations & Settings","Set up custom domain for tracking","Admin is logged in","1. Navigate to Settings > Tracking\n2. Add custom domain\n3. Verify DNS configuration","Custom domain is verified and tracking uses the custom domain","Medium","Functional");
tc("Integrations & Settings","API key generation","Admin user is logged in","1. Navigate to Settings > API\n2. Click Generate New Key\n3. Copy API key","New API key is generated and displayed; can be used for API calls","High","Functional");
tc("Integrations & Settings","Revoke API key","Active API key exists","1. Navigate to Settings > API\n2. Select API key\n3. Click Revoke\n4. Confirm","API key is revoked; requests using it return 401 Unauthorized","High","Regression");
tc("Integrations & Settings","SMTP email configuration","Admin is logged in","1. Navigate to Settings > Email\n2. Configure SMTP server details\n3. Send test email\n4. Save","SMTP settings are saved; test email is received successfully","Low","Functional");

// ===== BILLING & SUBSCRIPTION (8 cases) =====
tc("Billing & Subscription","View current subscription plan","User is logged in","1. Navigate to Settings > Billing\n2. View current plan","Current plan details are displayed: plan name, features, renewal date","High","Functional");
tc("Billing & Subscription","Upgrade subscription plan","User is on a lower-tier plan","1. Navigate to Billing\n2. Click Upgrade\n3. Select higher plan\n4. Enter payment details\n5. Confirm","Plan is upgraded; new features are immediately available","High","Functional");
tc("Billing & Subscription","Downgrade subscription plan","User is on a higher-tier plan","1. Navigate to Billing\n2. Click Change Plan\n3. Select lower plan\n4. Confirm","Plan is downgraded at end of current billing cycle; features adjusted","Medium","Functional");
tc("Billing & Subscription","Update payment method","User has billing access","1. Navigate to Billing\n2. Click Payment Methods\n3. Add new card\n4. Set as default\n5. Save","Payment method is updated; next billing uses the new card","High","Functional");
tc("Billing & Subscription","View billing history","Payments have been made","1. Navigate to Billing > History","Billing history shows all past invoices with dates, amounts, and status","Medium","Functional");
tc("Billing & Subscription","Download invoice","Billing history has entries","1. Navigate to Billing > History\n2. Click Download on an invoice","Invoice is downloaded as a PDF with all billing details","Medium","Functional");
tc("Billing & Subscription","Cancel subscription","User has an active subscription","1. Navigate to Billing\n2. Click Cancel Subscription\n3. Provide cancellation reason\n4. Confirm","Subscription is marked for cancellation at end of billing period","High","Functional");
tc("Billing & Subscription","Free trial expiration handling","User is on a free trial","1. Allow trial period to expire\n2. Attempt to login","User sees trial expired message with options to upgrade or contact sales","High","Regression");

// Write to file
fs.writeFileSync('test_cases.json', JSON.stringify(testCases, null, 2));
console.log(`Generated ${testCases.length} test cases to test_cases.json`);
