# eDOC Chat Prototype

This is a single-page application prototype that demonstrates the interactions between the eDOC package management system and the chat application as described in the specifications.

## How to Use

1. Open `app.html` in a web browser
2. The application starts on the Package Management view
3. Click on the chat icons next to packages to:
   - View existing conversations (if any)
   - Create new conversations
4. The app simulates transitions between different views using JavaScript

## Features Demonstrated

### Package Management View
- List of packages with status indicators
- Chat icons showing conversation status
- Modal dialogs for creating/joining conversations

### Chat Application View
- Conversation list sidebar
- Message area with real-time messaging simulation
- Package details sidebar
- Owner-only management menu
- Participant management

### External Contact View
- Simplified interface for external contacts
- Simulates member accessing chat via secure link
- Shows system notifications for new participants

## Navigation

- Use browser hash navigation (e.g., `#packages`, `#chat`, `#external`)
- Click buttons and links to navigate between views
- All data is stored in memory and persists during the session

## Technical Implementation

- Single HTML file (`app.html`) as the main container
- Separate JavaScript modules for each view
- Central data store (`store.js`) for sharing data between views
- Bootstrap 5 for UI components
- Font Awesome for icons

## Dummy Data

The prototype includes sample data for:
- 5 packages with different statuses
- Multiple conversations with participants
- Sample messages and attachments
- User profiles and roles

All interactions update the in-memory data store, simulating a real application.