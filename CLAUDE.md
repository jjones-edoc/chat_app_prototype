# CLAUDE.md

eDOC Chat Platform prototype and specifications - single source of truth for design requirements.

## Key Files
- `chat_app_spec.md` - Complete feature specifications
- `index.html` - Interactive prototype (open in browser)
- `js/store.js` - Data models and sample data
- `styles.css` - UI component patterns

## Critical Rules
- Conversation ownership can be user OR group (not both)
- Package attachment is optional (standalone chats exist)
- External users have limited data access and 90-day link validity
- Archive status affects available actions

## Common Commands
- Open `index.html` in browser for prototype testing
- Navigate using hash routes: `#packages`, `#chat`, `#external`
- Test responsive design on mobile breakpoints
- Review `js/store.js` for data structure requirements

## Integration Points
- **chat_pages**: Authentication flows and session management patterns
- **microservices**: Data structures and real-time messaging requirements
- **eDOCSignatureAdmin**: Package context handoff and user authentication

## Data Model
- Package → Multiple Conversations
- Conversation → Multiple Participants/Messages
- User → Multiple Group Memberships
- 90-day retention policy with archive system