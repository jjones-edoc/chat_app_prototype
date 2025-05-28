// Chat Application View
const ChatView = {
  render() {
    const activeConversation = AppStore.getConversationById(AppStore.selectedConversationId);
    
    return `
      <div class="chat-container">
        <!-- Header -->
        <div class="header">
          <div class="container-fluid">
            <div class="row align-items-center">
              <div class="col-4">
                <div class="logo">
                  <i class="fas fa-comments"></i>
                  eDOC Chat
                </div>
              </div>
              <div class="col-4 text-center">
              </div>
              <div class="col-4 text-end">
                <button class="btn btn-link text-white" onclick="App.navigateTo('packages')" title="Exit">
                  <i class="fas fa-times fa-lg"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Content -->
        <div class="chat-content">
          <!-- Left Sidebar - Conversations -->
          <div class="conversations-sidebar">
            <div class="conversations-header">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h5 class="mb-0">Conversations</h5>
                <div class="d-flex align-items-center gap-2">
                  <button class="archive-toggle-btn ${this.showArchived ? 'active' : ''}" onclick="ChatView.toggleArchivedView()" title="${this.showArchived ? 'Hide Archived' : 'Show Archived'}">
                    <i class="fas fa-archive"></i>
                  </button>
                  <button class="package-icon-btn" onclick="ChatView.createNewChat()" title="New Conversation">
                    <i class="fas fa-comment-medical"></i>
                  </button>
                </div>
              </div>
              <div class="search-box">
                <i class="fas fa-search"></i>
                <input type="text" placeholder="Search..." id="conversationSearch" onkeyup="ChatView.filterConversations()" />
              </div>
            </div>

            <div class="conversations-list" id="conversationsList">
              ${this.renderConversationsList()}
            </div>
          </div>

          <!-- Main Chat Area -->
          <div class="chat-main">
            ${activeConversation ? this.renderChatArea(activeConversation) : this.renderEmptyState()}
          </div>

          <!-- Right Sidebar - Package Details -->
          ${activeConversation && activeConversation.packageId && this.isPackagePaneVisible() ? this.renderPackageSidebar(activeConversation) : ''}
        </div>
      </div>

      <!-- Modals -->
      ${this.renderModals()}
      ${ChatModal.render()}

      <!-- Toast Container -->
      <div class="toast-container position-fixed bottom-0 end-0 p-3" id="toastContainer">
      </div>
    `;
  },

  renderConversationsList() {
    // Filter conversations based on archive view
    const filteredConversations = this.showArchived ? 
      AppStore.conversations.filter(conv => !conv.isActive) : 
      AppStore.conversations.filter(conv => conv.isActive !== false);
    
    return filteredConversations.map(conv => {
      // Determine avatar style based on ownership
      let avatarClass, avatarContent, ownerTooltip;
      
      // Check if this conversation has any internal participants (making it a business conversation)
      const hasInternalParticipants = conv.participants.some(p => p.type === 'internal');
      
      if (hasInternalParticipants) {
        // Business conversation - show owner designation
        avatarContent = this.getOwnerDesignation(conv);
        ownerTooltip = this.getOwnerTooltip(conv);
        if (conv.ownerType === 'group') {
          avatarClass = 'avatar-group';
        } else {
          // Use current user's avatar class if they own it, otherwise use default
          avatarClass = conv.ownerId === AppStore.currentUser.id ? 
            AppStore.currentUser.avatarClass : 'avatar-blue';
        }
      } else {
        // Pure external conversation - use participant's avatar
        avatarClass = conv.participants[0].avatarClass;
        avatarContent = conv.participants[0].initials;
        ownerTooltip = conv.participants[0].name;
      }

      return `
        <div class="conversation-item ${conv.id === AppStore.selectedConversationId ? 'active' : ''} ${conv.isActive === false ? 'archived' : ''}" 
             onclick="ChatView.selectConversation(${conv.id})">
          <div class="d-flex align-items-center">
            ${conv.isActive === false ? '<div class="archive-indicator" title="Archived"><i class="fas fa-archive"></i></div>' : ''}
            <div class="conversation-avatar ${avatarClass}" title="${ownerTooltip}">
              ${avatarContent}
            </div>
            <div class="conversation-info">
              <div class="conversation-header">
                <div class="conversation-name">
                  ${conv.name}
                  ${conv.isActive === false ? '<span class="archived-label">Archived</span>' : ''}
                </div>
                <div class="conversation-time">${conv.lastActivity}</div>
              </div>
              <div class="conversation-preview">${conv.lastMessage}</div>
            </div>
            ${conv.unreadCount > 0 ? `<div class="unread-badge">${conv.unreadCount}</div>` : ''}
          </div>
        </div>
      `;
    }).join('');
  },

  renderChatArea(conversation) {
    const canManage = AppStore.canManageConversation(conversation.id);
    
    return `
      <div class="chat-header-info">
        <div class="chat-title">
          <div>
            <h4 id="chatTitle">${conversation.name}</h4>
            <div class="chat-participants" id="chatParticipants">
              <i class="fas fa-users me-1"></i>
              ${conversation.participants.map(p => p.name).join(', ')}
            </div>
          </div>
        </div>
        ${canManage ? `
          <div class="chat-management">
            ${conversation.packageId ? `
              <button class="package-icon-btn ${this.isPackagePaneVisible() ? 'active' : ''}" onclick="ChatView.togglePackagePane()" title="Toggle Package Details">
                <i class="fas fa-box"></i>
              </button>
            ` : ''}
            <button class="chat-menu-btn" onclick="ChatView.toggleChatMenu()">
              <i class="fas fa-ellipsis-v"></i>
            </button>
            <div class="chat-menu" id="chatMenu">
              <div class="chat-menu-item" onclick="ChatView.addToChat()">
                <i class="fas fa-user-plus"></i>Add to Chat
              </div>
              ${!conversation.packageId ? `
                <div class="chat-menu-item" onclick="ChatView.attachToPackage()">
                  <i class="fas fa-paperclip"></i>Attach to Package
                </div>
              ` : ''}
              <div class="chat-menu-item" onclick="ChatView.switchOwner()">
                <i class="fas fa-exchange-alt"></i>Switch Owner
              </div>
              <div class="chat-menu-item" onclick="ChatView.closeChat()">
                <i class="fas fa-archive"></i>Close Chat
              </div>
              <div class="chat-menu-item danger" onclick="ChatView.deleteChat()">
                <i class="fas fa-trash"></i>Delete Chat
              </div>
            </div>
          </div>
        ` : ''}
      </div>

      <div class="messages-area" id="messagesArea">
        ${this.renderMessages(conversation.id)}
      </div>

      <div class="message-input-area">
        <div class="message-input-container">
          <textarea class="message-input" id="messageInput" 
                    placeholder="Enter your text" rows="1"
                    onkeypress="ChatView.handleKeyPress(event)"
                    oninput="ChatView.handleInput()"></textarea>
          <div class="input-actions">
            <button class="input-btn send-btn" id="sendBtn" onclick="ChatView.sendMessage()" 
                    title="Send Message" disabled>
              <i class="fas fa-paper-plane"></i>
            </button>
            <button class="input-btn attachment-btn" onclick="ChatView.attachFile()" title="Attach File">
              <i class="fas fa-paperclip"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  },

  renderMessages(conversationId) {
    const messages = AppStore.getMessagesForConversation(conversationId);
    
    if (messages.length === 0) {
      return '<div class="text-center text-muted p-5">No messages yet. Start the conversation!</div>';
    }
    
    return messages.map(msg => {
      const isOwn = msg.senderId === AppStore.currentUser.id;
      
      return `
        <div class="message ${isOwn ? 'own' : ''}">
          <div class="message-avatar ${msg.avatarClass}">
            ${msg.senderInitials}
          </div>
          <div class="message-content">
            ${!isOwn ? `
              <div class="message-meta">
                <strong>${msg.sender}</strong>
              </div>
            ` : ''}
            <div class="message-bubble">
              ${msg.content}
              ${msg.hasAttachment ? `
                <div class="attachment">
                  <div class="attachment-icon">
                    <i class="fas fa-file-pdf"></i>
                  </div>
                  <div class="attachment-info">
                    <div class="attachment-name">${msg.attachment.name}</div>
                    <div class="attachment-size">${msg.attachment.size}</div>
                  </div>
                </div>
              ` : ''}
            </div>
            <div class="message-time">${msg.time}</div>
          </div>
        </div>
      `;
    }).join('');
  },

  renderPackageSidebar(conversation) {
    const pkg = AppStore.getPackageById(conversation.packageId);
    if (!pkg) return '';
    
    return `
      <div class="package-sidebar">
        <div class="package-header">
          <h5>Package Details</h5>
        </div>

        <div class="p-3">
          <div class="package-info">
            <a href="#" class="package-name" onclick="ChatView.openPackage(${pkg.id})">
              ${pkg.name}
            </a>

            <div class="package-detail">
              <span class="label">Status</span>
              <span class="value ${pkg.status === 'Completed' ? 'status-completed' : ''}">${pkg.status}</span>
            </div>

            <div class="package-detail">
              <span class="label">Created</span>
              <span class="value">${pkg.created}</span>
            </div>

            <div class="package-detail">
              <span class="label">Modified</span>
              <span class="value">${pkg.modified || '-'}</span>
            </div>

            <div class="package-detail">
              <span class="label">Owner</span>
              <span class="value">${pkg.owner}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  renderEmptyState() {
    return `
      <div class="d-flex align-items-center justify-content-center h-100">
        <div class="text-center">
          <i class="fas fa-comments" style="font-size: 4rem; color: #e0e0e0;"></i>
          <h4 class="mt-3 text-muted">Select a conversation to start chatting</h4>
        </div>
      </div>
    `;
  },

  renderModals() {
    return `
      <!-- Add Participants Modal -->
      <div class="modal fade" id="addParticipantsModal" tabindex="-1">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title"><i class="fas fa-user-plus me-2"></i>Add Participants to Chat</h5>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <!-- Tab Navigation -->
              <ul class="nav nav-tabs mb-3" id="participantTabs" role="tablist">
                <li class="nav-item" role="presentation">
                  <button class="nav-link active" id="internal-tab" data-bs-toggle="tab" data-bs-target="#internal-pane" type="button" role="tab" onclick="ChatView.switchToInternalTab()">
                    <i class="fas fa-user me-2"></i>Internal Users
                  </button>
                </li>
                <li class="nav-item" role="presentation">
                  <button class="nav-link" id="groups-tab" data-bs-toggle="tab" data-bs-target="#groups-pane" type="button" role="tab" onclick="ChatView.switchToGroupsTab()">
                    <i class="fas fa-users me-2"></i>Groups
                  </button>
                </li>
                <li class="nav-item" role="presentation">
                  <button class="nav-link" id="external-tab" data-bs-toggle="tab" data-bs-target="#external-pane" type="button" role="tab" onclick="ChatView.switchToExternalTab()">
                    <i class="fas fa-user-plus me-2"></i>External Contacts
                  </button>
                </li>
              </ul>

              <!-- Tab Content -->
              <div class="tab-content" id="participantTabContent">
                <!-- Internal Users Tab -->
                <div class="tab-pane fade show active" id="internal-pane" role="tabpanel">
                  <div class="search-box mb-3">
                    <i class="fas fa-search"></i>
                    <input type="text" class="form-control ps-5" id="internalSearch" placeholder="Search internal users..." onkeyup="ChatView.filterInternalUsers()">
                  </div>
                  <div class="participant-list" id="internalUserList" style="max-height: 300px; overflow-y: auto;">
                    ${this.renderInternalUserList()}
                  </div>
                </div>

                <!-- Groups Tab -->
                <div class="tab-pane fade" id="groups-pane" role="tabpanel">
                  <div class="search-box mb-3">
                    <i class="fas fa-search"></i>
                    <input type="text" class="form-control ps-5" id="groupSearch" placeholder="Search groups..." onkeyup="ChatView.filterGroups()">
                  </div>
                  <div class="participant-list" id="groupList" style="max-height: 300px; overflow-y: auto;">
                    <!-- Groups will be loaded dynamically -->
                  </div>
                </div>

                <!-- External Contacts Tab -->
                <div class="tab-pane fade" id="external-pane" role="tabpanel">
                  <div class="mb-3">
                    <label class="form-label">Add External Contact:</label>
                    <div class="row g-2">
                      <div class="col-md-6">
                        <input type="text" class="form-control" id="externalName" placeholder="Full Name">
                      </div>
                      <div class="col-md-6">
                        <input type="email" class="form-control" id="externalEmail" placeholder="Email Address">
                      </div>
                    </div>
                    <div class="mt-2">
                      <input type="text" class="form-control" id="externalRole" placeholder="Role/Title (optional)">
                    </div>
                    <button type="button" class="btn btn-outline-primary mt-2" onclick="ChatView.addExternalParticipant()">
                      <i class="fas fa-plus me-2"></i>Add External Contact
                    </button>
                  </div>
                  <div id="externalParticipantsList">
                    <!-- Added external contacts will appear here -->
                  </div>
                </div>
              </div>

              <!-- Selected Participants Summary -->
              <div class="mt-3" id="selectedParticipantsSection" style="display: none;">
                <hr>
                <h6>Selected Participants:</h6>
                <div id="selectedParticipantsList" class="d-flex flex-wrap gap-2">
                  <!-- Selected participants will be shown here -->
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="button" class="btn btn-primary" id="addParticipantsBtn" onclick="ChatView.confirmAddParticipants()" disabled>Add Selected</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Switch Ownership Modal -->
      <div class="modal fade" id="switchOwnerModal" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title"><i class="fas fa-exchange-alt me-2"></i>Transfer Conversation Ownership</h5>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3">
                <ul class="nav nav-tabs" id="assignmentTabs" role="tablist">
                  <li class="nav-item" role="presentation">
                    <button class="nav-link active" id="users-tab" data-bs-toggle="tab" data-bs-target="#users-pane" type="button" role="tab" onclick="ChatView.switchToUsersTab()">
                      <i class="fas fa-user me-2"></i>Individual Users
                    </button>
                  </li>
                  <li class="nav-item" role="presentation">
                    <button class="nav-link" id="groups-tab" data-bs-toggle="tab" data-bs-target="#groups-pane" type="button" role="tab" onclick="ChatView.switchToGroupsTab()">
                      <i class="fas fa-users me-2"></i>Groups
                    </button>
                  </li>
                </ul>
              </div>

              <div class="tab-content" id="assignmentTabContent">
                <div class="tab-pane fade show active" id="users-pane" role="tabpanel" aria-labelledby="users-tab">
                  <div class="mb-3">
                    <label class="form-label">Select User:</label>
                    <div class="search-box mb-2">
                      <i class="fas fa-search"></i>
                      <input type="text" class="form-control ps-5" id="userSearch" placeholder="Search users..." onkeyup="ChatView.filterUsers()">
                    </div>
                    <div class="list-group" id="userList" style="max-height: 300px; overflow-y: auto;">
                      ${this.renderUserList()}
                    </div>
                  </div>
                </div>
                
                <div class="tab-pane fade" id="groups-pane" role="tabpanel" aria-labelledby="groups-tab">
                  <div class="mb-3">
                    <label class="form-label">Select Group:</label>
                    <div class="list-group" id="ownerGroupList">
                      <!-- Groups will be loaded dynamically -->
                    </div>
                  </div>
                </div>
              </div>

              <div class="alert alert-info">
                <i class="fas fa-info-circle me-2"></i>
                Transferring ownership will give the selected user or group full control over this conversation.
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="button" class="btn btn-primary" id="transferOwnershipBtn" onclick="ChatView.confirmOwnershipTransfer()" disabled>Transfer Ownership</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Attach to Package Modal -->
      <div class="modal fade" id="attachPackageModal" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title"><i class="fas fa-paperclip me-2"></i>Attach to Package</h5>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3">
                <label class="form-label">Select a package to attach this conversation to:</label>
                <div class="search-box mb-3">
                  <i class="fas fa-search"></i>
                  <input type="text" class="form-control ps-5" id="packageSearch" placeholder="Search packages..." onkeyup="ChatView.filterPackages()">
                </div>
                <div class="package-list" id="packageList" style="max-height: 300px; overflow-y: auto;">
                  ${this.renderPackageList()}
                </div>
              </div>
              <div class="alert alert-info">
                <i class="fas fa-info-circle me-2"></i>
                Attaching this conversation to a package will enable package details viewing and better organization.
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="button" class="btn btn-primary" id="attachPackageBtn" onclick="ChatView.confirmPackageAttachment()" disabled>Attach to Package</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Confirmation Modal -->
      <div class="modal fade" id="confirmationModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="confirmationTitle">Confirm Action</h5>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <div class="d-flex align-items-center">
                <div class="me-3">
                  <i id="confirmationIcon" class="fas fa-question-circle text-warning" style="font-size: 2rem;"></i>
                </div>
                <div>
                  <p id="confirmationMessage" class="mb-0">Are you sure you want to proceed?</p>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="button" class="btn btn-primary" id="confirmationConfirmBtn">Confirm</button>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  // Event handlers
  selectConversation(conversationId) {
    AppStore.selectedConversationId = conversationId;
    
    // Mark messages as read
    const conversation = AppStore.getConversationById(conversationId);
    if (conversation) {
      conversation.unreadCount = 0;
      conversation.hasNewMessages = false;
    }
    
    App.render();
    this.scrollToBottom();
  },

  toggleChatMenu() {
    const chatMenu = document.getElementById('chatMenu');
    chatMenu.classList.toggle('show');
  },

  createNewChat() {
    ChatModal.open();
  },

  addToChat() {
    this.toggleChatMenu();
    this.selectedInternalUsers = [];
    this.selectedGroups = [];
    this.selectedExternalUsers = [];
    
    const modal = new bootstrap.Modal(document.getElementById('addParticipantsModal'));
    modal.show();
    
    // Wait for modal to be shown, then initialize
    setTimeout(() => {
      this.clearParticipantSelections();
      this.loadGroupList();
      const btn = document.getElementById('addParticipantsBtn');
      const section = document.getElementById('selectedParticipantsSection');
      if (btn) btn.disabled = true;
      if (section) section.style.display = 'none';
    }, 100);
  },

  loadGroupList() {
    const groupList = document.getElementById('groupList');
    if (groupList) {
      groupList.innerHTML = this.renderGroupList();
      
      // Remove existing event listeners to avoid duplicates
      groupList.removeEventListener('click', this.groupClickHandler);
      
      // Create bound handler with explicit context
      const chatViewRef = this;
      this.groupClickHandler = function(e) {
        const groupItem = e.target.closest('.group-item');
        if (groupItem) {
          const groupId = groupItem.getAttribute('data-group-id');
          chatViewRef.selectGroup(groupId);
        }
      };
      
      // Add event delegation for group clicks
      groupList.addEventListener('click', this.groupClickHandler);
    }
  },

  attachToPackage() {
    this.toggleChatMenu();
    this.selectedPackage = null;
    document.getElementById('attachPackageBtn').disabled = true;
    document.getElementById('packageSearch').value = '';
    document.getElementById('packageList').innerHTML = this.renderPackageList();
    new bootstrap.Modal(document.getElementById('attachPackageModal')).show();
  },


  switchOwner() {
    this.toggleChatMenu();
    new bootstrap.Modal(document.getElementById('switchOwnerModal')).show();
  },

  closeChat() {
    this.toggleChatMenu();
    this.showConfirmation(
      'Close Chat',
      'Are you sure you want to close this chat? It will be archived.',
      'fas fa-archive text-warning',
      () => {
        const conversation = AppStore.getConversationById(AppStore.selectedConversationId);
        if (conversation) {
          conversation.isActive = false;
          
          // Add system message about archiving
          AppStore.addMessage(AppStore.selectedConversationId, {
            id: Date.now(),
            conversationId: AppStore.selectedConversationId,
            senderId: 'system',
            sender: 'System',
            senderInitials: 'SYS',
            avatarClass: 'avatar-system',
            content: 'Conversation has been archived',
            time: "just now",
            timestamp: new Date(),
            isOwn: false,
            isSystem: true,
            status: "delivered"
          });
          
          // Re-render to update conversation list
          App.render();
          
          this.showToast('Chat closed and archived', 'success');
        }
      }
    );
  },

  deleteChat() {
    this.toggleChatMenu();
    this.showConfirmation(
      'Delete Chat',
      'Are you sure you want to permanently delete this chat? This action cannot be undone.',
      'fas fa-trash text-danger',
      () => {
        this.showToast('Chat deleted permanently', 'success');
      }
    );
  },

  attachFile() {
    this.showToast('File attachment functionality would open file picker', 'info');
  },

  openPackage(packageId) {
    App.navigateTo('packages');
  },

  togglePackagePane() {
    if (!this.packagePaneState) {
      this.packagePaneState = {};
    }
    
    const conversationId = AppStore.selectedConversationId;
    this.packagePaneState[conversationId] = !this.packagePaneState[conversationId];
    
    App.render();
  },

  isPackagePaneVisible() {
    if (!this.packagePaneState) {
      this.packagePaneState = {};
    }
    
    const conversationId = AppStore.selectedConversationId;
    return this.packagePaneState[conversationId] || false;
  },

  handleKeyPress(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  },

  handleInput() {
    const messageInput = document.getElementById('messageInput');
    const sendBtn = document.getElementById('sendBtn');
    
    // Auto-resize textarea
    messageInput.style.height = 'auto';
    messageInput.style.height = Math.min(messageInput.scrollHeight, 100) + 'px';
    
    // Enable/disable send button
    sendBtn.disabled = !messageInput.value.trim();
  },

  sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();
    
    if (!message) return;
    
    // Add message
    const newMessage = {
      id: Date.now(),
      conversationId: AppStore.selectedConversationId,
      senderId: AppStore.currentUser.id,
      sender: AppStore.currentUser.name,
      senderInitials: AppStore.currentUser.initials,
      avatarClass: AppStore.currentUser.avatarClass,
      content: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: new Date(),
      isOwn: true,
      status: 'sent'
    };
    
    AppStore.addMessage(AppStore.selectedConversationId, newMessage);
    
    // Clear input
    messageInput.value = '';
    messageInput.style.height = 'auto';
    document.getElementById('sendBtn').disabled = true;
    
    // Re-render messages
    document.getElementById('messagesArea').innerHTML = this.renderMessages(AppStore.selectedConversationId);
    this.scrollToBottom();
    
    // Simulate external user response after delay
    if (Math.random() > 0.5) {
      setTimeout(() => {
        this.simulateExternalResponse();
      }, 2000);
    }
  },

  simulateExternalResponse() {
    const conversation = AppStore.getConversationById(AppStore.selectedConversationId);
    const externalParticipant = conversation.participants.find(p => p.type === 'external');
    
    if (externalParticipant) {
      const responses = [
        "Thanks for the information!",
        "I'll get those documents uploaded right away.",
        "What's the timeline for approval?",
        "I have a question about the interest rates.",
        "Perfect, I'll gather those documents.",
        "When can we schedule a meeting to discuss?",
        "That makes sense. What else do you need from me?",
        "I appreciate your help with this process."
      ];
      
      const newMessage = {
        id: Date.now(),
        conversationId: AppStore.selectedConversationId,
        senderId: externalParticipant.id,
        sender: externalParticipant.name,
        senderInitials: externalParticipant.initials,
        avatarClass: externalParticipant.avatarClass,
        content: responses[Math.floor(Math.random() * responses.length)],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        timestamp: new Date(),
        isOwn: false,
        status: 'delivered'
      };
      
      AppStore.addMessage(AppStore.selectedConversationId, newMessage);
      
      // Update UI if still on same conversation
      if (AppStore.selectedConversationId === newMessage.conversationId) {
        document.getElementById('messagesArea').innerHTML = this.renderMessages(AppStore.selectedConversationId);
        this.scrollToBottom();
      }
    }
  },

  filterConversations() {
    const searchTerm = document.getElementById('conversationSearch').value.toLowerCase();
    
    // Apply archive filter first, then search filter
    let baseConversations = this.showArchived ? 
      AppStore.conversations.filter(conv => !conv.isActive) : 
      AppStore.conversations.filter(conv => conv.isActive !== false);
    
    const filtered = baseConversations.filter(conv => 
      conv.name.toLowerCase().includes(searchTerm) ||
      conv.lastMessage.toLowerCase().includes(searchTerm)
    );
    
    document.getElementById('conversationsList').innerHTML = filtered.map(conv => {
      // Determine avatar style based on ownership (same logic as renderConversationsList)
      let avatarClass, avatarContent, ownerTooltip;
      
      // Check if this conversation has any internal participants (making it a business conversation)
      const hasInternalParticipants = conv.participants.some(p => p.type === 'internal');
      
      if (hasInternalParticipants) {
        // Business conversation - show owner designation
        avatarContent = this.getOwnerDesignation(conv);
        ownerTooltip = this.getOwnerTooltip(conv);
        if (conv.ownerType === 'group') {
          avatarClass = 'avatar-group';
        } else {
          // Use current user's avatar class if they own it, otherwise use default
          avatarClass = conv.ownerId === AppStore.currentUser.id ? 
            AppStore.currentUser.avatarClass : 'avatar-blue';
        }
      } else {
        // Pure external conversation - use participant's avatar
        avatarClass = conv.participants[0].avatarClass;
        avatarContent = conv.participants[0].initials;
        ownerTooltip = conv.participants[0].name;
      }

      return `
        <div class="conversation-item ${conv.id === AppStore.selectedConversationId ? 'active' : ''} ${conv.isActive === false ? 'archived' : ''}" 
             onclick="ChatView.selectConversation(${conv.id})">
          <div class="d-flex align-items-center">
            ${conv.isActive === false ? '<div class="archive-indicator" title="Archived"><i class="fas fa-archive"></i></div>' : ''}
            <div class="conversation-avatar ${avatarClass}" title="${ownerTooltip}">
              ${avatarContent}
            </div>
            <div class="conversation-info">
              <div class="conversation-header">
                <div class="conversation-name">
                  ${conv.name}
                  ${conv.isActive === false ? '<span class="archived-label">Archived</span>' : ''}
                </div>
                <div class="conversation-time">${conv.lastActivity}</div>
              </div>
              <div class="conversation-preview">${conv.lastMessage}</div>
            </div>
            ${conv.unreadCount > 0 ? `<div class="unread-badge">${conv.unreadCount}</div>` : ''}
          </div>
        </div>
      `;
    }).join('');
  },

  scrollToBottom() {
    setTimeout(() => {
      const messagesArea = document.getElementById('messagesArea');
      if (messagesArea) {
        messagesArea.scrollTop = messagesArea.scrollHeight;
      }
    }, 100);
  },

  toggleArchivedView() {
    this.showArchived = !this.showArchived;
    
    // Update the conversations list
    const conversationsList = document.getElementById('conversationsList');
    if (conversationsList) {
      conversationsList.innerHTML = this.renderConversationsList();
    }
    
    // Update toggle button
    const toggleBtn = document.querySelector('.archive-toggle-btn');
    if (toggleBtn) {
      toggleBtn.classList.toggle('active', this.showArchived);
      toggleBtn.title = this.showArchived ? 'Hide Archived' : 'Show Archived';
    }
    
    // Clear search when toggling
    const searchInput = document.getElementById('conversationSearch');
    if (searchInput) {
      searchInput.value = '';
    }
  },

  init() {
    // Initialize archive view state
    this.showArchived = false;
    
    // Close chat menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.chat-management')) {
        const chatMenu = document.getElementById('chatMenu');
        if (chatMenu) {
          chatMenu.classList.remove('show');
        }
      }
    });

  },


  getOwnerDesignation(conversation) {
    // Handle group ownership - show group abbreviation
    if (conversation.ownerType === 'group') {
      const groupMapping = {
        'hr': 'HR',
        'tellers': 'TL',
        'loan_officers': 'LO'
      };
      return groupMapping[conversation.ownerId] || 'GP';
    }

    // Handle individual ownership - show user initials
    const ownerId = conversation.ownerId;
    
    // If it's the current user, use their initials
    if (ownerId === AppStore.currentUser.id) {
      return AppStore.currentUser.initials;
    }

    // For other users, look up their initials
    const owner = AppStore.getUserById(ownerId);
    if (owner && owner.initials) {
      return owner.initials;
    }

    // Fallback - try to generate initials from name
    if (owner && owner.name) {
      return owner.name.split(' ').map(n => n[0]).join('').toUpperCase();
    }

    // Default fallback
    return 'XX';
  },

  renderUserList() {
    return AppStore.allUsers
      .filter(user => user.id !== AppStore.currentUser.id) // Exclude current user
      .map(user => `
        <div class="list-group-item list-group-item-action user-item" data-user-id="${user.id}" onclick="ChatView.selectUser(${user.id})">
          <div class="d-flex align-items-center">
            <div class="participant-avatar ${user.avatarClass} me-3">${user.initials}</div>
            <div>
              <div class="fw-bold">${user.name}</div>
              <small class="text-muted">${user.email}</small>
              <div><small class="text-muted">${user.role}</small></div>
            </div>
          </div>
        </div>
      `).join('');
  },

  renderGroupList() {
    return AppStore.groups.map(group => `
      <div class="list-group-item list-group-item-action group-item" data-group-id="${group.id}">
        <div class="d-flex align-items-center">
          <div class="participant-avatar avatar-group me-3">
            <i class="fas fa-users"></i>
          </div>
          <div>
            <div class="fw-bold">${group.name}</div>
            <small class="text-muted">${group.description}</small>
            <div><small class="text-muted">${group.members.length} members</small></div>
          </div>
        </div>
      </div>
    `).join('');
  },

  selectGroup(groupId) {
    const groupItem = document.querySelector(`[data-group-id="${groupId}"]`);
    const group = AppStore.getGroupById(groupId);
    
    if (!group) {
      return;
    }
    
    // Ensure selectedGroups is initialized
    if (!this.selectedGroups) {
      this.selectedGroups = [];
    }
    
    const isSelected = groupItem && groupItem.classList.contains('selected');
    
    if (isSelected) {
      // Deselect
      if (groupItem) groupItem.classList.remove('selected');
      this.selectedGroups = this.selectedGroups.filter(g => g.id !== groupId);
    } else {
      // Select
      if (groupItem) groupItem.classList.add('selected');
      this.selectedGroups.push({
        id: group.id,
        name: group.name,
        description: group.description,
        type: 'group',
        members: group.members
      });
    }
    
    this.updateSelectedParticipantsDisplay();
  },

  switchToUsersTab() {
    // Reset selection and disable transfer button
    this.clearSelections();
    document.getElementById('transferOwnershipBtn').disabled = true;
  },

  switchToGroupsTab() {
    // Reset selection and disable transfer button
    this.clearSelections();
    document.getElementById('transferOwnershipBtn').disabled = true;
  },

  selectUser(userId) {
    // Clear all selections
    this.clearSelections();
    
    // Mark selected user
    const userItem = document.querySelector(`[data-user-id="${userId}"]`);
    userItem.classList.add('active');
    
    // Enable transfer button
    document.getElementById('transferOwnershipBtn').disabled = false;
    
    // Store selection
    this.selectedAssignee = { 
      id: userId, 
      name: AppStore.getUserById(userId).name,
      type: 'user'
    };
  },

  selectOwnerGroup(groupId) {
    // Clear all selections
    this.clearSelections();
    
    // Mark selected group
    const groupItem = document.querySelector(`[data-group-id="${groupId}"]`);
    groupItem.classList.add('active');
    
    // Enable transfer button
    document.getElementById('transferOwnershipBtn').disabled = false;
    
    // Store selection
    this.selectedAssignee = { 
      id: groupId, 
      name: AppStore.getGroupById(groupId).name,
      type: 'group'
    };
  },

  clearSelections() {
    // Remove active class from all items
    document.querySelectorAll('.user-item, .group-item').forEach(item => {
      item.classList.remove('active');
    });
    this.selectedAssignee = null;
  },

  filterUsers() {
    const searchTerm = document.getElementById('userSearch').value.toLowerCase();
    const filteredUsers = AppStore.allUsers
      .filter(user => user.id !== AppStore.currentUser.id)
      .filter(user => 
        user.name.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm) ||
        user.role.toLowerCase().includes(searchTerm)
      );

    document.getElementById('userList').innerHTML = filteredUsers.map(user => `
      <div class="list-group-item list-group-item-action user-item" data-user-id="${user.id}" onclick="ChatView.selectUser(${user.id})">
        <div class="d-flex align-items-center">
          <div class="participant-avatar ${user.avatarClass} me-3">${user.initials}</div>
          <div>
            <div class="fw-bold">${user.name}</div>
            <small class="text-muted">${user.email}</small>
            <div><small class="text-muted">${user.role}</small></div>
          </div>
        </div>
      </div>
    `).join('');
  },

  confirmOwnershipTransfer() {
    if (!this.selectedAssignee) {
      this.showToast('Please select a user or group to transfer ownership to', 'error');
      return;
    }

    const conversation = AppStore.getConversationById(AppStore.selectedConversationId);
    const confirmMessage = `Are you sure you want to transfer ownership of "${conversation.name}" to ${this.selectedAssignee.name}?`;
    
    this.showConfirmation(
      'Transfer Ownership',
      confirmMessage,
      'fas fa-exchange-alt text-primary',
      () => {
        // Transfer ownership
        AppStore.transferOwnership(AppStore.selectedConversationId, this.selectedAssignee);
        
        // Close modal
        bootstrap.Modal.getInstance(document.getElementById('switchOwnerModal')).hide();
        
        // Re-render to show updated ownership
        App.render();
        
        // Show success message
        this.showToast(`Ownership successfully transferred to ${this.selectedAssignee.name}`, 'success');
      }
    );
  },

  showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer');
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
  },

  showConfirmation(title, message, icon, onConfirm) {
    document.getElementById('confirmationTitle').textContent = title;
    document.getElementById('confirmationMessage').textContent = message;
    document.getElementById('confirmationIcon').className = icon;
    
    const confirmBtn = document.getElementById('confirmationConfirmBtn');
    
    // Remove any existing event listeners
    const newConfirmBtn = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
    
    // Add new event listener
    newConfirmBtn.addEventListener('click', () => {
      bootstrap.Modal.getInstance(document.getElementById('confirmationModal')).hide();
      onConfirm();
    });
    
    new bootstrap.Modal(document.getElementById('confirmationModal')).show();
  },

  getOwnerTooltip(conversation) {
    // Handle group ownership
    if (conversation.ownerType === 'group') {
      return `Owned by ${conversation.ownerName || 'Unknown Group'} (Group)`;
    }

    // Handle individual ownership
    const ownerId = conversation.ownerId;
    
    // If it's the current user
    if (ownerId === AppStore.currentUser.id) {
      return `Owned by ${AppStore.currentUser.name} (You)`;
    }

    // For other users, look up their name
    const owner = AppStore.getUserById(ownerId);
    if (owner) {
      return `Owned by ${owner.name}`;
    }

    // Fallback
    return 'Owner unknown';
  },

  renderPackageList() {
    return AppStore.packages.map(pkg => `
      <div class="list-group-item list-group-item-action package-item" data-package-id="${pkg.id}" onclick="ChatView.selectPackage(${pkg.id})">
        <div class="d-flex align-items-center">
          <div class="package-number ${pkg.type} me-3">
            ${pkg.id}
          </div>
          <div class="flex-grow-1">
            <div class="fw-bold">${pkg.name}</div>
            <div class="text-muted small">
              <span class="status-badge status-${pkg.status.toLowerCase().replace(/\s+/g, '-')}">${pkg.status}</span>
              <span class="ms-2">Owner: ${pkg.owner}</span>
            </div>
            <div class="text-muted small">Created: ${pkg.created}</div>
          </div>
        </div>
      </div>
    `).join('');
  },

  selectPackage(packageId) {
    // Clear all selections
    document.querySelectorAll('.package-item').forEach(item => {
      item.classList.remove('active');
    });
    
    // Mark selected package
    const packageItem = document.querySelector(`[data-package-id="${packageId}"]`);
    if (packageItem) {
      packageItem.classList.add('active');
    }
    
    // Enable attach button
    document.getElementById('attachPackageBtn').disabled = false;
    
    // Store selection
    this.selectedPackage = AppStore.getPackageById(packageId);
  },

  filterPackages() {
    const searchTerm = document.getElementById('packageSearch').value.toLowerCase();
    const filteredPackages = AppStore.packages.filter(pkg => 
      pkg.name.toLowerCase().includes(searchTerm) ||
      pkg.owner.toLowerCase().includes(searchTerm) ||
      pkg.status.toLowerCase().includes(searchTerm)
    );

    document.getElementById('packageList').innerHTML = filteredPackages.map(pkg => `
      <div class="list-group-item list-group-item-action package-item" data-package-id="${pkg.id}" onclick="ChatView.selectPackage(${pkg.id})">
        <div class="d-flex align-items-center">
          <div class="package-number ${pkg.type} me-3">
            ${pkg.id}
          </div>
          <div class="flex-grow-1">
            <div class="fw-bold">${pkg.name}</div>
            <div class="text-muted small">
              <span class="status-badge status-${pkg.status.toLowerCase().replace(/\s+/g, '-')}">${pkg.status}</span>
              <span class="ms-2">Owner: ${pkg.owner}</span>
            </div>
            <div class="text-muted small">Created: ${pkg.created}</div>
          </div>
        </div>
      </div>
    `).join('');
  },

  confirmPackageAttachment() {
    if (!this.selectedPackage) {
      this.showToast('Please select a package to attach', 'error');
      return;
    }

    const conversation = AppStore.getConversationById(AppStore.selectedConversationId);
    const confirmMessage = `Are you sure you want to attach "${conversation.name}" to package "${this.selectedPackage.name}"?`;
    
    this.showConfirmation(
      'Attach to Package',
      confirmMessage,
      'fas fa-paperclip text-primary',
      () => {
        // Attach the package
        AppStore.attachConversationToPackage(AppStore.selectedConversationId, this.selectedPackage.id);
        
        // Close modal
        bootstrap.Modal.getInstance(document.getElementById('attachPackageModal')).hide();
        
        // Re-render to show updated conversation
        App.render();
        
        // Show success message
        this.showToast(`Conversation successfully attached to package "${this.selectedPackage.name}"`, 'success');
      }
    );
  },

  renderInternalUserList() {
    const conversation = AppStore.getConversationById(AppStore.selectedConversationId);
    const existingParticipantIds = conversation.participants.map(p => p.id);
    
    return AppStore.allUsers
      .filter(user => user.id !== AppStore.currentUser.id && !existingParticipantIds.includes(user.id))
      .map(user => `
        <div class="list-group-item list-group-item-action internal-user-item" data-user-id="${user.id}" onclick="ChatView.selectInternalUser(${user.id})">
          <div class="d-flex align-items-center">
            <div class="participant-avatar ${user.avatarClass} me-3">${user.initials}</div>
            <div>
              <div class="fw-bold">${user.name}</div>
              <small class="text-muted">${user.email}</small>
              <div><small class="text-muted">${user.role}</small></div>
            </div>
          </div>
        </div>
      `).join('');
  },

  switchToInternalTab() {
    this.updateSelectedParticipantsDisplay();
  },

  switchToGroupsTab() {
    this.updateSelectedParticipantsDisplay();
  },

  switchToExternalTab() {
    this.updateSelectedParticipantsDisplay();
  },

  selectInternalUser(userId) {
    const userItem = document.querySelector(`[data-user-id="${userId}"]`);
    const user = AppStore.getUserById(userId);
    
    // Ensure selectedInternalUsers is initialized
    if (!this.selectedInternalUsers) {
      this.selectedInternalUsers = [];
    }
    
    if (userItem.classList.contains('selected')) {
      // Deselect
      userItem.classList.remove('selected');
      this.selectedInternalUsers = this.selectedInternalUsers.filter(u => u.id !== userId);
    } else {
      // Select
      userItem.classList.add('selected');
      this.selectedInternalUsers.push({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        type: 'internal',
        initials: user.initials,
        avatarClass: user.avatarClass
      });
    }
    
    this.updateSelectedParticipantsDisplay();
  },

  addExternalParticipant() {
    const name = document.getElementById('externalName').value.trim();
    const email = document.getElementById('externalEmail').value.trim();
    const role = document.getElementById('externalRole').value.trim() || 'External Contact';
    
    if (!name || !email) {
      this.showToast('Please enter both name and email for external contact', 'error');
      return;
    }
    
    // Check if email already exists
    if (this.selectedExternalUsers.some(u => u.email === email)) {
      this.showToast('This email is already added', 'error');
      return;
    }
    
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    const avatarClasses = ['avatar-blue', 'avatar-orange', 'avatar-green', 'avatar-purple'];
    const avatarClass = avatarClasses[Math.floor(Math.random() * avatarClasses.length)];
    
    const externalUser = {
      id: Date.now(), // Temporary ID
      name: name,
      email: email,
      role: role,
      type: 'external',
      initials: initials,
      avatarClass: avatarClass
    };
    
    this.selectedExternalUsers.push(externalUser);
    
    // Clear form
    document.getElementById('externalName').value = '';
    document.getElementById('externalEmail').value = '';
    document.getElementById('externalRole').value = '';
    
    this.updateExternalParticipantsList();
    this.updateSelectedParticipantsDisplay();
  },

  updateExternalParticipantsList() {
    const container = document.getElementById('externalParticipantsList');
    if (this.selectedExternalUsers.length === 0) {
      container.innerHTML = '';
      return;
    }
    
    container.innerHTML = `
      <h6>Added External Contacts:</h6>
      <div class="list-group">
        ${this.selectedExternalUsers.map(user => `
          <div class="list-group-item d-flex align-items-center justify-content-between">
            <div class="d-flex align-items-center">
              <div class="participant-avatar ${user.avatarClass} me-3">${user.initials}</div>
              <div>
                <div class="fw-bold">${user.name}</div>
                <small class="text-muted">${user.email}</small>
                <div><small class="text-muted">${user.role}</small></div>
              </div>
            </div>
            <button class="btn btn-sm btn-outline-danger" onclick="ChatView.removeExternalParticipant(${user.id})">
              <i class="fas fa-times"></i>
            </button>
          </div>
        `).join('')}
      </div>
    `;
  },

  removeExternalParticipant(userId) {
    this.selectedExternalUsers = this.selectedExternalUsers.filter(u => u.id !== userId);
    this.updateExternalParticipantsList();
    this.updateSelectedParticipantsDisplay();
  },

  updateSelectedParticipantsDisplay() {
    // Ensure arrays are initialized
    if (!this.selectedInternalUsers) this.selectedInternalUsers = [];
    if (!this.selectedGroups) this.selectedGroups = [];
    if (!this.selectedExternalUsers) this.selectedExternalUsers = [];
    
    const totalSelected = this.selectedInternalUsers.length + this.selectedGroups.length + this.selectedExternalUsers.length;
    const section = document.getElementById('selectedParticipantsSection');
    const btn = document.getElementById('addParticipantsBtn');
    
    if (totalSelected === 0) {
      if (section) section.style.display = 'none';
      if (btn) btn.disabled = true;
      return;
    }
    
    if (section) section.style.display = 'block';
    if (btn) btn.disabled = false;
    
    const container = document.getElementById('selectedParticipantsList');
    const allSelected = [...this.selectedInternalUsers, ...this.selectedGroups, ...this.selectedExternalUsers];
    
    if (container) {
      container.innerHTML = allSelected.map(item => `
        <span class="badge bg-primary">
          <i class="fas fa-${item.type === 'internal' ? 'user' : item.type === 'group' ? 'users' : 'user-plus'} me-1"></i>
          ${item.name}${item.type === 'group' ? ` (${item.members.length} members)` : ''}
        </span>
      `).join('');
    }
  },

  filterInternalUsers() {
    const searchTerm = document.getElementById('internalSearch').value.toLowerCase();
    const conversation = AppStore.getConversationById(AppStore.selectedConversationId);
    const existingParticipantIds = conversation.participants.map(p => p.id);
    
    const filteredUsers = AppStore.allUsers
      .filter(user => user.id !== AppStore.currentUser.id && !existingParticipantIds.includes(user.id))
      .filter(user => 
        user.name.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm) ||
        user.role.toLowerCase().includes(searchTerm)
      );

    document.getElementById('internalUserList').innerHTML = filteredUsers.map(user => `
      <div class="list-group-item list-group-item-action internal-user-item ${this.selectedInternalUsers.some(u => u.id === user.id) ? 'selected' : ''}" data-user-id="${user.id}" onclick="ChatView.selectInternalUser(${user.id})">
        <div class="d-flex align-items-center">
          <div class="participant-avatar ${user.avatarClass} me-3">${user.initials}</div>
          <div>
            <div class="fw-bold">${user.name}</div>
            <small class="text-muted">${user.email}</small>
            <div><small class="text-muted">${user.role}</small></div>
          </div>
        </div>
      </div>
    `).join('');
  },

  clearParticipantSelections() {
    document.querySelectorAll('.internal-user-item, .group-item').forEach(item => {
      item.classList.remove('selected');
    });
    this.selectedInternalUsers = [];
    this.selectedGroups = [];
    this.selectedExternalUsers = [];
  },

  filterGroups() {
    const searchTerm = document.getElementById('groupSearch').value.toLowerCase();
    const filteredGroups = AppStore.groups.filter(group => 
      group.name.toLowerCase().includes(searchTerm) ||
      group.description.toLowerCase().includes(searchTerm)
    );

    document.getElementById('groupList').innerHTML = filteredGroups.map(group => `
      <div class="list-group-item list-group-item-action group-item ${this.selectedGroups.some(g => g.id === group.id) ? 'selected' : ''}" data-group-id="${group.id}" onclick="ChatView.selectGroup('${group.id}')">
        <div class="d-flex align-items-center">
          <div class="participant-avatar avatar-group me-3">
            <i class="fas fa-users"></i>
          </div>
          <div>
            <div class="fw-bold">${group.name}</div>
            <small class="text-muted">${group.description}</small>
            <div><small class="text-muted">${group.members.length} members</small></div>
          </div>
        </div>
      </div>
    `).join('');
  },

  confirmAddParticipants() {
    const totalSelected = this.selectedInternalUsers.length + this.selectedGroups.length + this.selectedExternalUsers.length;
    if (totalSelected === 0) {
      this.showToast('Please select at least one participant to add', 'error');
      return;
    }

    const conversation = AppStore.getConversationById(AppStore.selectedConversationId);
    const allSelected = [...this.selectedInternalUsers, ...this.selectedGroups, ...this.selectedExternalUsers];
    const participantNames = allSelected.map(p => p.type === 'group' ? `${p.name} (Group)` : p.name).join(', ');
    const confirmMessage = `Are you sure you want to add the following participants to "${conversation.name}"?\n\n${participantNames}`;
    
    this.showConfirmation(
      'Add Participants',
      confirmMessage,
      'fas fa-user-plus text-primary',
      () => {
        // Add participants to conversation
        AppStore.addParticipantsToConversation(AppStore.selectedConversationId, allSelected);
        
        // Close modal
        bootstrap.Modal.getInstance(document.getElementById('addParticipantsModal')).hide();
        
        // Re-render to show updated conversation
        App.render();
        
        // Show success message
        this.showToast(`Successfully added ${totalSelected} participant${totalSelected > 1 ? 's' : ''} to the conversation`, 'success');
      }
    );
  }
};