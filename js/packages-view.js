// Package Management View
const PackagesView = {
  render() {
    return `
      <!-- Header -->
      <div class="header">
        <div class="container-fluid">
          <div class="row align-items-center">
            <div class="col-4">
              <div class="logo">
                <i class="fas fa-feather-alt"></i>
                eDOCSignature
              </div>
            </div>
            <div class="col-4 text-center">
              <h2 class="mb-0">Package Results</h2>
            </div>
            <div class="col-4 text-end">
              <button class="btn btn-link text-white" onclick="App.navigateTo('home')" title="Exit">
                <i class="fas fa-times fa-lg"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="container-fluid">
        <!-- Search Section -->
        <div class="search-section">
          <div class="row align-items-center">
            <div class="col-md-2">
              <input type="text" class="form-control" placeholder="Search Package/Document Name" />
            </div>
            <div class="col-md-2">
              <select class="form-select">
                <option>All</option>
                <option>Out For eSign</option>
                <option>Ready To Sign</option>
                <option>Waiting for Doc</option>
              </select>
            </div>
            <div class="col-md-2">
              <select class="form-select">
                <option>Created</option>
              </select>
            </div>
            <div class="col-md-2">
              <select class="form-select">
                <option>Modified</option>
              </select>
            </div>
            <div class="col-md-2">
              <select class="form-select">
                <option>JONES</option>
              </select>
            </div>
            <div class="col-md-2">
              <button class="btn btn-success w-100">Search</button>
            </div>
          </div>
        </div>

        <!-- Package Table -->
        <div class="package-table">
          <!-- Header Row -->
          <div class="package-row" style="background-color: #f8f9fa; font-weight: bold">
            <div class="row align-items-center">
              <div class="col-md-3">Package/Document Name</div>
              <div class="col-md-2">Status</div>
              <div class="col-md-2">Created</div>
              <div class="col-md-2">Modified</div>
              <div class="col-md-1">Owner</div>
              <div class="col-md-2">Actions</div>
            </div>
          </div>

          <!-- Package Rows -->
          ${AppStore.packages.map(pkg => this.renderPackageRow(pkg)).join('')}
        </div>
      </div>

      <!-- Modals -->
      ${this.renderModals()}
      ${ChatModal.render()}
    `;
  },

  renderPackageRow(pkg) {
    const statusClass = {
      'Out For eSign': 'status-out',
      'Waiting for Doc': 'status-waiting',
      'Ready To Sign': 'status-ready',
      'Reference': 'status-waiting'
    }[pkg.status] || '';

    const packageIcon = pkg.type === 'blue' ? '📁' : pkg.type === 'black' ? '📄' : '2';
    const hasNewMessages = AppStore.getConversationsByPackageId(pkg.id).some(c => c.hasNewMessages);
    const chatCount = pkg.chatCount || 0;

    return `
      <div class="package-row" data-package-id="${pkg.id}">
        <div class="row align-items-center">
          <div class="col-md-3">
            <div class="d-flex align-items-center">
              <div class="package-number ${pkg.type}">${packageIcon}</div>
              <div>
                <div class="fw-bold">${pkg.name}</div>
              </div>
            </div>
          </div>
          <div class="col-md-2">
            <span class="status-badge ${statusClass}">${pkg.status}</span>
          </div>
          <div class="col-md-2">${pkg.created}</div>
          <div class="col-md-2">${pkg.modified}</div>
          <div class="col-md-1">${pkg.owner}</div>
          <div class="col-md-2">
            <div class="action-icons d-inline-flex">
              <div class="action-icon icon-settings"><i class="fas fa-cog"></i></div>
              <div class="action-icon icon-download"><i class="fas fa-download"></i></div>
              <div class="action-icon icon-chat ${chatCount > 0 ? 'has-chats' : 'no-chats'}" 
                   onclick="PackagesView.openChatModal(${pkg.id}, '${pkg.name}')">
                <i class="fas fa-comment"></i>
                ${chatCount > 0 ? `<span class="chat-count">${chatCount}</span>` : ''}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  renderModals() {
    return `
      <!-- Existing Chats Modal -->
      <div class="modal fade" id="existingChatsModal" tabindex="-1">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title"><i class="fas fa-comments me-2"></i>Package Conversations</h5>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3">
                <label class="form-label fw-bold">Package:</label>
                <span id="existingChatsPackageName" class="ms-2"></span>
              </div>

              <div class="mb-4">
                <button type="button" class="btn btn-primary w-100" onclick="PackagesView.createNewFromExisting()">
                  <i class="fas fa-plus me-2"></i>Create New Conversation
                </button>
              </div>

              <hr />

              <div class="mb-3">
                <h6 class="fw-bold">Active Conversations</h6>
                <div class="text-muted small mb-3">Click on any conversation to join</div>
              </div>

              <div id="existingChatsList"></div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>


      <!-- Success Modal -->
      <div class="modal fade" id="successModal" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header bg-success text-white">
              <h5 class="modal-title"><i class="fas fa-check-circle me-2"></i>Conversation Created</h5>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <p>Your conversation has been successfully created!</p>
              <p class="mb-0">You will now be redirected to the chat application.</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-success" onclick="App.navigateTo('chat')">
                <i class="fas fa-arrow-right me-2"></i>Go to Chat
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  },


  openChatModal(packageId, packageName) {
    AppStore.selectedPackageId = packageId;
    const existingChats = AppStore.getConversationsByPackageId(packageId);

    if (existingChats.length > 0) {
      this.showExistingChatsModal(packageId, packageName, existingChats);
    } else {
      this.showCreateChatModal(packageId, packageName);
    }
  },

  showExistingChatsModal(packageId, packageName, chats) {
    document.getElementById('existingChatsPackageName').textContent = packageName;
    
    const chatsList = document.getElementById('existingChatsList');
    chatsList.innerHTML = chats.map(chat => `
      <div class="chat-item" onclick="PackagesView.joinChat(${chat.id})">
        <div class="d-flex align-items-center justify-content-between">
          <div class="flex-grow-1">
            <div class="d-flex align-items-center mb-2">
              <h6 class="mb-0 me-2">${chat.name}</h6>
              ${chat.hasNewMessages ? '<span class="badge bg-success">New</span>' : ''}
            </div>
            <div class="text-muted small mb-1">
              <i class="fas fa-users me-1"></i>
              ${chat.participants.length} participant${chat.participants.length > 1 ? 's' : ''}: 
              ${chat.participants.slice(0, 2).map(p => p.name.split(' ')[0]).join(', ')}
              ${chat.participants.length > 2 ? ` +${chat.participants.length - 2} more` : ''}
            </div>
            <div class="text-muted small">
              <i class="fas fa-clock me-1"></i>
              Last activity: ${chat.lastActivity}
            </div>
            ${chat.lastMessage ? `
              <div class="text-muted small mt-1" style="font-style: italic;">
                "${chat.lastMessage}"
              </div>
            ` : ''}
          </div>
          <div class="text-end">
            <i class="fas fa-chevron-right text-muted"></i>
          </div>
        </div>
      </div>
    `).join('');

    new bootstrap.Modal(document.getElementById('existingChatsModal')).show();
  },

  showCreateChatModal(packageId, packageName) {
    ChatModal.open(packageId);
  },

  createNewFromExisting() {
    bootstrap.Modal.getInstance(document.getElementById('existingChatsModal')).hide();
    setTimeout(() => {
      ChatModal.open(AppStore.selectedPackageId);
    }, 300);
  },

  joinChat(chatId) {
    AppStore.selectedConversationId = chatId;
    bootstrap.Modal.getInstance(document.getElementById('existingChatsModal')).hide();
    
    setTimeout(() => {
      App.navigateTo('chat');
    }, 300);
  },




  redirectToChat() {
    bootstrap.Modal.getInstance(document.getElementById('successModal')).hide();
    setTimeout(() => {
      App.navigateTo('chat');
    }, 300);
  }
};