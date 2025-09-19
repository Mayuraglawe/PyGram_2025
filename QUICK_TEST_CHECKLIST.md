## QUICK TESTING CHECKLIST - Faculty Mentor Workflow

### ✅ COMPLETED:
- [x] Development server running at http://localhost:8080/
- [x] All 5 automated tests PASSED
- [x] Browser opened to application

### 🔄 MANUAL TESTING STEPS:

#### PHASE 1: Creator Testing (Pygram2k25)
1. [ ] Click "Sign In" button
2. [ ] Click "Workflow Test" tab
3. [ ] Click GREEN "Fill Credentials" button (Creator)
4. [ ] Click "Sign In to Test Workflow"
5. [ ] Go to "Timetables" page
6. [ ] Click "Create New Timetable"
7. [ ] Fill: Name="CS Test", Department="Computer Science"
8. [ ] Click "Open AI Assistant"
9. [ ] Type: "Generate CS department timetable"
10. [ ] Review realistic CS subjects (Data Structures, OS, DBMS, etc.)
11. [ ] Click "Finalize Draft"
12. [ ] Confirm submission

#### PHASE 2: Publisher Testing (pygram2k25)
13. [ ] Click user menu > "Logout"
14. [ ] Return to Sign In
15. [ ] Click "Workflow Test" tab
16. [ ] Click BLUE "Fill Credentials" button (Publisher)
17. [ ] Sign in as Publisher
18. [ ] Check notification bell (red badge)
19. [ ] Click notifications
20. [ ] Go to "Timetables" page
21. [ ] Find "Under Review" timetable
22. [ ] Click "Review"
23. [ ] Click "Approve Timetable"
24. [ ] Click "Publish"

#### PHASE 3: Verification
25. [ ] Test both users can edit published timetable
26. [ ] Verify change tracking works

### 🔑 CREDENTIALS:
- Creator: Pygram2k25 / Pygram2k25 (GREEN box)
- Publisher: pygram2k25 / pygram2k25 (BLUE box)

### 🎯 SUCCESS CRITERIA:
- ✅ Authentication works for both users
- ✅ AI generates realistic CS curriculum
- ✅ Draft finalization sends notification
- ✅ Publisher can approve timetables
- ✅ Both users can edit published timetables