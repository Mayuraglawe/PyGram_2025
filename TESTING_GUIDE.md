# Faculty Mentor Workflow Testing Guide

## 🎯 Quick Testing Overview

This guide provides step-by-step instructions to test the complete Faculty Mentor Workflow implementation.

## 🔑 Test Credentials

### Faculty Mentor 2 - Creator
- **Username**: `Pygram2k25`
- **Password**: `Pygram2k25`
- **Role**: Creates and drafts timetables
- **Department**: Computer Science

### Faculty Mentor 1 - Publisher  
- **Username**: `pygram2k25`
- **Password**: `pygram2k25`
- **Role**: Reviews and approves timetables
- **Department**: Computer Science

## 🚀 Automated Testing

Run the automated test suite to validate the workflow logic:

```bash
cd tests
node run-tests.js
```

The automated tests validate:
- ✅ Authentication for both users
- ✅ Timetable creation permissions
- ✅ Draft finalization process
- ✅ Notification system
- ✅ Publisher approval workflow
- ✅ Dual editing rights
- ✅ Access control during review

## 🧪 Manual Testing Steps

### Phase 1: Creator Workflow

#### Step 1: Creator Login
1. Open browser to `http://localhost:8080/`
2. Navigate to **Sign In** page
3. Click **"Workflow Test"** tab
4. Click **"Fill Credentials"** button in the green Creator box
5. Click **"Sign In to Test Workflow"**

**Expected Result**: Successfully logged in as Creator (Pygram2k25)

#### Step 2: Create Timetable
1. Navigate to **Timetables** page
2. Click **"Create New Timetable"** or **"+"** button
3. Fill in timetable details:
   - Name: "CS Semester 1 Test"
   - Department: Computer Science
   - Year: 2025
   - Semester: 1

**Expected Result**: New timetable created in Draft status

#### Step 3: Use AI Assistant
1. Click **"Open AI Assistant"** or **"🤖 AI Helper"** button
2. Type: "Generate a complete timetable for Computer Science department"
3. Review the AI-generated realistic CS curriculum:
   - Data Structures & Algorithms
   - Operating Systems (with Lab)
   - Database Management Systems (with Lab)
   - Software Engineering
   - Computer Networks (with Lab)

**Expected Result**: Realistic CS timetable generated with proper faculty and room assignments

#### Step 4: Finalize Draft
1. Review the generated timetable
2. Make any necessary adjustments using drag-drop
3. Click **"Finalize Draft"** button
4. Add any final comments
5. Confirm submission

**Expected Result**: 
- Timetable status changes to "Under Review"
- Creator can no longer edit
- Publisher receives notification

### Phase 2: Publisher Workflow

#### Step 5: Switch to Publisher
1. Click user menu → **"Logout"**
2. Return to Sign In page
3. Click **"Workflow Test"** tab
4. Click **"Fill Credentials"** button in the blue Publisher box
5. Sign in as Publisher

**Expected Result**: Successfully logged in as Publisher (pygram2k25)

#### Step 6: Check Notifications
1. Look for notification bell icon with red badge
2. Click notifications to view:
   - "New timetable submission from Creator (Pygram2k25)"
   - Timestamp and timetable details

**Expected Result**: Notification received about submitted timetable

#### Step 7: Review Timetable
1. Navigate to **Timetables** page
2. Find timetable with status **"Under Review"**
3. Click **"Review"** or **"Open"** button
4. Examine the submitted timetable:
   - Check curriculum completeness
   - Verify faculty assignments
   - Review time slot allocations

**Expected Result**: Can view submitted timetable in read-only mode

#### Step 8: Approve Timetable
1. Click **"Approve Timetable"** button
2. Add approval comments (optional)
3. Click **"Publish"** to confirm

**Expected Result**:
- Timetable status changes to "Published"
- Creator receives approval notification
- Both users gain edit rights

### Phase 3: Post-Publication Testing

