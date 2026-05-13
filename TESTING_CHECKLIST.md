# Frontend Setup & Testing Checklist

## ✅ Setup Steps

### 1. Dependencies Already Installed
```bash
# The following are already in package.json:
- react@^18.2.0
- react-dom@^18.2.0
- react-router-dom@^6.20.0
- axios@^1.6.2
- tailwindcss@^3.3.6
- postcss@^8.4.32
- autoprefixer@^10.4.16
```

### 2. Verify Vite Proxy Configuration
Your `vite.config.js` already has the proxy setup:
```javascript
proxy: {
  '/api': {
    target: 'http://localhost:3000',
    changeOrigin: true
  }
}
```
This forwards API calls from `http://localhost:5173/api/*` to `http://localhost:3000/api/*`

### 3. Start the Application
```bash
cd frontend
npm run dev
```
Application will be available at: `http://localhost:5173`

### 4. Make Sure Backend is Running
```bash
# In another terminal, from the root directory
npm run dev
# or
node src/server.js
```
Backend should be running on: `http://localhost:3000`

---

## 🧪 Testing Checklist

### Phase 1: Authentication (Prerequisites)
- [ ] Login with valid credentials
- [ ] Verify token is stored (check localStorage)
- [ ] Verify you're redirected to dashboard

### Phase 2: Dashboard Page (`/dashboard`)
- [ ] **Load Test**: Page loads without errors
- [ ] **Data Display**: Statistics cards show numbers > 0
- [ ] **Books Count**: Total Books stat is correct
- [ ] **Available Books**: Available Books stat is correct
- [ ] **Active Loans**: Active Loans stat matches loans count
- [ ] **Reservations**: Reservations stat matches reservations count
- [ ] **Recent Loans Table**: Shows at least 1 active loan
  - [ ] Member name displays
  - [ ] Book title displays
  - [ ] Due date displays correctly
  - [ ] Overdue loans show red badge
  - [ ] Active loans show green badge
- [ ] **Recent Reservations Table**: Shows at least 1 reservation
  - [ ] Member name displays
  - [ ] Book title displays
  - [ ] Reserved date displays
- [ ] **Empty States**: If no data, shows "No active loans" message
- [ ] **Error Handling**: 
  - [ ] Block API in DevTools (Network tab)
  - [ ] Error alert appears
  - [ ] Retry button works

### Phase 3: Member Books Page (`/books`)
- [ ] **Page Loads**: No errors, shows books
- [ ] **Book Cards Display**:
  - [ ] Book title shows
  - [ ] Author displays
  - [ ] Availability badge (green/red)
  - [ ] Book cover placeholder
  - [ ] Description truncates correctly
- [ ] **Search Functionality**:
  - [ ] Type in search box
  - [ ] Results filter in real-time
  - [ ] Search works by title and author
  - [ ] Clear search shows all books again
- [ ] **Filter Available Books**:
  - [ ] Uncheck shows all books
  - [ ] Check shows only available books
  - [ ] Works together with search
- [ ] **Reserve Book**:
  - [ ] Click "Reserve Book" button
  - [ ] Button shows loading spinner
  - [ ] Success message appears (green alert)
  - [ ] Book gets marked as unavailable (red badge)
  - [ ] Button changes to "Not Available"
- [ ] **Error Handling**:
  - [ ] Try to reserve without login (logout first)
  - [ ] Error message appears
  - [ ] Retry works
- [ ] **Responsive Design**:
  - [ ] Desktop: 3 cards per row ✓
  - [ ] Tablet: 2 cards per row ✓
  - [ ] Mobile: 1 card per row ✓

### Phase 4: Loans Management Page (`/loans`)
- [ ] **Page Loads**: Shows loans in table
- [ ] **Statistics**:
  - [ ] Total Active Loans count correct
  - [ ] On Track count correct (not overdue)
  - [ ] Overdue count correct (past due date)
- [ ] **Loans Table**:
  - [ ] Member name displays
  - [ ] Book title displays
  - [ ] Loan date shows correctly
  - [ ] Due date shows correctly
  - [ ] Status badge shows (Active/Overdue)
- [ ] **Status Badges**:
  - [ ] Active loans: Green badge + "days left"
  - [ ] Overdue loans: Red badge + "days overdue"
  - [ ] Highlight loans due within 3 days
- [ ] **Filter by Status**:
  - [ ] "All Loans": Shows all
  - [ ] "Active (On Track)": Shows only non-overdue
  - [ ] "Overdue": Shows only overdue loans
- [ ] **Search**:
  - [ ] Search by member name works
  - [ ] Search by book title works
  - [ ] Search by ID works (if available)
  - [ ] Combined with filter works
- [ ] **Mark as Returned**:
  - [ ] Click "Mark Returned" button
  - [ ] Button shows loading spinner
  - [ ] Loan disappears from table
  - [ ] Statistics update (total decreases)
  - [ ] Table footer count updates
- [ ] **Error Handling**:
  - [ ] Block API in DevTools
  - [ ] Error message appears
  - [ ] Retry button works
- [ ] **Responsive Design**:
  - [ ] Desktop: Full table visible
  - [ ] Mobile: Table scrolls horizontally
  - [ ] Filter section stacks vertically

