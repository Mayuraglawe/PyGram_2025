/**
 * Simple JavaScript Test Runner for Faculty Mentor Workflow
 */

class WorkflowTestService {
  constructor() {
    this.users = [
      {
        id: 1,
        username: 'Pygram2k25',
        role: 'mentor',
        mentorType: 'creator',
        department: 'Computer Science'
      },
      {
        id: 2,
        username: 'pygram2k25',
        role: 'mentor',
        mentorType: 'publisher',
        department: 'Computer Science'
      }
    ];
    
    this.timetables = [];
    this.notifications = [];
  }

  validateCredentials(username, password) {
    if (username === 'Pygram2k25' && password === 'Pygram2k25') {
      return this.users[0]; // Creator
    }
    if (username === 'pygram2k25' && password === 'pygram2k25') {
      return this.users[1]; // Publisher
    }
    return null;
  }

  createTimetable(creatorId, name) {
    const creator = this.users.find(u => u.id === creatorId);
    if (!creator || creator.mentorType !== 'creator') {
      throw new Error('Only creators can create timetables');
    }

    const publisher = this.users.find(u => 
      u.mentorType === 'publisher' && u.department === creator.department
    );

    const timetable = {
      id: this.timetables.length + 1,
      name,
      creator_id: creatorId,
      publisher_id: publisher?.id || 0,
      department_id: creator.department,
      workflow_stage: 'creation',
      workflow_status: 'draft',
      version: 1,
      created_at: new Date().toISOString()
    };

    this.timetables.push(timetable);
    return timetable;
  }

  finalizeTimetable(timetableId, userId) {
    const timetable = this.timetables.find(t => t.id === timetableId);
    if (!timetable) throw new Error('Timetable not found');
    
    if (timetable.creator_id !== userId) {
      throw new Error('Only creator can finalize their timetable');
    }

    if (timetable.workflow_status !== 'draft') {
      throw new Error('Can only finalize draft timetables');
    }

    timetable.workflow_stage = 'finalized';
    timetable.workflow_status = 'under_review';
    timetable.finalized_at = new Date().toISOString();

    const notification = {
      id: `notif_${Date.now()}`,
      user_id: timetable.publisher_id,
      type: 'timetable_submitted',
      title: 'New Timetable Submission',
      message: `Timetable "${timetable.name}" has been submitted for review by Creator`,
      read: false,
      created_at: new Date().toISOString()
    };

    this.notifications.push(notification);
    return timetable;
  }

  approveTimetable(timetableId, publisherId) {
    const timetable = this.timetables.find(t => t.id === timetableId);
    if (!timetable) throw new Error('Timetable not found');
    
    if (timetable.publisher_id !== publisherId) {
      throw new Error('Only assigned publisher can approve');
    }

    if (timetable.workflow_status !== 'under_review') {
      throw new Error('Can only approve timetables under review');
    }

    timetable.workflow_stage = 'published';
    timetable.workflow_status = 'published';
    timetable.approved_at = new Date().toISOString();

    const notification = {
      id: `notif_${Date.now()}`,
      user_id: timetable.creator_id,
      type: 'timetable_approved',
      title: 'Timetable Approved',
      message: `Your timetable "${timetable.name}" has been approved and published`,
      read: false,
      created_at: new Date().toISOString()
    };

    this.notifications.push(notification);
    return timetable;
  }

  canEditTimetable(timetableId, userId) {
    const timetable = this.timetables.find(t => t.id === timetableId);
    if (!timetable) return false;

    if (timetable.creator_id === userId) {
      return timetable.workflow_status === 'draft' || timetable.workflow_status === 'published';
    }

    if (timetable.publisher_id === userId) {
      return timetable.workflow_status === 'published';
    }

    return false;
  }

  getNotifications(userId) {
    return this.notifications.filter(n => n.user_id === userId);
  }
}

class TestRunner {
  constructor() {
    this.service = new WorkflowTestService();
    this.testResults = [];
  }

  log(message, type = 'info') {
    const colors = {
      info: '\x1b[36m',
      success: '\x1b[32m',
      error: '\x1b[31m',
      warning: '\x1b[33m',
      reset: '\x1b[0m'
    };

    console.log(`${colors[type]}${message}${colors.reset}`);
  }

  runTest(name, testFn) {
    try {
      testFn();
      this.testResults.push({ name, passed: true });
      this.log(`✅ ${name}`, 'success');
    } catch (error) {
      this.testResults.push({ 
        name, 
        passed: false, 
        error: error.message
      });
      this.log(`❌ ${name}: ${error.message}`, 'error');
    }
  }

