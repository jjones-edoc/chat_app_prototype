// Shared Chat Creation Modal Component
const ChatModal = {
  selectedParticipants: [],
  selectedPackageId: null,
  launchedFromPackage: false,
  externalContacts: [],
  currentStep: 1,
  chatName: '',
  initialMessage: '',

  render() {
    return `
      <!-- Chat Creation Modal -->
      <div class="modal fade" id="chatModal" tabindex="-1">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title"><i class="fas fa-comment me-2"></i>Start New Conversation</h5>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <!-- Progress Indicator -->
              <div class="mb-4">
                <div class="d-flex justify-content-between align-items-center">
                  <div class="text-center flex-fill">
                    <div class="rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center" 
                         style="width: 30px; height: 30px;" id="step1Circle">1</div>
                    <div class="small mt-1">Details</div>
                  </div>
                  <div class="flex-fill">
                    <hr class="my-0" style="border-top: 2px solid #dee2e6;" id="step1Line">
                  </div>
                  <div class="text-center flex-fill">
                    <div class="rounded-circle bg-secondary text-white d-inline-flex align-items-center justify-content-center" 
                         style="width: 30px; height: 30px;" id="step2Circle">2</div>
                    <div class="small mt-1">Participants</div>
                  </div>
                  <div class="flex-fill">
                    <hr class="my-0" style="border-top: 2px solid #dee2e6;" id="step2Line">
                  </div>
                  <div class="text-center flex-fill">
                    <div class="rounded-circle bg-secondary text-white d-inline-flex align-items-center justify-content-center" 
                         style="width: 30px; height: 30px;" id="step3Circle">3</div>
                    <div class="small mt-1">Message</div>
                  </div>
                </div>
              </div>

              <!-- Step 1: Details -->
              <div id="step1" class="step-content">
                <h6 class="mb-3">Conversation Details</h6>
                <form id="chatForm">
                  <div class="mb-4">
                    <label for="chatName" class="form-label fw-bold">Conversation Name</label>
                    <input type="text" class="form-control" id="chatName" placeholder="Enter conversation name" />
                    <div class="form-text">Give your conversation a descriptive name</div>
                  </div>

                  <div class="mb-4" id="packageSection">
                    <label class="form-label fw-bold">Associated Package</label>
                    <div id="packageDisplay" class="p-3 bg-light rounded" style="display: none;">
                      <i class="fas fa-box me-2"></i>
                      <span id="packageName" class="fw-bold"></span>
                    </div>
                    <div id="packageSelector" style="display: none;">
                      <select class="form-select mb-2" id="packageSelect" onchange="ChatModal.selectPackage()">
                        <option value="">Select a package (optional)</option>
                        ${AppStore.packages.map(pkg => 
                          `<option value="${pkg.id}">${pkg.name}</option>`
                        ).join('')}
                      </select>
                      <div class="form-text">Link this conversation to a loan package</div>
                    </div>
                  </div>
                </form>
              </div>

              <!-- Step 2: Participants -->
              <div id="step2" class="step-content" style="display: none;">
                <h6 class="mb-3">Add Participants</h6>
                
                <!-- Tabs for Users vs Groups vs External Contacts -->
                <ul class="nav nav-tabs mb-3" role="tablist">
                  <li class="nav-item" role="presentation">
                    <button class="nav-link active" id="users-tab" data-bs-toggle="tab" data-bs-target="#users-panel" type="button">
                      <i class="fas fa-user me-2"></i>Internal Users
                    </button>
                  </li>
                  <li class="nav-item" role="presentation">
                    <button class="nav-link" id="groups-tab" data-bs-toggle="tab" data-bs-target="#groups-panel" type="button">
                      <i class="fas fa-users me-2"></i>Groups
                    </button>
                  </li>
                  <li class="nav-item" role="presentation">
                    <button class="nav-link" id="external-tab" data-bs-toggle="tab" data-bs-target="#external-panel" type="button">
                      <i class="fas fa-user-plus me-2"></i>External Contacts
                    </button>
                  </li>
                </ul>

                <div class="tab-content">
                  <!-- Internal Users Panel -->
                  <div class="tab-pane fade show active" id="users-panel" role="tabpanel">
                    <div class="search-box mb-3">
                      <i class="fas fa-search"></i>
                      <input type="text" class="form-control ps-5" placeholder="Search internal users..." 
                             onkeyup="ChatModal.filterParticipants('internal')" id="internalSearch" />
                    </div>
                    <div id="internalParticipantsList" style="max-height: 250px; overflow-y: auto;"></div>
                  </div>

                  <!-- Groups Panel -->
                  <div class="tab-pane fade" id="groups-panel" role="tabpanel">
                    <div class="search-box mb-3">
                      <i class="fas fa-search"></i>
                      <input type="text" class="form-control ps-5" placeholder="Search groups..." 
                             onkeyup="ChatModal.filterParticipants('groups')" id="groupsSearch" />
                    </div>
                    <div id="groupsParticipantsList" style="max-height: 250px; overflow-y: auto;"></div>
                  </div>

                  <!-- External Contacts Panel -->
                  <div class="tab-pane fade" id="external-panel" role="tabpanel">
                    <div class="mb-3">
                      <label class="form-label">Add External Contact:</label>
                      <div class="row g-2">
                        <div class="col-md-6">
                          <input type="text" class="form-control" id="modalExternalName" placeholder="Full Name">
                        </div>
                        <div class="col-md-6">
                          <input type="email" class="form-control" id="modalExternalEmail" placeholder="Email Address">
                        </div>
                      </div>
                      <div class="mt-2">
                        <input type="text" class="form-control" id="modalExternalRole" placeholder="Role/Title (optional)">
                      </div>
                      <div class="mt-2">
                        <label class="form-label small">Security Question:</label>
                        <select class="form-select form-select-sm" id="modalExternalSecurityQuestion">
                          <option value="">Select a security question</option>
                          <option value="mothers_maiden_name">What is your mother's maiden name?</option>
                          <option value="current_phone">What is your current phone number?</option>
                          <option value="birth_city">What city were you born in?</option>
                          <option value="first_pet">What was the name of your first pet?</option>
                          <option value="high_school">What high school did you attend?</option>
                          <option value="favorite_color">What is your favorite color?</option>
                          <option value="street_grew_up">What street did you grow up on?</option>
                        </select>
                      </div>
                      <div class="mt-2">
                        <input type="text" class="form-control form-control-sm" id="modalExternalSecurityAnswer" placeholder="Security answer">
                      </div>
                      <button type="button" class="btn btn-outline-primary mt-2" onclick="ChatModal.addExternalParticipant()">
                        <i class="fas fa-plus me-2"></i>Add External Contact
                      </button>
                    </div>
                    <div id="modalExternalParticipantsList">
                      <!-- Added external contacts will appear here -->
                    </div>
                    <div class="search-box mb-3">
                      <i class="fas fa-search"></i>
                      <input type="text" class="form-control ps-5" placeholder="Search existing external contacts..." 
                             onkeyup="ChatModal.filterParticipants('external')" id="externalSearch" />
                    </div>
                    <div id="externalParticipantsList" style="max-height: 200px; overflow-y: auto;"></div>
                  </div>
                </div>

                <!-- Selected Participants Display -->
                <div class="mt-3">
                  <label class="form-label fw-bold">Selected Participants:</label>
                  <div id="selectedParticipantsDisplay" class="d-flex flex-wrap gap-2"></div>
                </div>
              </div>

              <!-- Step 3: Initial Message -->
              <div id="step3" class="step-content" style="display: none;">
                <h6 class="mb-3">Compose Initial Message</h6>
                <div class="mb-4">
                  <label for="initialMessage" class="form-label fw-bold">Initial Message</label>
                  <textarea class="form-control" id="initialMessage" rows="5" 
                            placeholder="Enter your opening message to start the conversation..."></textarea>
                  <div class="form-text">This message will be sent to all participants when the conversation is created</div>
                </div>

                <!-- Summary -->
                <div class="bg-light rounded p-3">
                  <h6 class="mb-3">Conversation Summary</h6>
                  <div class="mb-2">
                    <strong>Name:</strong> <span id="summaryName"></span>
                  </div>
                  <div class="mb-2">
                    <strong>Package:</strong> <span id="summaryPackage">None</span>
                  </div>
                  <div>
                    <strong>Participants:</strong> <span id="summaryParticipants"></span>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" onclick="ChatModal.cancel()">Cancel</button>
              <button type="button" class="btn btn-outline-primary" id="prevBtn" onclick="ChatModal.previousStep()" style="display: none;">
                <i class="fas fa-arrow-left me-2"></i>Previous
              </button>
              <button type="button" class="btn btn-primary" id="nextBtn" onclick="ChatModal.nextStep()">
                Next<i class="fas fa-arrow-right ms-2"></i>
              </button>
              <button type="button" class="btn btn-success" id="createBtn" onclick="ChatModal.createChat()" style="display: none;">
                <i class="fas fa-comment me-2"></i>Start Conversation
              </button>
            </div>
          </div>
        </div>
      </div>

    `;
  },

  open(packageId = null) {
    this.selectedParticipants = [];
    this.selectedPackageId = packageId;
    this.launchedFromPackage = !!packageId;
    this.currentStep = 1;
    
    // Reset form
    const chatName = document.getElementById('chatName');
    const initialMessage = document.getElementById('initialMessage');
    if (chatName) chatName.value = '';
    if (initialMessage) initialMessage.value = '';

    // Set default chat name
    const now = new Date();
    const timestamp = now.toLocaleString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    if (packageId) {
      const pkg = AppStore.getPackageById(packageId);
      if (pkg) {
        document.getElementById('chatName').value = `${pkg.name} - ${timestamp}`;
        document.getElementById('packageName').textContent = pkg.name;
        document.getElementById('packageDisplay').style.display = 'block';
        document.getElementById('packageSelector').style.display = 'none';
      }
    } else {
      document.getElementById('chatName').value = `New Chat - ${timestamp}`;
      document.getElementById('packageDisplay').style.display = 'none';
      document.getElementById('packageSelector').style.display = 'block';
    }

    // Load participants
    this.loadAllParticipants();
    
    // Initialize step display
    this.updateStepDisplay();
    
    // Show modal
    new bootstrap.Modal(document.getElementById('chatModal')).show();
  },

  loadAllParticipants() {
    // Load internal users from the store
    const internalUsers = AppStore.allUsers.filter(user => user.id !== AppStore.currentUser.id);

    // Load groups from the store
    const groups = AppStore.groups;

    // Load external contacts (package participants if package selected, otherwise all known external contacts)
    let externalContacts = [];
    if (this.selectedPackageId) {
      const packageParticipants = AppStore.packageParticipants[this.selectedPackageId] || [];
      externalContacts = packageParticipants.filter(p => p.type === 'external');
    } else {
      // Get all unique external contacts from all packages
      const allExternals = new Map();
      Object.values(AppStore.packageParticipants).forEach(participants => {
        participants.filter(p => p.type === 'external').forEach(p => {
          allExternals.set(p.email, p);
        });
      });
      externalContacts = Array.from(allExternals.values());
    }

    // Add any additional external contacts added during session
    externalContacts = [...externalContacts, ...this.externalContacts];

    // Render lists
    this.renderParticipantsList(internalUsers, 'internal');
    this.renderParticipantsList(groups, 'groups');
    this.renderParticipantsList(externalContacts, 'external');
    this.updateSelectedDisplay();
  },

  renderParticipantsList(participants, type) {
    const listIdMap = {
      'internal': 'internalParticipantsList',
      'groups': 'groupsParticipantsList',
      'external': 'externalParticipantsList'
    };
    const listId = listIdMap[type];
    const list = document.getElementById(listId);
    
    if (type === 'groups') {
      list.innerHTML = participants.map(group => `
        <div class="participant-item ${this.selectedParticipants.some(p => p.id === group.id && p.type === 'group') ? 'selected' : ''}" 
             onclick="ChatModal.toggleParticipant('${group.id}', '${type}')" 
             data-participant-id="${group.id}"
             data-participant-type="${type}">
          <div class="d-flex align-items-center">
            <div class="participant-avatar avatar-group">
              <i class="fas fa-users"></i>
            </div>
            <div class="flex-grow-1">
              <div class="fw-bold">${group.name}</div>
              <div class="text-muted small">${group.description}</div>
              <div class="small">
                <span class="badge bg-info">${group.members.length} members</span>
              </div>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="checkbox" 
                     id="participant-${type}-${group.id}"
                     ${this.selectedParticipants.some(p => p.id === group.id && p.type === 'group') ? 'checked' : ''}>
            </div>
          </div>
        </div>
      `).join('');
    } else {
      list.innerHTML = participants.map(participant => `
        <div class="participant-item ${this.selectedParticipants.some(p => p.id === participant.id) ? 'selected' : ''}" 
             onclick="ChatModal.toggleParticipant(${participant.id}, '${type}')" 
             data-participant-id="${participant.id}"
             data-participant-type="${type}">
          <div class="d-flex align-items-center">
            <div class="participant-avatar ${type === 'internal' ? (participant.avatarClass || 'avatar-blue') : 'avatar-green'}">
              ${participant.initials || participant.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div class="flex-grow-1">
              <div class="fw-bold">${participant.name}</div>
              <div class="text-muted small">${participant.email}</div>
              <div class="small">
                <span class="badge ${type === 'internal' ? 'bg-primary' : 'bg-secondary'}">${participant.role || 'External'}</span>
              </div>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="checkbox" 
                     id="participant-${type}-${participant.id}"
                     ${this.selectedParticipants.some(p => p.id === participant.id) ? 'checked' : ''}>
            </div>
          </div>
        </div>
      `).join('');
    }
  },

  filterParticipants(type) {
    const searchId = type === 'internal' ? 'internalSearch' : 'externalSearch';
    const searchTerm = document.getElementById(searchId).value.toLowerCase();
    const listId = type === 'internal' ? 'internalParticipantsList' : 'externalParticipantsList';
    
    const items = document.querySelectorAll(`#${listId} .participant-item`);
    items.forEach(item => {
      const text = item.textContent.toLowerCase();
      item.style.display = text.includes(searchTerm) ? 'block' : 'none';
    });
  },

  toggleParticipant(participantId, type) {
    // Get participant data
    let participant;
    if (type === 'internal') {
      participant = AppStore.getUserById(participantId);
    } else if (type === 'groups') {
      participant = AppStore.getGroupById(participantId);
    } else {
      // Find in package participants or external contacts
      if (this.selectedPackageId) {
        const packageParticipants = AppStore.packageParticipants[this.selectedPackageId] || [];
        participant = packageParticipants.find(p => p.id === participantId);
      }
      if (!participant) {
        // Check all external contacts
        Object.values(AppStore.packageParticipants).forEach(participants => {
          const found = participants.find(p => p.id === participantId && p.type === 'external');
          if (found) participant = found;
        });
      }
      if (!participant) {
        participant = this.externalContacts.find(p => p.id === participantId);
      }
    }

    if (!participant) return;

    // Toggle selection - need to handle groups differently
    const index = this.selectedParticipants.findIndex(p => 
      p.id === participantId && (type === 'groups' ? p.type === 'group' : true)
    );
    
    if (index > -1) {
      this.selectedParticipants.splice(index, 1);
    } else {
      if (type === 'groups') {
        this.selectedParticipants.push({
          id: participant.id,
          name: participant.name,
          description: participant.description,
          members: participant.members,
          type: 'group'
        });
      } else {
        this.selectedParticipants.push({
          id: participant.id,
          name: participant.name,
          type: participant.type || type,
          email: participant.email,
          role: participant.role,
          initials: participant.initials || participant.name.split(' ').map(n => n[0]).join(''),
          avatarClass: participant.avatarClass || (type === 'internal' ? 
            ['avatar-blue', 'avatar-purple', 'avatar-orange', 'avatar-green'][Math.floor(Math.random() * 4)] :
            ['avatar-green', 'avatar-blue', 'avatar-orange', 'avatar-purple'][Math.floor(Math.random() * 4)])
        });
      }
    }

    // Update UI
    const item = document.querySelector(`[data-participant-id="${participantId}"][data-participant-type="${type}"]`);
    const checkbox = document.getElementById(`participant-${type}-${participantId}`);
    
    if (item) item.classList.toggle('selected');
    if (checkbox) checkbox.checked = !checkbox.checked;
    
    this.updateSelectedDisplay();
  },

  updateSelectedDisplay() {
    const display = document.getElementById('selectedParticipantsDisplay');
    if (!display) return;

    if (this.selectedParticipants.length === 0) {
      display.innerHTML = '<span class="text-muted">No participants selected</span>';
    } else {
      display.innerHTML = this.selectedParticipants.map(p => `
        <span class="badge bg-secondary d-flex align-items-center gap-1">
          <i class="fas fa-${p.type === 'group' ? 'users' : p.type === 'external' ? 'user-plus' : 'user'} me-1"></i>
          ${p.name}${p.type === 'group' ? ` (${p.members.length} members)` : ''}
          <button type="button" class="btn-close btn-close-white btn-sm" 
                  onclick="ChatModal.removeParticipant('${p.id}', '${p.type}')"
                  style="font-size: 0.7rem;"></button>
        </span>
      `).join('');
    }
  },

  removeParticipant(participantId, participantType) {
    const participant = this.selectedParticipants.find(p => p.id === participantId && (participantType === 'group' ? p.type === 'group' : true));
    if (participant) {
      this.toggleParticipant(participantId, participantType === 'group' ? 'groups' : participant.type);
    }
  },

  selectPackage() {
    const packageSelect = document.getElementById('packageSelect');
    this.selectedPackageId = packageSelect.value ? parseInt(packageSelect.value) : null;
    
    if (this.selectedPackageId) {
      // Reload participants to include package-specific external contacts
      this.loadAllParticipants();
    }
  },


  addExternalParticipant() {
    const name = document.getElementById('modalExternalName').value.trim();
    const email = document.getElementById('modalExternalEmail').value.trim();
    const role = document.getElementById('modalExternalRole').value.trim() || 'External Contact';
    const securityQuestion = document.getElementById('modalExternalSecurityQuestion').value;
    const securityAnswer = document.getElementById('modalExternalSecurityAnswer').value.trim();
    
    if (!name || !email) {
      this.showToast('Please enter both name and email for external contact', 'error');
      return;
    }
    
    if (!securityQuestion || !securityAnswer) {
      this.showToast('Please select a security question and provide an answer', 'error');
      return;
    }
    
    // Check if email already exists in selected participants
    if (this.selectedParticipants.some(p => p.email === email)) {
      this.showToast('This email is already added', 'error');
      return;
    }
    
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    const avatarClasses = ['avatar-blue', 'avatar-orange', 'avatar-green', 'avatar-purple'];
    const avatarClass = avatarClasses[Math.floor(Math.random() * avatarClasses.length)];
    
    const externalUser = {
      id: Date.now(),
      name: name,
      email: email,
      role: role,
      type: 'external',
      initials: initials,
      avatarClass: avatarClass,
      securityQuestion: securityQuestion,
      securityAnswer: securityAnswer.toLowerCase().trim(),
      verificationAttempts: 0,
      isLinkValid: true
    };
    
    // Add to selected participants directly
    this.selectedParticipants.push(externalUser);
    
    // Clear form
    document.getElementById('modalExternalName').value = '';
    document.getElementById('modalExternalEmail').value = '';
    document.getElementById('modalExternalRole').value = '';
    document.getElementById('modalExternalSecurityQuestion').value = '';
    document.getElementById('modalExternalSecurityAnswer').value = '';
    
    this.updateModalExternalParticipantsList();
    this.updateSelectedDisplay();
  },

  updateModalExternalParticipantsList() {
    const container = document.getElementById('modalExternalParticipantsList');
    const externalParticipants = this.selectedParticipants.filter(p => p.type === 'external');
    
    if (externalParticipants.length === 0) {
      container.innerHTML = '';
      return;
    }
    
    container.innerHTML = `
      <h6>Added External Contacts:</h6>
      <div class="list-group">
        ${externalParticipants.map(user => `
          <div class="list-group-item d-flex align-items-center justify-content-between">
            <div class="d-flex align-items-center">
              <div class="participant-avatar ${user.avatarClass} me-3">${user.initials}</div>
              <div>
                <div class="fw-bold">${user.name}</div>
                <small class="text-muted">${user.email}</small>
                <div><small class="text-muted">${user.role}</small></div>
              </div>
            </div>
            <button class="btn btn-sm btn-outline-danger" onclick="ChatModal.removeModalExternalParticipant(${user.id})">
              <i class="fas fa-times"></i>
            </button>
          </div>
        `).join('')}
      </div>
    `;
  },

  removeModalExternalParticipant(userId) {
    this.selectedParticipants = this.selectedParticipants.filter(p => p.id !== userId);
    this.updateModalExternalParticipantsList();
    this.updateSelectedDisplay();
  },

  createChat() {
    const chatName = document.getElementById('chatName').value;
    const initialMessage = document.getElementById('initialMessage').value;
    
    if (!chatName.trim()) {
      this.showToast('Please enter a conversation name', 'error');
      return;
    }
    
    if (this.selectedParticipants.length === 0) {
      this.showToast('Please select at least one participant', 'error');
      return;
    }
    
    if (!initialMessage.trim()) {
      this.showToast('Please enter an initial message', 'error');
      return;
    }
    
    // Add current user as participant if not already included
    const currentUserIncluded = this.selectedParticipants.some(p => p.id === AppStore.currentUser.id);
    if (!currentUserIncluded) {
      this.selectedParticipants.push({
        id: AppStore.currentUser.id,
        name: AppStore.currentUser.name,
        type: 'internal',
        initials: AppStore.currentUser.initials,
        avatarClass: AppStore.currentUser.avatarClass
      });
    }
    
    // Create conversation
    const newConversation = AppStore.createConversation({
      name: chatName,
      packageId: this.selectedPackageId,
      packageName: this.selectedPackageId ? AppStore.getPackageById(this.selectedPackageId).name : null,
      participants: this.selectedParticipants,
      initialMessage: initialMessage
    });
    
    AppStore.selectedConversationId = newConversation.id;
    
    // Close modal
    bootstrap.Modal.getInstance(document.getElementById('chatModal')).hide();
    
    // Navigate to chat view
    setTimeout(() => {
      App.navigateTo('chat');
    }, 300);
  },

  nextStep() {
    if (!this.validateStep(this.currentStep)) {
      return;
    }
    
    if (this.currentStep < 3) {
      this.currentStep++;
      this.updateStepDisplay();
      
      // Update summary when reaching step 3
      if (this.currentStep === 3) {
        this.updateSummary();
      }
    }
  },

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.updateStepDisplay();
    }
  },

  updateStepDisplay() {
    // Hide all steps
    for (let i = 1; i <= 3; i++) {
      const step = document.getElementById(`step${i}`);
      if (step) step.style.display = 'none';
    }
    
    // Show current step
    const currentStepElement = document.getElementById(`step${this.currentStep}`);
    if (currentStepElement) currentStepElement.style.display = 'block';
    
    // Update progress indicators
    for (let i = 1; i <= 3; i++) {
      const circle = document.getElementById(`step${i}Circle`);
      const line = document.getElementById(`step${i}Line`);
      
      if (circle) {
        if (i < this.currentStep) {
          circle.className = 'rounded-circle bg-success text-white d-inline-flex align-items-center justify-content-center';
          circle.innerHTML = '<i class="fas fa-check"></i>';
        } else if (i === this.currentStep) {
          circle.className = 'rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center';
          circle.textContent = i;
        } else {
          circle.className = 'rounded-circle bg-secondary text-white d-inline-flex align-items-center justify-content-center';
          circle.textContent = i;
        }
      }
      
      if (line) {
        line.style.borderColor = i < this.currentStep ? '#198754' : '#dee2e6';
      }
    }
    
    // Update buttons
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const createBtn = document.getElementById('createBtn');
    
    if (prevBtn) prevBtn.style.display = this.currentStep > 1 ? 'inline-block' : 'none';
    if (nextBtn) nextBtn.style.display = this.currentStep < 3 ? 'inline-block' : 'none';
    if (createBtn) createBtn.style.display = this.currentStep === 3 ? 'inline-block' : 'none';
  },

  validateStep(step) {
    switch (step) {
      case 1:
        const chatName = document.getElementById('chatName').value.trim();
        if (!chatName) {
          this.showToast('Please enter a conversation name', 'error');
          return false;
        }
        return true;
        
      case 2:
        if (this.selectedParticipants.length === 0) {
          this.showToast('Please select at least one participant', 'error');
          return false;
        }
        return true;
        
      case 3:
        return true; // Initial message is optional
        
      default:
        return true;
    }
  },

  updateSummary() {
    // Update summary name
    const summaryName = document.getElementById('summaryName');
    if (summaryName) {
      summaryName.textContent = document.getElementById('chatName').value || 'Untitled';
    }
    
    // Update summary package
    const summaryPackage = document.getElementById('summaryPackage');
    if (summaryPackage) {
      if (this.selectedPackageId) {
        const pkg = AppStore.getPackageById(this.selectedPackageId);
        summaryPackage.textContent = pkg ? pkg.name : 'None';
      } else {
        summaryPackage.textContent = 'None';
      }
    }
    
    // Update summary participants
    const summaryParticipants = document.getElementById('summaryParticipants');
    if (summaryParticipants) {
      if (this.selectedParticipants.length === 0) {
        summaryParticipants.textContent = 'None selected';
      } else {
        const participantNames = this.selectedParticipants.map(p => p.name);
        summaryParticipants.textContent = participantNames.join(', ');
      }
    }
  },

  cancel() {
    // Reset state
    this.selectedParticipants = [];
    this.selectedPackageId = null;
    this.launchedFromPackage = false;
    this.externalContacts = [];
    this.currentStep = 1;
    this.chatName = '';
    this.initialMessage = '';
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('chatModal'));
    if (modal) modal.hide();
  },

  showToast(message, type = 'info') {
    let toastContainer = document.getElementById('toastContainer');
    
    // Create toast container if it doesn't exist
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'toastContainer';
      toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
      document.body.appendChild(toastContainer);
    }
    
    const toastId = 'toast-' + Date.now();
    
    const iconMap = {
      success: 'fas fa-check-circle text-success',
      error: 'fas fa-exclamation-circle text-danger',
      warning: 'fas fa-exclamation-triangle text-warning',
      info: 'fas fa-info-circle text-info'
    };
    
    const bgMap = {
      success: 'bg-success',
      error: 'bg-danger',
      warning: 'bg-warning',
      info: 'bg-info'
    };
    
    const toastHtml = `
      <div class="toast" id="${toastId}" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="toast-header ${bgMap[type]} text-white">
          <i class="${iconMap[type]} me-2"></i>
          <strong class="me-auto">Notification</strong>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
        </div>
        <div class="toast-body">
          ${message}
        </div>
      </div>
    `;
    
    toastContainer.insertAdjacentHTML('beforeend', toastHtml);
    
    const toastElement = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastElement, {
      autohide: true,
      delay: 4000
    });
    
    toast.show();
    
    // Remove toast element after it's hidden
    toastElement.addEventListener('hidden.bs.toast', () => {
      toastElement.remove();
    });
  }
};