### Phase 5: Navigation
- [ ] **Header Navigation**:
  - [ ] Dashboard link works (✓ icon shows active)
  - [ ] Books link works (✓ icon shows active)
  - [ ] Loans link works (✓ icon shows active)
- [ ] **Active Page Styling**:
  - [ ] Current page link has blue background
  - [ ] Other links have gray background
  - [ ] Hover states work
- [ ] **Logout**:
  - [ ] Click "Logout" button
  - [ ] Redirected to login page
  - [ ] Token cleared from localStorage
  - [ ] Can't access /dashboard directly (redirects to login)

### Phase 6: Error Scenarios
- [ ] **Network Down**:
  - [ ] Disable network in DevTools
  - [ ] Error alert appears
  - [ ] Retry button works when network back
- [ ] **Invalid API Response**:
  - [ ] API returns malformed data
  - [ ] App handles gracefully (check console)
  - [ ] Shows generic error message
- [ ] **Slow API**:
  - [ ] Add throttling in DevTools (Slow 3G)
  - [ ] Loading spinners appear
  - [ ] Can still interact (buttons work)

### Phase 7: Browser Compatibility
- [ ] Chrome: All features work
- [ ] Firefox: All features work
- [ ] Safari: All features work
- [ ] Edge: All features work

---

## 🔍 DevTools Debugging Tips

### Check API Calls
1. Open DevTools → Network tab
2. Navigate to a page
3. Look for `/api/v1/*` requests
4. Click request, check:
   - Request URL (should show full path)
   - Request headers (should have auth token)
   - Response status (should be 200)
   - Response body (should have `data` field)

### Check LocalStorage
1. Open DevTools → Application tab
2. Click "LocalStorage" → http://localhost:5173
3. Look for keys like `token`, `user`, etc.
4. Check values are valid

### Check Console Errors
1. Open DevTools → Console tab
2. Look for red error messages
3. Expand errors to see stack traces
4. Common issues:
   - `Cannot read property 'data' of undefined` → API response format wrong
   - `404 /api/v1/*` → Backend not running or wrong port
   - `401 Unauthorized` → Token expired or invalid

### Simulate Network Issues
1. DevTools → Network tab
2. Click "Throttling" dropdown (top left)
3. Select "Offline", "Slow 3G", etc.
4. Reload page to see loading states

---

## 📋 API Testing Quick Reference

### Test Books API
```bash
# Check if endpoint works
curl http://localhost:3000/api/v1/books

# Expected response format:
{
  "data": [
    {
      "id": "...",
      "title": "...",
      "author": "...",
      "isAvailable": true,
      ...
    }
  ]
}
```

### Test Loans API
```bash
curl http://localhost:3000/api/v1/loans

# Should have fields like:
# - id, bookId, memberId
# - bookTitle, memberName  
# - loanDate, dueDate, returnDate
```

### Test Reservations API
```bash
curl http://localhost:3000/api/v1/reservations

# Should have fields like:
# - id, bookId, memberId
# - bookTitle, memberName
# - createdAt, isCancelled
```

---

## ⚡ Performance Notes

- Dashboard loads data in parallel (fast)
- Search/filter happens client-side (instant)
- Book reserve shows loading state (UX clarity)
- Loan return refreshes data (data consistency)
- Pages cache data until manual refresh needed

---

## 🚨 Common Errors & Fixes

### "Cannot read property 'data' of undefined"
**Cause**: API response format is different
**Fix**: Check service file, update response handling
```javascript
// Current pattern that handles both:
return response.data.data || response.data
```

### "401 Unauthorized" on API calls
**Cause**: Token missing or expired
**Fix**: 
- Check token in localStorage
- Check if auth header is being sent
- Check token expiry time

### Books showing as "Not Available" but should be available
**Cause**: Field name mismatch
**Fix**: Check API returns `isAvailable` field
```javascript
// Verify in network tab what field name API uses
// Update booksService.js filter if needed
```

### Reservation button doesn't work
**Cause**: User not authenticated or missing memberId
**Fix**:
- Ensure logged in
- Check user object has `id` field
- Check auth context properly stores user

### Loans table empty but loans exist
**Cause**: Active loans filter too strict
**Fix**: Check that `returnDate` is `null` for active loans
```javascript
// In loansService.js, active loans filter:
loans.filter(loan => loan.returnDate === null)
```

---

## 📊 Test Data Requirements

For full testing, you need:
- **At least 5 books** (mix of available/unavailable)
- **At least 3 active loans** (mix of overdue/not overdue)
- **At least 2 reservations**
- **At least 1 member** (for reservations)

---

## 🎉 Success Criteria

All pages pass when:
- ✅ Data loads without errors
- ✅ All 3 pages work independently
- ✅ Navigation between pages works
- ✅ Filtering/search works
- ✅ API calls succeed
- ✅ Error states display correctly
- ✅ Loading states show during async operations
- ✅ Empty states show when no data
- ✅ Responsive on mobile/tablet/desktop
- ✅ Production-quality code

---

## 📝 Notes

- **Auth is required**: You must be logged in to see any protected page
- **API proxy**: Frontend at 5173 proxies to backend at 3000
- **Tailwind classes**: All styling uses Tailwind utilities
- **Error retry**: All error alerts have retry buttons
- **Real data**: All pages show actual API data, not mocked

