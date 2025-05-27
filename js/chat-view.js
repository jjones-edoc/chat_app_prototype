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
                <div class="date-filter">
                  <i class="fas fa-calendar-alt"></i>
                  <input type="text" id="dateRangePicker" class="form-control" style="display: inline-block; width: auto; background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.3); color: white; cursor: pointer;" readonly />
                </div>
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
              <h5>Conversations</h5>
              <button class="new-chat-btn" onclick="ChatView.createNewChat()">
                <i class="fas fa-plus me-2"></i>New Chat
              </button>
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
          ${activeConversation && activeConversation.packageId ? this.renderPackageSidebar(activeConversation) : ''}
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
    return AppStore.conversations.map(conv => {
      // Determine avatar style based on ownership
      let avatarClass, avatarContent, ownerTooltip;
      
      if (conv.participants.length > 2) {
        // Multi-participant conversation - show owner designation
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
        // Single participant conversation - use participant's avatar
        avatarClass = conv.participants[0].avatarClass;
        avatarContent = conv.participants[0].initials;
        ownerTooltip = conv.participants[0].name;
      }

      return `
        <div class="conversation-item ${conv.id === AppStore.selectedConversationId ? 'active' : ''}" 
             onclick="ChatView.selectConversation(${conv.id})">
          <div class="d-flex align-items-center">
            <div class="conversation-avatar ${avatarClass}" title="${ownerTooltip}">
              ${avatarContent}
            </div>
            <div class="conversation-info">
              <div class="conversation-header">
                <div class="conversation-name">${conv.name}</div>
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
            <button class="chat-menu-btn" onclick="ChatView.toggleChatMenu()">
              <i class="fas fa-ellipsis-v"></i>
            </button>
            <div class="chat-menu" id="chatMenu">
              <div class="chat-menu-item" onclick="ChatView.addToChat()">
                <i class="fas fa-user-plus"></i>Add to Chat
              </div>
              <div class="chat-menu-item" onclick="ChatView.attachToPackage()">
                <i class="fas fa-paperclip"></i>Attach to Package
              </div>
              <div class="chat-menu-item" onclick="ChatView.sendChatLink()">
                <i class="fas fa-link"></i>Send Chat Link
              </div>
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
      <!-- Add User Modal -->
      <div class="modal fade" id="addUserModal" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title"><i class="fas fa-user-plus me-2"></i>Add Users or Groups</h5>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <div class="search-box mb-3">
                <i class="fas fa-search"></i>
                <input type="text" class="form-control ps-5" placeholder="Search users or groups..." />
              </div>
              <div class="list-group">
                <div class="list-group-item list-group-item-action">
                  <div class="d-flex align-items-center">
                    <div class="participant-avatar me-3">JD</div>
                    <div>
                      <div class="fw-bold">John Doe</div>
                      <small class="text-muted">john.doe@creditunion.com</small>
                    </div>
                  </div>
                </div>
                <div class="list-group-item list-group-item-action">
                  <div class="d-flex align-items-center">
                    <div class="participant-avatar me-3">LT</div>
                    <div>
                      <div class="fw-bold">Loan Team</div>
                      <small class="text-muted">Group - 5 members</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="button" class="btn btn-primary">Add Selected</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Send Chat Link Modal -->
      <div class="modal fade" id="sendLinkModal" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title"><i class="fas fa-link me-2"></i>Share Chat Link</h5>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3">
                <label class="form-label">Choose sharing method:</label>
                <div class="d-grid gap-2">
                  <button class="btn btn-outline-primary" onclick="ChatView.shareViaEmail()">
                    <i class="fas fa-envelope me-2"></i>Share via Email
                  </button>
                  <button class="btn btn-outline-primary" onclick="ChatView.shareViaText()">
                    <i class="fas fa-sms me-2"></i>Share via Text Message
                  </button>
                </div>
              </div>
              <div class="alert alert-info">
                <i class="fas fa-info-circle me-2"></i>
                Chat links are valid for 90 days and allow external users to join this conversation.
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Email Share Modal -->
      <div class="modal fade" id="emailShareModal" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title"><i class="fas fa-envelope me-2"></i>Share via Email</h5>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3">
                <label for="emailTo" class="form-label">To:</label>
                <input type="email" class="form-control" id="emailTo" placeholder="Enter email address">
              </div>
              <div class="mb-3">
                <label for="emailMessage" class="form-label">Message:</label>
                <textarea class="form-control" id="emailMessage" rows="4">
Hi,

You've been invited to join a secure chat conversation. Click the link below to access:

[Chat Link]

This link will expire in 90 days.

Best regards,
${AppStore.currentUser.name}
                </textarea>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="button" class="btn btn-primary" onclick="ChatView.sendEmailInvite()">Send Email</button>
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
                    <div class="list-group" id="groupList">
                      ${this.renderGroupList()}
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
    new bootstrap.Modal(document.getElementById('addUserModal')).show();
  },

  attachToPackage() {
    this.toggleChatMenu();
    alert('Attach to package functionality');
  },

  sendChatLink() {
    this.toggleChatMenu();
    new bootstrap.Modal(document.getElementById('sendLinkModal')).show();
  },

  shareViaEmail() {
    bootstrap.Modal.getInstance(document.getElementById('sendLinkModal')).hide();
    setTimeout(() => {
      new bootstrap.Modal(document.getElementById('emailShareModal')).show();
    }, 300);
  },

  shareViaText() {
    bootstrap.Modal.getInstance(document.getElementById('sendLinkModal')).hide();
    const link = AppStore.generateChatLink(AppStore.selectedConversationId);
    this.showToast('Text message interface would open with the chat link', 'info');
  },

  sendEmailInvite() {
    const email = document.getElementById('emailTo').value;
    if (!email) {
      this.showToast('Please enter an email address', 'error');
      return;
    }
    
    const link = AppStore.generateChatLink(AppStore.selectedConversationId);
    this.showToast(`Email sent to ${email} with chat link`, 'success');
    bootstrap.Modal.getInstance(document.getElementById('emailShareModal')).hide();
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
        this.showToast('Chat closed and archived', 'success');
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
    const filtered = AppStore.conversations.filter(conv => 
      conv.name.toLowerCase().includes(searchTerm) ||
      conv.lastMessage.toLowerCase().includes(searchTerm)
    );
    
    document.getElementById('conversationsList').innerHTML = filtered.map(conv => {
      // Determine avatar style based on ownership (same logic as renderConversationsList)
      let avatarClass, avatarContent, ownerTooltip;
      
      if (conv.participants.length > 2) {
        // Multi-participant conversation - show owner designation
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
        // Single participant conversation - use participant's avatar
        avatarClass = conv.participants[0].avatarClass;
        avatarContent = conv.participants[0].initials;
        ownerTooltip = conv.participants[0].name;
      }

      return `
        <div class="conversation-item ${conv.id === AppStore.selectedConversationId ? 'active' : ''}" 
             onclick="ChatView.selectConversation(${conv.id})">
          <div class="d-flex align-items-center">
            <div class="conversation-avatar ${avatarClass}" title="${ownerTooltip}">
              ${avatarContent}
            </div>
            <div class="conversation-info">
              <div class="conversation-header">
                <div class="conversation-name">${conv.name}</div>
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

  init() {
    // Close chat menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.chat-management')) {
        const chatMenu = document.getElementById('chatMenu');
        if (chatMenu) {
          chatMenu.classList.remove('show');
        }
      }
    });

    // Initialize date range picker
    setTimeout(() => {
      const dateRangePicker = document.getElementById('dateRangePicker');
      if (dateRangePicker && typeof $ !== 'undefined' && $.fn.daterangepicker) {
        // Set default to last 7 days
        const start = moment().subtract(6, 'days');
        const end = moment();
        
        $(dateRangePicker).daterangepicker({
          startDate: start,
          endDate: end,
          ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
            'All Time': [moment().subtract(10, 'years'), moment()]
          },
          alwaysShowCalendars: true,
          opens: 'center',
          drops: 'down',
          buttonClasses: 'btn btn-sm',
          applyButtonClasses: 'btn-primary',
          cancelButtonClasses: 'btn-secondary'
        }, function(start, end, label) {
          console.log('Date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD'));
          // Here you can filter messages based on the selected date range
          ChatView.filterMessagesByDateRange(start, end);
        });
        
        // Set initial display text
        $(dateRangePicker).val(start.format('MMM D, YYYY') + ' - ' + end.format('MMM D, YYYY'));
      }
    }, 100);
  },

  filterMessagesByDateRange(startDate, endDate) {
    // This function would filter the displayed messages based on the selected date range
    console.log('Filtering messages from', startDate.format('YYYY-MM-DD'), 'to', endDate.format('YYYY-MM-DD'));
    // Implementation would go here to filter messages in the current conversation
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
      <div class="list-group-item list-group-item-action group-item" data-group-id="${group.id}" onclick="ChatView.selectGroup('${group.id}')">
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

  selectGroup(groupId) {
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
  }
};