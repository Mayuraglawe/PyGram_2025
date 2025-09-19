@echo off
echo ================================================
echo Faculty Mentor Workflow Testing Helper
echo ================================================
echo.
echo This script will help you test the workflow:
echo.
echo 1. Development server is running at: http://localhost:8080/
echo 2. Browser will open automatically
echo 3. Follow the testing steps below
echo.
echo ================================================
echo TESTING STEPS:
echo ================================================
echo.
echo Phase 1: Creator Testing (Pygram2k25)
echo ----------------------------------------
echo 1. Click "Sign In" at top right
echo 2. Click "Workflow Test" tab  
echo 3. Click "Fill Credentials" in GREEN box (Creator)
echo 4. Click "Sign In to Test Workflow"
echo 5. Navigate to "Timetables" page
echo 6. Click "Create New Timetable" or "+" button
echo 7. Fill: Name="CS Test", Department="Computer Science"
echo 8. Click "Open AI Assistant" button
echo 9. Type: "Generate CS department timetable"
echo 10. Review generated timetable with realistic subjects
echo 11. Click "Finalize Draft" button
echo 12. Confirm submission
echo.
echo Phase 2: Publisher Testing (pygram2k25)  
echo ----------------------------------------
echo 13. Click user menu ^> "Logout"
echo 14. Return to Sign In page
echo 15. Click "Workflow Test" tab
echo 16. Click "Fill Credentials" in BLUE box (Publisher)
echo 17. Sign in as Publisher
echo 18. Look for notification bell with red badge
echo 19. Click notifications to see submission alert
echo 20. Navigate to "Timetables" page
echo 21. Find timetable with "Under Review" status
echo 22. Click "Review" or "Open" button
echo 23. Click "Approve Timetable" button
echo 24. Add approval comments (optional)
echo 25. Click "Publish" to confirm
echo.
echo Phase 3: Dual Editing Verification
echo ----------------------------------------
echo 26. Verify both users can edit published timetable
echo 27. Test change tracking and version history
echo.
echo ================================================
echo Opening browser now...
echo ================================================

REM Open browser to the application
start "" "http://localhost:8080/"

echo.
echo Browser opened! Follow the steps above to test the workflow.
echo.
echo Key credentials to remember:
echo   Creator: Pygram2k25 / Pygram2k25 (GREEN box)
echo   Publisher: pygram2k25 / pygram2k25 (BLUE box)
echo.
echo Press any key to exit...
pause >nul