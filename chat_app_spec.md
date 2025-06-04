# eDOC Chat Platform Specifications (Updated based on Meeting 0520)

**Note:** This document has been updated to reflect discussions and decisions from Meeting 0520, including changes to naming conventions, retention policies, security features, and notification systems.

## Contents

- [Introduction](#introduction)
- [Chat Naming Conventions](#chat-naming-conventions)
- [Security & Authentication](#security--authentication)
- [Standalone Chat Application Overview](#standalone-chat-application-overview)
- [Chat Management Menu (Owner-Only Controls)](#chat-management-menu-owner-only-controls)
- [Menu Options for Chats Not Associated with a Package](#menu-options-for-chats-not-associated-with-a-package)
- [Adding Users or Groups to Chat](#adding-users-or-groups-to-chat)
- [Notification of New Participants](#notification-of-new-participants)
- [Message Features](#message-features)
- [Attaching a Chat to a Package](#attaching-a-chat-to-a-package)
- [Sharing Chat Links with External Users(Email)](#sharing-chat-links-with-external-usersemail)
- [Sharing Chat Links with External Users(Text)](#sharing-chat-links-with-external-userstext)
- [Switching Chat Ownership](#switching-chat-ownership)
- [Deleting a Chat](#deleting-a-chat)
- [Closing and Attaching a Chat to the Package](#closing-and-attaching-a-chat-to-the-package)
- [External User View(Chat Link Access)](#external-user-viewchat-link-access)
- [Mobile View for External User (Chat Link Access)](#mobile-view-for-external-user-chat-link-access)
- [Chat Notifications and Access in eDocSignature](#chat-notifications-and-access-in-edocsignature)
- [Notification System](#notification-system)
- [In-Package Chat Access](#in-package-chat-access)
- [Package Integration Technical Details](#package-integration-technical-details)
- [Analytics & Reporting](#analytics--reporting)

## Introduction

The new eDOC Chat solution is designed to streamline collaboration and communication between system users and their members. Whether you're managing internal teams or coordinating with external members, the chat feature ensures that all conversations are easily accessible and linked to specific packages. For internal users, the platform offers chat management options, including the ability to add participants, attach chats to packages, and even transfer chat ownership. External members, invited via secure links, can join conversations effortlessly, while internal chat owners maintain full control over conversation settings.

## Chat Naming Conventions

To ensure clarity and uniqueness of chat conversations, the following naming conventions will be implemented:

- **Standardized Format:** For member-facing chats, a standardized format of "Member Name - Loan Type - Timestamp" will be used.
- **Internal Chats:** Loan officers (and other internal users) can create chats with each other before involving members. Naming for these can be more flexible but should aim for clarity.
- **Default Naming:** If no specific name is provided by the user during creation, the system will default to a basic name (e.g., derived from package name if applicable, or combination of user name and member name).
- **Automatic Titling:** The system will support the use of variables (e.g., loan type, member name) to automatically populate chat titles, allowing for flexibility while promoting standardization.

## Security & Authentication

The eDOC Chat Platform prioritizes security at every level of interaction:

### Authentication Methods

- Partner organizations use existing handoff encryption methods including AES, TripleDES, or OAuth2. Handoffs may include a conversation title and primary key to create a new conversation or enter an existing one.
- Seamless authentication for internal users through organization handoff.
- All web and API interactions secured via HTTPS.

### External Member Security

- **Link-Based Access:** External members access is via secure, unique chat links.
- **Link Validity:** Chat links shared with members will be valid for 90 days. New links can be generated and sent if access is needed beyond this period or if a link needs to be refreshed.
- **Invitation Screen Security (Phase 1):**
  - Basic security measures for invitation screens will be implemented.
  - This may include verification codes sent to the member via email/text or the ability for the credit union staff to set up custom security questions with answers for the member to verify.
  - Verification answers will be stored securely.
- **ID-Pal Verification (future phase):** We may also choose to enable ID-Pal verification in a future phase to help staff users verify members' identities.
- **External Contact Accounts (future phase):** Full account creation for external contacts (with email, password, MFA) will be considered for future phases based on market feedback. Phase 1 will focus on streamlined link-based access.

### Data Protection

- All message content stored with encryption (both in transit and at rest).
- File attachments stored with AES-256 encryption.
- Basic rate limiting in the API to prevent abuse.

### User Roles and Permissions

- The system will feature configurable user roles and permissions to control access to various chat functionalities (e.g., creating chats, managing participants, deleting chats, accessing specific security features).
- Users, Groups, and Permissions will be handled in the existing eDOCSignature system.

### Pre-Chat Member Validation

- A member validation step will be added before they are allowed to enter the chat to help prevent messages from being seen or responded to by unauthorized parties.

## Standalone Chat Application Overview

The standalone chat application serves as a centralized hub for managing all conversations. On the left-hand sidebar, users can view a list of all ongoing conversations, sorted by the most recently received messages. At the top of this sidebar is a search bar for locating conversations by name or keyword. Users can initiate new standalone conversations directly from this main interface; these chats can later be attached to a package if needed. The application will include a screen/flow for creating a new chat.

_[Image: Screenshot showing the interface to create a new conversation. Should include an input area to invite participants, an optional title input box, and the initial message to show in the chat]_

The right-hand sidebar displays detailed information about the package associated with the currently selected conversation (if any). The package name is a clickable hyperlink redirecting to the Manage Packages screen in eDocSignature.

_[Image: Screenshot showing the main chat interface with left sidebar containing conversation list, main chat area, and right sidebar showing package details]_

## Chat Management Menu (Owner-Only Controls)

Within the standalone chat application, chat owners have access to a menu that provides a range of administrative actions for managing the conversation. Only the designated owner or group of the chat will see these options. The available actions include:

- Add to Chat: Owners can invite additional participants—either individual users or entire user groups—into the ongoing conversation.
- Attach to Package: If a conversation was initiated independently and is not yet associated with a document package, the owner can link it to a specific package in eDocSignature.
- Send Chat Link: The owner can generate a secure link (valid for 90 days) to invite a member into the conversation.
- Switch Owner: Responsibility for managing the chat can be reassigned to another internal participant or group.
- Delete Chat: The owner can permanently delete the chat if it is no longer needed. This action removes all associated messages and cannot be undone.
- Close Chat: This option allows the owner to formally close the conversation, preventing further messages while preserving the chat history for reference (typically used for chats attached to packages). If a chat isn't associated with a package it will be archived instead.

_[Image: Screenshot showing the chat management menu with owner-only controls]_

## Adding Users or Groups to Chat

When the chat owner clicks on "Add User", a pop-up window appears displaying a search bar along with a list of available internal users and groups. The owner can use the search functionality to quickly find specific participants, and then select one or more users or groups to add to the conversation.

_[Image: Screenshot showing the "Add Users or Groups" popup interface]_

## Notification of New Participants

When new participants (user or member) are added to a chat, a system notification appears in the conversation informing all participants that new person has joined. This helps maintain transparency and keeps everyone informed about who is participating in the discussion.

_[Image: Screenshot showing a notification of new participants in the chat]_

## Message Features

The eDOC Chat Platform offers a comprehensive set of messaging features designed to enhance communication efficiency:

### Core Messaging Capabilities

- Text-based messaging with rich formatting options
- Message editing and deletion for conversation owners
- Read receipts showing when messages have been viewed
- Typing indicators displaying when participants are composing messages
- Presence indicators (online, away, busy) showing participant availability

### Attachment Support

- Support for file attachments (images and documents)
- Size limits and file type verification for security
- All attachments stored with AES-256 encryption
- Attachments remain accessible when conversations are archived (subject to retention policies).

### Message Retention & Archiving

- **Active Chats:** Messages persist within active conversations.
- **90-Day Retention and Archiving Policy:**
  - Conversations not associated with a package will be automatically moved to a user-accessible "Archive Conversations" section after 90 days of inactivity.
  - Users can access these archived conversations for an additional 90-day period.
  - After this 90-day access period in the archive, these conversations will be permanently purged from the system.
- **Package-Associated Chats:** Conversations associated with a package, when closed by the owner, can be archived to the package itself (see "Package Integration Technical Details"). These archived conversations become part of the permanent package record and are not subject to the 90-day purge from the separate "Archive Conversations" area; their retention is tied to the package's lifecycle.

## Attaching a Chat to a Package

If a chat is not already linked to a document package, the chat owner has the option to associate it with one by selecting an existing package from a list. If they need to create a new package, they will need to do so in the eDocSignature system first.

_[Image: Screenshot showing the interface for attaching a chat to a package]_

## Sharing Chat Links with External Members(Email)

For external contacts, the chat owner can share a secure chat link (valid for 90 days) via email. This allows contacts outside the organization to join the conversation easily. The owner has the flexibility to customize the message content before sending.

_[Image: Screenshot of the email sharing interface for external contacts]_

## Sharing Chat Links with External Members(Text)

Similar to email sharing, chat owners can also send secure chat links (valid for 90 days) via text message to external contacts. This provides an alternative method of invitation for members who may prefer mobile communication.

_[Image: Screenshot of the text message sharing interface for external contacts]_

## Switching Chat Ownership

The owner of the chat has the ability to transfer ownership to any internal user or group who is already part of the conversation. This feature allows for flexible management of chat responsibilities. Once ownership is switched, the new owner gains full control over the chat.

_[Image: Screenshot showing the interface for switching chat ownership]_

## Deleting a Chat

The owner of the chat has the ability to permanently delete the conversation. This action removes all chat history and associated messages. A clear warning message will be displayed before chat deletion to prevent accidental data loss, requiring explicit confirmation from the owner. Users are responsible for their chat history management when using this feature.

_[Image: Screenshot showing the delete chat confirmation dialog]_

## Closing and Attaching a Chat to the Package

The owner of the chat has the option to close the conversation once it is no longer needed for active communication, particularly if it is linked to a package. When a chat linked to a package is closed, the conversation messages and attachments become part of the Package as reference documents.

_[Image: Screenshot showing the interface for closing a chat and attaching it to a package]_

## External Member View(Chat Link Access)

When an external member receives a chat link, they are directed to a secure, simplified chat interface. Since each chat link is unique to a specific conversation, external contacts will only see one chat at a time via a direct link, eliminating the need for a landing page to select between multiple chats. This view is designed for straightforward participation.

_[Image: Screenshot of the external contact view after accessing via chat link]_

## Mobile View for External Members (Chat Link Access)

The mobile view provides a responsive interface for external contacts accessing the chat via smartphones or tablets, ensuring essential chat functions are accessible.

_[Image: Screenshot showing the chat interface on smartphone devices]_

## Chat Notifications and Access in eDOCSignature

When a user logs into eDOCSignature and navigates to the Manage Packages screen, a chat icon next to each relevant package indicates associated chat discussions. A green dot on the icon signals new or unread messages. Clicking the icon redirects to the standalone chat application.

_[Image: Screenshot of eDocSignature interface showing packages with chat notifications]_

## Notification System

The eDOC Chat Platform features a comprehensive notification system:

### Notification Preferences

- Users can customize notification preferences (frequency, delivery method).
- Organization admins can set default notification policies.

### Notification Channels

- Email notifications (e.g., via SendGrid).
- SMS notifications (e.g., via Twilio).
- Webhook notifications for partner applications.

### Smart Notification Consolidation

- Single consolidated notification for offline participants.
- Generic notification for new messages; no further notifications until participant returns online.

## In-Package Chat Access

Users can initiate new chat conversations directly from within a package view. Clicking the chat bubble (bottom-right) opens a pop-up to start a new conversation.

- **Conversation Naming:** The user is prompted for a name, defaulting to the package name (editable). This can follow the "Member Name - Loan Type - Timestamp" convention if applicable.
- **Participant Selection:** A list of signers and participants associated with the package is displayed. The user selects individuals to invite.
- Clicking "Invite Selected for Chat" initiates the conversation and redirects to the standalone chat application.

_[Image: Screenshots showing the process of initiating a chat from within a package]_

## Package Integration Technical Details

The eDOC Chat Platform seamlessly integrates with eDOCSignature packages:

### Package Association

- Conversations can be linked to document packages.
- Multiple conversations can be associated with a single package.
- Conversations can be initiated from within packages or linked later.

### Archival Process

- When a conversation associated with a package is closed, it can be archived to that package.
- Messages archived according to organization preference in either DFC or ZIP (XML + attachments) format.
- Archived conversations become part of the permanent package record, not subject to the 90-day standalone chat purge.

### Access to Archived Conversations

- Archived conversations (attached to packages) accessed through the associated package via eDOCSignature endpoints.
- Archived conversations that aren't attached to a package can be viewed the archive section of the chat interface.

## Analytics & Reporting

The eDOC Chat Platform includes these analytics and event logging features:

### Event Logging

- Log system events (user actions, message events, admin actions, auth events) stored in a secure database for compliance and security auditing.

### Monthly Analytics Reports

- Auto-generated reports for organizations such as active users, message volume, conversation activity, attachment metrics, user engagement.
