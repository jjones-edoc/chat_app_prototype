// External Contact Chat View
const ExternalChatView = {
  isVerified: false,
  
  render() {
    // Simulate external contact accessing via chat link
    const conversation = AppStore.getConversationById(AppStore.selectedConversationId);
    const externalContact = AppStore.selectedExternalContactId ? 
      conversation.participants.find(p => p.type === 'external' && p.id === AppStore.selectedExternalContactId) :
      conversation.participants.find(p => p.type === 'external');
    
    // Check if link is still valid
    if (!externalContact.isLinkValid) {
      return this.renderInvalidLink();
    }
    
    // Show verification screen if not verified
    if (!this.isVerified) {
      return this.renderVerificationScreen(externalContact);
    }
    
    return `
      <div class="external-container">
        <!-- Header -->
        <div class="external-header">
          <h3><i class="fas fa-comments me-2"></i>MyCU Secure Chat</h3>
        </div>

        <!-- Chat Area -->
        <div class="external-chat-main">
          <div class="external-info-banner">
            <p>
              <i class="fas fa-lock me-2"></i>
              You are in a secure chat with ${conversation.participants.filter(p => p.type === 'internal').map(p => p.name).join(', ')}
            </p>
          </div>

          <div class="chat-header-info">
            <div class="chat-title">
              <div>
                <h4>${conversation.name}</h4>
                <div class="chat-participants">
                  <i class="fas fa-users me-1"></i>
                  ${conversation.participants.map(p => p.name).join(', ')}
                </div>
              </div>
            </div>
          </div>

          <div class="messages-area" id="messagesArea" style="flex: 1; overflow-y: auto;">
            ${this.renderMessages(conversation, externalContact)}
          </div>

          <div class="message-input-area">
            <div class="message-input-container">
              <textarea class="message-input" id="messageInput" 
                        placeholder="Type your message..." rows="1"
                        onkeypress="ExternalChatView.handleKeyPress(event)"
                        oninput="ExternalChatView.handleInput()"></textarea>
              <div class="input-actions">
                <button class="input-btn attachment-btn" onclick="ExternalChatView.attachFile()" title="Attach File">
                  <i class="fas fa-paperclip"></i>
                </button>
                <button class="input-btn send-btn" id="sendBtn" onclick="ExternalChatView.sendMessage()" 
                        title="Send Message" disabled>
                  <i class="fas fa-paper-plane"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Link Back Button -->
        <div class="text-center mt-3 mb-3">
          <button class="btn btn-secondary" onclick="App.navigateTo('chat')">
            <i class="fas fa-arrow-left me-2"></i>Back to Internal View
          </button>
        </div>
      </div>
    `;
  },

  renderVerificationScreen(externalContact) {
    const securityQuestions = {
      'mothers_maiden_name': 'What is your mother\'s maiden name?',
      'current_phone': 'What is your current phone number?',
      'birth_city': 'What city were you born in?',
      'first_pet': 'What was the name of your first pet?',
      'high_school': 'What high school did you attend?',
      'favorite_color': 'What is your favorite color?',
      'street_grew_up': 'What street did you grow up on?'
    };

    const questionText = securityQuestions[externalContact.securityQuestion] || 'Security question not found';
    const attemptsRemaining = 3 - externalContact.verificationAttempts;

    return `
      <div class="external-container">
        <!-- Header -->
        <div class="external-header">
          <h3><i class="fas fa-shield-alt me-2"></i>MyCU Secure Chat - Identity Verification</h3>
        </div>

        <!-- Verification Area -->
        <div class="verification-main">
          <div class="verification-card">
            <div class="verification-header">
              <i class="fas fa-user-check fa-3x text-primary mb-3"></i>
              <h4>Identity Verification Required</h4>
              <p class="text-muted">Please answer the security question to access your secure chat.</p>
            </div>

            <div class="verification-form">
              <div class="mb-3">
                <label class="form-label fw-bold">Security Question:</label>
                <div class="security-question-box">
                  ${questionText}
                </div>
              </div>

              <div class="mb-3">
                <label for="securityAnswer" class="form-label">Your Answer:</label>
                <input type="text" class="form-control" id="securityAnswer" 
                       placeholder="Enter your answer" onkeypress="ExternalChatView.handleVerificationKeyPress(event)">
                <div class="form-text">
                  ${attemptsRemaining > 1 ? `${attemptsRemaining} attempts remaining` : 'Last attempt - please be careful'}
                </div>
              </div>

              ${externalContact.verificationAttempts > 0 ? `
                <div class="alert alert-warning">
                  <i class="fas fa-exclamation-triangle me-2"></i>
                  Incorrect answer. Please try again.
                </div>
              ` : ''}

              <button type="button" class="btn btn-primary w-100" onclick="ExternalChatView.verifyIdentity()">
                <i class="fas fa-check me-2"></i>Verify Identity
              </button>
            </div>

            <div class="verification-info mt-4">
              <small class="text-muted">
                <i class="fas fa-info-circle me-1"></i>
                This security question was set up when you were added to this conversation to protect your privacy.
              </small>
            </div>
          </div>
        </div>

        <!-- Link Back Button -->
        <div class="text-center mt-3 mb-3">
          <button class="btn btn-secondary" onclick="App.navigateTo('chat')">
            <i class="fas fa-arrow-left me-2"></i>Back to Internal View
          </button>
        </div>
      </div>
    `;
  },

  renderInvalidLink() {
    return `
      <div class="external-container">
        <!-- Header -->
        <div class="external-header">
          <h3><i class="fas fa-exclamation-triangle me-2"></i>MyCU Secure Chat - Access Denied</h3>
        </div>

        <!-- Error Area -->
        <div class="verification-main">
          <div class="verification-card">
            <div class="verification-header text-center">
              <i class="fas fa-ban fa-3x text-danger mb-3"></i>
              <h4>Chat Access Denied</h4>
              <p class="text-muted">This chat link has been invalidated due to failed verification attempts.</p>
            </div>

            <div class="alert alert-danger">
              <i class="fas fa-shield-alt me-2"></i>
              For your security, access to this conversation has been restricted. Please contact MyCU directly to verify your identity and restore access.
            </div>

            <div class="text-center">
              <button class="btn btn-primary" onclick="window.close()">
                <i class="fas fa-times me-2"></i>Close Window
              </button>
            </div>
          </div>
        </div>

        <!-- Link Back Button -->
        <div class="text-center mt-3 mb-3">
          <button class="btn btn-secondary" onclick="App.navigateTo('chat')">
            <i class="fas fa-arrow-left me-2"></i>Back to Internal View
          </button>
        </div>
      </div>
    `;
  },

  verifyIdentity() {
    const answer = document.getElementById('securityAnswer').value.trim().toLowerCase();
    const conversation = AppStore.getConversationById(AppStore.selectedConversationId);
    const externalContact = AppStore.selectedExternalContactId ? 
      conversation.participants.find(p => p.type === 'external' && p.id === AppStore.selectedExternalContactId) :
      conversation.participants.find(p => p.type === 'external');
    
    if (!answer) {
      this.showToast('Please enter an answer to the security question', 'error');
      return;
    }
    
    // Check if answer matches (case insensitive)
    if (answer === externalContact.securityAnswer) {
      // Correct answer - grant access
      this.isVerified = true;
      App.render();
      this.scrollToBottom();
      this.showToast('Identity verified successfully. Welcome to your secure chat!', 'success');
    } else {
      // Incorrect answer - increment attempts
      externalContact.verificationAttempts++;
      
      if (externalContact.verificationAttempts >= 3) {
        // Max attempts reached - invalidate link
        externalContact.isLinkValid = false;
        
        // Add system message to the chat
        AppStore.addMessage(AppStore.selectedConversationId, {
          id: Date.now(),
          conversationId: AppStore.selectedConversationId,
          senderId: 'system',
          sender: 'System',
          senderInitials: 'SYS',
          avatarClass: 'avatar-system',
          content: `Security verification failed for ${externalContact.name}. Chat link has been invalidated due to multiple incorrect attempts.`,
          time: "just now",
          timestamp: new Date(),
          isOwn: false,
          isSystem: true,
          status: "delivered"
        });
        
        // Re-render to show invalid link screen
        App.render();
      } else {
        // Show error and re-render to update attempt count
        App.render();
      }
    }
  },

  handleVerificationKeyPress(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.verifyIdentity();
    }
  },

  renderMessages(conversation, externalContact) {
    const messages = AppStore.getMessagesForConversation(conversation.id);
    
    if (messages.length === 0) {
      return '<div class="text-center text-muted p-5">No messages yet.</div>';
    }
    
    // Add system notification for new participant
    let html = `
      <div class="join-message">
        <div class="join-message-content">
          ----- ${externalContact.name} has joined the conversation -----
        </div>
      </div>
    `;
    
    html += messages.map(msg => {
      const isOwn = msg.senderId === externalContact.id;
      
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
    
    return html;
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
    
    const conversation = AppStore.getConversationById(AppStore.selectedConversationId);
    const externalContact = conversation.participants.find(p => p.type === 'external');
    
    // Add message as external contact
    const newMessage = {
      id: Date.now(),
      conversationId: AppStore.selectedConversationId,
      senderId: externalContact.id,
      sender: externalContact.name,
      senderInitials: externalContact.initials,
      avatarClass: externalContact.avatarClass,
      content: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: new Date(),
      isOwn: true, // From external contact's perspective
      status: 'sent'
    };
    
    AppStore.addMessage(AppStore.selectedConversationId, newMessage);
    
    // Clear input
    messageInput.value = '';
    messageInput.style.height = 'auto';
    document.getElementById('sendBtn').disabled = true;
    
    // Re-render
    App.render();
    this.scrollToBottom();
    
    // Simulate internal contact response
    setTimeout(() => {
      this.simulateInternalResponse();
    }, 2000);
  },

  simulateInternalResponse() {
    const conversation = AppStore.getConversationById(AppStore.selectedConversationId);
    const internalParticipant = conversation.participants.find(p => p.type === 'internal' && p.id !== AppStore.currentUser.id);
    
    if (internalParticipant) {
      const responses = [
        "Thank you for your message. Let me check that for you.",
        "I understand. Let me help you with that.",
        "Great question! Here's what you need to know...",
        "I'll look into this and get back to you shortly.",
        "Thanks for providing that information."
      ];
      
      const newMessage = {
        id: Date.now(),
        conversationId: AppStore.selectedConversationId,
        senderId: internalParticipant.id,
        sender: internalParticipant.name,
        senderInitials: internalParticipant.initials,
        avatarClass: internalParticipant.avatarClass,
        content: responses[Math.floor(Math.random() * responses.length)],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        timestamp: new Date(),
        isOwn: false,
        status: 'delivered'
      };
      
      AppStore.addMessage(AppStore.selectedConversationId, newMessage);
      
      // Re-render
      App.render();
      this.scrollToBottom();
    }
  },

  attachFile() {
    this.showToast('External contacts can attach files to share documents with the credit union', 'info');
  },

  scrollToBottom() {
    setTimeout(() => {
      const messagesArea = document.getElementById('messagesArea');
      if (messagesArea) {
        messagesArea.scrollTop = messagesArea.scrollHeight;
      }
    }, 100);
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