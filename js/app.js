// Main Application Controller
const App = {
  currentView: 'packages',

  init() {
    // Set initial view based on URL hash
    const hash = window.location.hash.substr(1);
    if (hash) {
      this.currentView = hash;
    }

    // Handle browser back/forward
    window.addEventListener('popstate', () => {
      const hash = window.location.hash.substr(1);
      this.currentView = hash || 'packages';
      this.render();
    });

    // Initial render
    this.render();
  },

  navigateTo(view) {
    this.currentView = view;
    window.location.hash = view;
    this.render();
  },

  render() {
    const mainContent = document.getElementById('main-content');
    
    switch(this.currentView) {
      case 'packages':
        mainContent.innerHTML = PackagesView.render();
        break;
      case 'chat':
        mainContent.innerHTML = ChatView.render();
        ChatView.init();
        ChatView.scrollToBottom();
        break;
      case 'external':
        mainContent.innerHTML = ExternalChatView.render();
        ExternalChatView.scrollToBottom();
        break;
      default:
        mainContent.innerHTML = PackagesView.render();
    }
  }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});