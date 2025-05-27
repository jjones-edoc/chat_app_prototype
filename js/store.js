// Global data store for sharing data between views
const AppStore = {
  // Current user
  currentUser: {
    id: 100,
    name: "David Jones",
    email: "david.jones@creditunion.com",
    role: "Senior Loan Officer",
    initials: "DJ",
    avatarClass: "avatar-green",
    isInternal: true
  },

  // Package data
  packages: [
    {
      id: 1,
      name: "Jeff Johnson Loan Application",
      status: "Out For eSign",
      created: "05/21/2025",
      modified: "05/21/2025",
      owner: "D.JONES",
      type: "yellow",
      hasChats: true,
      chatCount: 2
    },
    {
      id: 2,
      name: "Sarah Miller Home Equity",
      status: "Reference",
      created: "05/21/2025",
      modified: "",
      owner: "D.JONES",
      type: "blue",
      hasChats: true,
      chatCount: 1
    },
    {
      id: 3,
      name: "Robert Chen Auto Loan",
      status: "Reference",
      created: "05/21/2025",
      modified: "",
      owner: "D.JONES",
      type: "black",
      hasChats: false,
      chatCount: 0
    },
    {
      id: 4,
      name: "Emily Watson Mortgage Refi",
      status: "Waiting for Doc",
      created: "04/23/2025",
      modified: "04/24/2025",
      owner: "D.JONES",
      type: "yellow",
      hasChats: true,
      chatCount: 1
    },
    {
      id: 5,
      name: "Michael Davis Business Loan",
      status: "Ready To Sign",
      created: "04/23/2025",
      modified: "04/23/2025",
      owner: "D.JONES",
      type: "yellow",
      hasChats: false,
      chatCount: 0
    }
  ],

  // Package participants
  packageParticipants: {
    1: [ // Jeff Johnson Loan Application
      { id: 1, name: "Jeff Johnson", email: "jeff.johnson@email.com", role: "Member", type: "external" },
      { id: 2, name: "Sarah Johnson", email: "sarah.johnson@creditunion.com", role: "Loan Officer", type: "internal" },
      { id: 3, name: "Mike Chen", email: "mike.chen@creditunion.com", role: "Underwriter", type: "internal" },
      { id: 100, name: "David Jones", email: "david.jones@creditunion.com", role: "Senior Loan Officer", type: "internal" }
    ],
    2: [ // Sarah Miller Home Equity
      { id: 4, name: "Sarah Miller", email: "sarah.miller@email.com", role: "Member", type: "external" },
      { id: 5, name: "Lisa Rodriguez", email: "lisa.rodriguez@creditunion.com", role: "Loan Officer", type: "internal" },
      { id: 6, name: "David Park", email: "david.park@creditunion.com", role: "Manager", type: "internal" },
      { id: 100, name: "David Jones", email: "david.jones@creditunion.com", role: "Senior Loan Officer", type: "internal" }
    ],
    3: [ // Robert Chen Auto Loan
      { id: 7, name: "Robert Chen", email: "robert.chen@email.com", role: "Member", type: "external" },
      { id: 8, name: "John Smith", email: "john.smith@creditunion.com", role: "Loan Officer", type: "internal" },
      { id: 14, name: "Mary Garcia", email: "mary.garcia@creditunion.com", role: "Auto Loan Specialist", type: "internal" },
      { id: 100, name: "David Jones", email: "david.jones@creditunion.com", role: "Senior Loan Officer", type: "internal" }
    ],
    4: [ // Emily Watson Mortgage Refi
      { id: 9, name: "Emily Watson", email: "emily.watson@email.com", role: "Member", type: "external" },
      { id: 10, name: "Amanda Brown", email: "amanda.brown@creditunion.com", role: "Loan Officer", type: "internal" },
      { id: 15, name: "James Lee", email: "james.lee@creditunion.com", role: "Mortgage Specialist", type: "internal" },
      { id: 100, name: "David Jones", email: "david.jones@creditunion.com", role: "Senior Loan Officer", type: "internal" }
    ],
    5: [ // Michael Davis Business Loan
      { id: 11, name: "Michael Davis", email: "michael.davis@email.com", role: "Business Owner", type: "external" },
      { id: 12, name: "Tom Wilson", email: "tom.wilson@creditunion.com", role: "Business Loan Officer", type: "internal" },
      { id: 13, name: "Rachel Adams", email: "rachel.adams@creditunion.com", role: "Processor", type: "internal" },
      { id: 100, name: "David Jones", email: "david.jones@creditunion.com", role: "Senior Loan Officer", type: "internal" }
    ]
  },

  // Chat conversations
  conversations: [
    {
      id: 101,
      name: "Jeff Johnson - Document Review",
      packageId: 1,
      packageName: "Jeff Johnson Loan Application",
      participants: [
        { id: 1, name: "Jeff Johnson", type: "external", initials: "JJ", avatarClass: "avatar-blue" },
        { id: 2, name: "Sarah Johnson", type: "internal", initials: "SJ", avatarClass: "avatar-purple" },
        { id: 3, name: "Mike Chen", type: "internal", initials: "MC", avatarClass: "avatar-orange" }
      ],
      lastActivity: "2 hours ago",
      lastMessage: "Thanks Jeff! I've received your W-2 forms",
      hasNewMessages: true,
      unreadCount: 3,
      ownerId: 100,
      isActive: true
    },
    {
      id: 102,
      name: "Jeff Johnson - Approval Process",
      packageId: 1,
      packageName: "Jeff Johnson Loan Application",
      participants: [
        { id: 2, name: "Sarah Johnson", type: "internal", initials: "SJ", avatarClass: "avatar-purple" },
        { id: 3, name: "Mike Chen", type: "internal", initials: "MC", avatarClass: "avatar-orange" }
      ],
      lastActivity: "1 day ago",
      lastMessage: "Excellent work team! Jeff's loan is approved",
      hasNewMessages: false,
      unreadCount: 0,
      ownerId: 100,
      isActive: false
    },
    {
      id: 201,
      name: "Sarah Miller - Home Equity Questions",
      packageId: 2,
      packageName: "Sarah Miller Home Equity",
      participants: [
        { id: 4, name: "Sarah Miller", type: "external", initials: "SM", avatarClass: "avatar-green" },
        { id: 5, name: "Lisa Rodriguez", type: "internal", initials: "LR", avatarClass: "avatar-blue" }
      ],
      lastActivity: "30 minutes ago",
      lastMessage: "Next step is the home appraisal - I'll schedule that for you",
      hasNewMessages: true,
      unreadCount: 1,
      ownerId: 100,
      isActive: false
    },
    {
      id: 401,
      name: "Emily Watson - Refinance Discussion",
      packageId: 4,
      packageName: "Emily Watson Mortgage Refi",
      participants: [
        { id: 9, name: "Emily Watson", type: "external", initials: "EW", avatarClass: "avatar-orange" },
        { id: 10, name: "Amanda Brown", type: "internal", initials: "AB", avatarClass: "avatar-purple" }
      ],
      lastActivity: "3 days ago",
      lastMessage: "Our premium member program offers even better rates - let me check your eligibility",
      hasNewMessages: false,
      unreadCount: 0,
      ownerId: 100,
      isActive: false
    }
  ],

  // Messages for conversations
  messages: {
    101: [
      {
        id: 1,
        conversationId: 101,
        senderId: 1,
        sender: "Jeff Johnson",
        senderInitials: "JJ",
        avatarClass: "avatar-blue",
        content: "Hi Sarah, I'm ready to submit my loan application. What documents do you need from me?",
        time: "2:30pm",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        isOwn: false,
        status: "read"
      },
      {
        id: 2,
        conversationId: 101,
        senderId: 2,
        sender: "Sarah Johnson",
        senderInitials: "SJ",
        avatarClass: "avatar-purple",
        content: "Hi Jeff! I'll need your last 2 years of W-2 forms and your most recent pay stubs.",
        time: "2:32pm",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 2 * 60 * 1000),
        isOwn: false,
        status: "read"
      },
      {
        id: 3,
        conversationId: 101,
        senderId: 100,
        sender: "David Jones",
        senderInitials: "DJ",
        avatarClass: "avatar-green",
        content: "Thank you Jeff for uploading the W-2 forms. I've reviewed them and they look good. Sarah will now work on getting your employment verification completed, and we'll move forward with the next steps in your application.",
        time: "2:33pm",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 3 * 60 * 1000),
        isOwn: true,
        status: "delivered"
      },
      {
        id: 4,
        conversationId: 101,
        senderId: 3,
        sender: "Mike Chen",
        senderInitials: "MC",
        avatarClass: "avatar-orange",
        content: "I'll also need to verify your employment history for the underwriting process.",
        time: "2:34pm",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 4 * 60 * 1000),
        isOwn: false,
        status: "read"
      },
      {
        id: 5,
        conversationId: 101,
        senderId: 1,
        sender: "Jeff Johnson",
        senderInitials: "JJ",
        avatarClass: "avatar-blue",
        content: "I've uploaded the W-2 forms as requested",
        time: "2:35pm",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 5 * 60 * 1000),
        isOwn: false,
        hasAttachment: true,
        attachment: {
          name: "Jeff_Johnson_W2_2023-2024.pdf",
          size: "324 kB"
        },
        status: "read"
      }
    ],
    102: [
      {
        id: 1,
        conversationId: 102,
        senderId: 2,
        sender: "Sarah Johnson",
        senderInitials: "SJ",
        avatarClass: "avatar-purple",
        content: "Mike, I've reviewed Jeff Johnson's application. His credit score is 750 and debt-to-income ratio looks good at 28%.",
        time: "1 day ago",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        isOwn: false,
        status: "read"
      },
      {
        id: 2,
        conversationId: 102,
        senderId: 3,
        sender: "Mike Chen",
        senderInitials: "MC",
        avatarClass: "avatar-orange",
        content: "Thanks Sarah. I've completed the employment verification - he's been with the same company for 5 years. Income documentation checks out.",
        time: "1 day ago",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000 + 15 * 60 * 1000),
        isOwn: false,
        status: "read"
      },
      {
        id: 3,
        conversationId: 102,
        senderId: 2,
        sender: "Sarah Johnson",
        senderInitials: "SJ",
        avatarClass: "avatar-purple",
        content: "Perfect. The loan amount of $125,000 is well within our guidelines for his income level. Are there any red flags from your underwriting review?",
        time: "1 day ago",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000 + 30 * 60 * 1000),
        isOwn: false,
        status: "read"
      },
      {
        id: 4,
        conversationId: 102,
        senderId: 100,
        sender: "David Jones",
        senderInitials: "DJ",
        avatarClass: "avatar-green",
        content: "Excellent work team. I'm giving my final approval for Jeff Johnson's loan application. Sarah, please proceed with generating the final loan documents at the 5.75% rate. Great job on this one!",
        time: "1 day ago",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000 + 45 * 60 * 1000),
        isOwn: true,
        status: "delivered"
      },
      {
        id: 5,
        conversationId: 102,
        senderId: 3,
        sender: "Mike Chen",
        senderInitials: "MC",
        avatarClass: "avatar-orange",
        content: "No issues at all. Clean payment history, stable employment, adequate reserves. This is a straightforward approval.",
        time: "1 day ago",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000 + 60 * 60 * 1000),
        isOwn: false,
        status: "read"
      },
      {
        id: 6,
        conversationId: 102,
        senderId: 2,
        sender: "Sarah Johnson",
        senderInitials: "SJ",
        avatarClass: "avatar-purple",
        content: "Great! I'll prepare the final approval documentation. We can offer him the preferred rate of 5.75% given his strong profile.",
        time: "1 day ago",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000 + 75 * 60 * 1000),
        isOwn: false,
        status: "read"
      },
      {
        id: 7,
        conversationId: 102,
        senderId: 3,
        sender: "Mike Chen",
        senderInitials: "MC",
        avatarClass: "avatar-orange",
        content: "Ready for final approval",
        time: "1 day ago",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000 + 90 * 60 * 1000),
        isOwn: false,
        status: "read"
      }
    ],
    201: [
      {
        id: 1,
        conversationId: 201,
        senderId: 5,
        sender: "Lisa Rodriguez",
        senderInitials: "LR",
        avatarClass: "avatar-blue",
        content: "Hi Sarah, thanks for your interest in a home equity line of credit. Let me explain the process.",
        time: "35 minutes ago",
        timestamp: new Date(Date.now() - 35 * 60 * 1000),
        isOwn: false,
        status: "read"
      },
      {
        id: 2,
        conversationId: 201,
        senderId: 100,
        sender: "David Jones",
        senderInitials: "DJ",
        avatarClass: "avatar-green",
        content: "Hi Sarah! The next step will be to schedule a property appraisal to determine your home's current value. Lisa will coordinate this with you and provide you with a list of approved appraisers. Once we have the appraisal, we can finalize your credit limit. This typically takes 7-10 business days.",
        time: "30 minutes ago",
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        isOwn: true,
        status: "delivered"
      },
      {
        id: 3,
        conversationId: 201,
        senderId: 4,
        sender: "Sarah Miller",
        senderInitials: "SM",
        avatarClass: "avatar-green",
        content: "What's the next step in the process?",
        time: "25 minutes ago",
        timestamp: new Date(Date.now() - 25 * 60 * 1000),
        isOwn: false,
        status: "delivered"
      }
    ],
    401: [
      {
        id: 1,
        conversationId: 401,
        senderId: 9,
        sender: "Emily Watson",
        senderInitials: "EW",
        avatarClass: "avatar-orange",
        content: "I'm interested in refinancing my mortgage. What are the current rates?",
        time: "3 days ago",
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        isOwn: false,
        status: "read"
      },
      {
        id: 2,
        conversationId: 401,
        senderId: 100,
        sender: "David Jones",
        senderInitials: "DJ",
        avatarClass: "avatar-green",
        content: "Emily, I wanted to add that with your excellent credit history, you may qualify for our premium refinance program which could get you an even better rate of 6.15%. Amanda can walk you through the requirements. We also offer a streamlined process that can close in as little as 21 days.",
        time: "3 days ago",
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 10 * 60 * 1000),
        isOwn: true,
        status: "delivered"
      },
      {
        id: 3,
        conversationId: 401,
        senderId: 10,
        sender: "Amanda Brown",
        senderInitials: "AB",
        avatarClass: "avatar-purple",
        content: "Great question! Our current 30-year fixed rate is 6.25%. I can help you calculate your potential savings.",
        time: "3 days ago",
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000),
        isOwn: false,
        status: "read"
      },
      {
        id: 4,
        conversationId: 401,
        senderId: 9,
        sender: "Emily Watson",
        senderInitials: "EW",
        avatarClass: "avatar-orange",
        content: "Thanks for the rate information",
        time: "3 days ago",
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 45 * 60 * 1000),
        isOwn: false,
        status: "read"
      }
    ]
  },

  // Currently selected items
  selectedPackageId: null,
  selectedConversationId: 101,
  
  // External chat link data
  externalChatLink: null,

  // Helper methods
  getPackageById(id) {
    return this.packages.find(p => p.id === id);
  },

  getConversationById(id) {
    return this.conversations.find(c => c.id === id);
  },

  getConversationsByPackageId(packageId) {
    return this.conversations.filter(c => c.packageId === packageId);
  },

  getMessagesForConversation(conversationId) {
    return this.messages[conversationId] || [];
  },

  addMessage(conversationId, message) {
    if (!this.messages[conversationId]) {
      this.messages[conversationId] = [];
    }
    this.messages[conversationId].push(message);
    
    // Update conversation last message
    const conversation = this.getConversationById(conversationId);
    if (conversation) {
      conversation.lastMessage = message.content;
      conversation.lastActivity = "just now";
    }
  },

  createConversation(data) {
    const newConversation = {
      id: Date.now(),
      name: data.name,
      packageId: data.packageId,
      packageName: data.packageName,
      participants: data.participants,
      lastActivity: "just now",
      lastMessage: data.initialMessage || "Conversation started",
      hasNewMessages: false,
      unreadCount: 0,
      ownerId: this.currentUser.id,
      isActive: true
    };
    
    this.conversations.unshift(newConversation);
    
    // Initialize messages array for new conversation
    this.messages[newConversation.id] = [];
    
    if (data.initialMessage) {
      this.addMessage(newConversation.id, {
        id: 1,
        conversationId: newConversation.id,
        senderId: this.currentUser.id,
        sender: this.currentUser.name,
        senderInitials: this.currentUser.initials,
        avatarClass: this.currentUser.avatarClass,
        content: data.initialMessage,
        time: "just now",
        timestamp: new Date(),
        isOwn: true,
        status: "sent"
      });
    }
    
    return newConversation;
  },

  generateChatLink(conversationId) {
    const link = {
      id: Date.now(),
      conversationId: conversationId,
      token: Math.random().toString(36).substring(2, 15),
      expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
      createdAt: new Date()
    };
    
    this.externalChatLink = link;
    return `${window.location.origin}/chat/${link.token}`;
  }
};