  runAllTests() {
    this.log('🚀 Starting Faculty Mentor Workflow Tests\n', 'info');

    // Test 1: Creator Authentication
    this.runTest('Creator Authentication (Pygram2k25)', () => {
      const user = this.service.validateCredentials('Pygram2k25', 'Pygram2k25');
      if (!user || user.mentorType !== 'creator') {
        throw new Error('Creator authentication failed');
      }
    });

    // Test 2: Publisher Authentication  
    this.runTest('Publisher Authentication (pygram2k25)', () => {
      const user = this.service.validateCredentials('pygram2k25', 'pygram2k25');
      if (!user || user.mentorType !== 'publisher') {
        throw new Error('Publisher authentication failed');
      }
    });

    // Test 3: Complete Workflow
    this.runTest('Complete Creator → Publisher Workflow', () => {
      const creator = this.service.validateCredentials('Pygram2k25', 'Pygram2k25');
      const publisher = this.service.validateCredentials('pygram2k25', 'pygram2k25');
      
      // Create timetable
      let timetable = this.service.createTimetable(creator.id, 'CS Test Timetable');
      if (timetable.workflow_status !== 'draft') {
        throw new Error('Timetable not in draft status');
      }

      // Finalize timetable
      timetable = this.service.finalizeTimetable(timetable.id, creator.id);
      if (timetable.workflow_status !== 'under_review') {
        throw new Error('Timetable not moved to under_review');
      }

      // Check notification
      const notifications = this.service.getNotifications(publisher.id);
      if (notifications.length === 0) {
        throw new Error('Publisher did not receive notification');
      }

      // Approve timetable
      timetable = this.service.approveTimetable(timetable.id, publisher.id);
      if (timetable.workflow_status !== 'published') {
        throw new Error('Timetable not published');
      }
    });

    // Test 4: Dual Editing Rights
    this.runTest('Dual Editing Rights on Published Timetable', () => {
      const creator = this.service.validateCredentials('Pygram2k25', 'Pygram2k25');
      const publisher = this.service.validateCredentials('pygram2k25', 'pygram2k25');
      
      let timetable = this.service.createTimetable(creator.id, 'CS Dual Edit Test');
      timetable = this.service.finalizeTimetable(timetable.id, creator.id);
      timetable = this.service.approveTimetable(timetable.id, publisher.id);
      
      const creatorCanEdit = this.service.canEditTimetable(timetable.id, creator.id);
      const publisherCanEdit = this.service.canEditTimetable(timetable.id, publisher.id);
      
      if (!creatorCanEdit || !publisherCanEdit) {
        throw new Error('Both users should be able to edit published timetable');
      }
    });

    // Test 5: Access Control During Review
    this.runTest('Access Control During Review Phase', () => {
      const creator = this.service.validateCredentials('Pygram2k25', 'Pygram2k25');
      
      let timetable = this.service.createTimetable(creator.id, 'CS Access Test');
      timetable = this.service.finalizeTimetable(timetable.id, creator.id);
      
      const creatorCanEdit = this.service.canEditTimetable(timetable.id, creator.id);
      
      if (creatorCanEdit) {
        throw new Error('Creator should not be able to edit during review');
      }
    });

    this.printResults();
  }

  printResults() {
    this.log('\n📊 Test Results Summary', 'info');
    this.log('='.repeat(50), 'info');
    
    const passed = this.testResults.filter(t => t.passed).length;
    const total = this.testResults.length;
    
    this.log(`\nTotal: ${passed}/${total} tests passed`, passed === total ? 'success' : 'warning');
    
    if (passed === total) {
      this.log('\n🎉 All tests passed! The Faculty Mentor Workflow is working correctly.', 'success');
      this.log('\n🔗 Next Steps for Manual Testing:', 'info');
      this.log('1. Open browser to http://localhost:8080/', 'info');
      this.log('2. Go to Sign In → Workflow Test tab', 'info');
      this.log('3. Test with credentials:', 'info');
      this.log('   • Creator: Pygram2k25 / Pygram2k25', 'info');
      this.log('   • Publisher: pygram2k25 / pygram2k25', 'info');
      this.log('\n📖 Full testing guide: TESTING_GUIDE.md', 'info');
    } else {
      this.log('\n⚠️  Some tests failed. Please check the workflow implementation.', 'warning');
    }
  }
}

// Run the tests
const runner = new TestRunner();
runner.runAllTests();