#### Step 9: Test Dual Editing Rights
1. **As Publisher**: Make a small edit to verify edit access
2. **Logout and login as Creator**: Verify Creator can also edit published timetable
3. **Test Change Tracking**: Check that all modifications are logged with timestamps

**Expected Result**: Both Creator and Publisher can edit published timetables

## 🔍 Verification Checklist

### Authentication & Access
- [ ] Creator can login with `Pygram2k25` / `Pygram2k25`
- [ ] Publisher can login with `pygram2k25` / `pygram2k25`
- [ ] Invalid credentials are rejected
- [ ] Users have appropriate department access

### Timetable Creation
- [ ] Creator can create new timetables
- [ ] Publisher cannot create timetables
- [ ] AI assistant generates realistic CS curriculum
- [ ] Generated timetables include proper subjects and labs

### Workflow Transitions
- [ ] Draft finalization changes status to "Under Review"
- [ ] Publisher receives notification when draft is finalized
- [ ] Creator cannot edit during review phase
- [ ] Publisher can approve/reject submitted timetables
- [ ] Approval changes status to "Published"
- [ ] Creator receives approval notification

### Dual Editing Rights
- [ ] Both users can edit published timetables
- [ ] Changes are tracked with user and timestamp
- [ ] Edit permissions are enforced correctly
- [ ] Version history is maintained

### Error Handling
- [ ] Cannot finalize already finalized timetables
- [ ] Cannot approve timetables not under review
- [ ] Proper error messages for invalid operations
- [ ] Access control prevents unauthorized actions

## 🎨 UI Elements to Test

### Sign In Page
- [ ] Workflow Test tab displays correctly
- [ ] Credential auto-fill buttons work
- [ ] Step-by-step instructions are clear
- [ ] Color coding (green=Creator, blue=Publisher) is intuitive

### Timetable Interface
- [ ] AI Assistant chatbot opens and responds
- [ ] Drag-drop functionality works
- [ ] Status indicators update correctly
- [ ] Notification bell shows unread count

### Workflow Controls
- [ ] "Finalize Draft" button appears for Creator
- [ ] "Approve/Reject" buttons appear for Publisher
- [ ] Status badges display correct colors
- [ ] Edit permissions enforced in UI

## 🐛 Common Issues to Watch For

### Authentication Issues
- **Problem**: Cannot login with provided credentials
- **Check**: Ensure exact case-sensitive username/password matching
- **Solution**: Use auto-fill buttons in Workflow Test tab

### Notification Issues
- **Problem**: Publisher not receiving notifications
- **Check**: Notification service integration in finalization process
- **Solution**: Verify NotificationContext is properly connected

### Status Issues
- **Problem**: Timetable status not updating
- **Check**: Workflow state transitions in backend
- **Solution**: Check workflow_status and workflow_stage fields

### Edit Permission Issues
- **Problem**: Users cannot edit when they should
- **Check**: canEditTimetable logic based on user role and timetable status
- **Solution**: Verify dual editing rights implementation

## 📊 Expected Test Results

If everything is working correctly, you should see:

1. **100% Automated Test Pass Rate** - All 7 automated tests pass
2. **Smooth Manual Workflow** - Complete Creator → Publisher flow works
3. **Realistic Demo Data** - AI generates proper CS curriculum
4. **Proper Notifications** - Real-time alerts at each workflow stage
5. **Secure Access Control** - Permissions enforced correctly
6. **Dual Editing** - Both users can edit published timetables

## 🎉 Success Criteria

The Faculty Mentor Workflow is successfully implemented when:

- ✅ Both mentor credentials work correctly
- ✅ Creator can draft and finalize timetables
- ✅ Publisher receives notifications and can approve
- ✅ Both users can edit published timetables
- ✅ All workflow states transition properly
- ✅ Change tracking and audit trail work
- ✅ UI reflects current permissions and status

Happy Testing! 🚀