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
    isInternal: true,
    // For prototype: user belongs to all groups
    groupMemberships: ['hr', 'tellers', 'loan_officers']
  },

  // Package data
  packages: [
    {
      id: 1,
      name: "Personal Loan Application - Jeff Johnson",
      status: "Out For eSign",
      created: "05/21/2025",
      modified: "05/21/2025",
      owner: "D.JONES",
      type: "yellow",
      hasChats: true,
      chatCount: 2,
      applicant: "Jeff Johnson"
    },
    {
      id: 2,
      name: "Home Equity Line - Sarah Miller",
      status: "Completed",
      created: "05/21/2025",
      modified: "05/21/2025",
      owner: "D.JONES",
      type: "green",
      hasChats: true,
      chatCount: 1,
      applicant: "Sarah Miller"
    },
    {
      id: 3,
      name: "Auto Loan - Robert Chen",
      status: "Completed",
      created: "05/21/2025",
      modified: "05/21/2025",
      owner: "D.JONES",
      type: "green",
      hasChats: false,
      chatCount: 0,
      applicant: "Robert Chen"
    },
    {
      id: 4,
      name: "Mortgage Refinance - Emily Watson",
      status: "Waiting for Doc",
      created: "04/23/2025",
      modified: "04/24/2025",
      owner: "D.JONES",
      type: "yellow",
      hasChats: true,
      chatCount: 1,
      applicant: "Emily Watson"
    },
    {
      id: 5,
      name: "Business Loan - Michael Davis",
      status: "Ready To Sign",
      created: "04/23/2025",
      modified: "04/23/2025",
      owner: "D.JONES",
      type: "yellow",
      hasChats: false,
      chatCount: 0,
      applicant: "Michael Davis"
    }
  ],

  // Package participants (external contacts are the loan applicants, internal users provide service)
  packageParticipants: {
    1: [ // Jeff Johnson Loan Application
      { id: 1, name: "Jeff Johnson", email: "jeff.johnson@email.com", role: "Loan Applicant", type: "external", securityQuestion: "mothers_maiden_name", securityAnswer: "smith", verificationAttempts: 0, isLinkValid: true },
      { id: 2, name: "Sarah Johnson", email: "sarah.johnson@creditunion.com", role: "Loan Officer", type: "internal" },
      { id: 3, name: "Mike Chen", email: "mike.chen@creditunion.com", role: "Underwriter", type: "internal" }
    ],
    2: [ // Sarah Miller Home Equity
      { id: 4, name: "Sarah Miller", email: "sarah.miller@email.com", role: "Member", type: "external", securityQuestion: "current_phone", securityAnswer: "555-123-4567", verificationAttempts: 0, isLinkValid: true },
      { id: 5, name: "Lisa Rodriguez", email: "lisa.rodriguez@creditunion.com", role: "Loan Officer", type: "internal" }
    ],
    3: [ // Robert Chen Auto Loan
      { id: 7, name: "Robert Chen", email: "robert.chen@email.com", role: "Auto Loan Applicant", type: "external", securityQuestion: "birth_city", securityAnswer: "chicago", verificationAttempts: 0, isLinkValid: true },
      { id: 8, name: "John Smith", email: "john.smith@creditunion.com", role: "Loan Officer", type: "internal" },
      { id: 14, name: "Mary Garcia", email: "mary.garcia@creditunion.com", role: "Auto Loan Specialist", type: "internal" }
    ],
    4: [ // Emily Watson Mortgage Refi
      { id: 9, name: "Emily Watson", email: "emily.watson@email.com", role: "Mortgage Applicant", type: "external", securityQuestion: "first_pet", securityAnswer: "buddy", verificationAttempts: 0, isLinkValid: true },
      { id: 10, name: "Amanda Brown", email: "amanda.brown@creditunion.com", role: "Loan Officer", type: "internal" },
      { id: 15, name: "James Lee", email: "james.lee@creditunion.com", role: "Mortgage Specialist", type: "internal" }
    ],
    5: [ // Michael Davis Business Loan
      { id: 11, name: "Michael Davis", email: "michael.davis@email.com", role: "Business Owner", type: "external", securityQuestion: "high_school", securityAnswer: "lincoln high", verificationAttempts: 0, isLinkValid: true },
      { id: 12, name: "Tom Wilson", email: "tom.wilson@creditunion.com", role: "Business Loan Officer", type: "internal" },
      { id: 13, name: "Rachel Adams", email: "rachel.adams@creditunion.com", role: "Processor", type: "internal" }
    ]
  },

  // Chat conversations
  conversations: [
    {
      id: 101,
      name: "Jeff Johnson - Document Review",
      packageId: 1,
      packageName: "Personal Loan Application - Jeff Johnson",
      participants: [
        { id: 1, name: "Jeff Johnson", type: "external", initials: "JJ", avatarClass: "avatar-blue", securityQuestion: "mothers_maiden_name", securityAnswer: "smith", verificationAttempts: 0, isLinkValid: true },
        { id: 2, name: "Sarah Johnson", type: "internal", initials: "SJ", avatarClass: "avatar-purple" },
        { id: 3, name: "Mike Chen", type: "internal", initials: "MC", avatarClass: "avatar-orange" }
      ],
      lastActivity: "2 hours ago",
      lastMessage: "Thanks Jeff! I've received your W-2 forms",
      lastActivityTimestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      hasNewMessages: true,
      unreadCount: 3,
      ownerId: 100,
      isActive: true
    },
    {
      id: 102,
      name: "Jeff Johnson - Approval Process",
      packageId: 1,
      packageName: "Personal Loan Application - Jeff Johnson",
      participants: [
        { id: 2, name: "Sarah Johnson", type: "internal", initials: "SJ", avatarClass: "avatar-purple" },
        { id: 3, name: "Mike Chen", type: "internal", initials: "MC", avatarClass: "avatar-orange" }
      ],
      lastActivity: "35 days ago",
      lastMessage: "Excellent work team! Jeff's loan is approved",
      lastActivityTimestamp: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000),
      hasNewMessages: false,
      unreadCount: 0,
      ownerId: 100,
      isActive: false
    },
    {
      id: 201,
      name: "Sarah Miller - Home Equity Questions",
      packageId: 2,
      packageName: "Home Equity Line - Sarah Miller",
      participants: [
        { id: 4, name: "Sarah Miller", type: "external", initials: "SM", avatarClass: "avatar-green", securityQuestion: "current_phone", securityAnswer: "555-123-4567", verificationAttempts: 0, isLinkValid: true },
        { id: 5, name: "Lisa Rodriguez", type: "internal", initials: "LR", avatarClass: "avatar-blue" }
      ],
      lastActivity: "30 minutes ago",
      lastMessage: "Next step is the home appraisal - I'll schedule that for you",
      lastActivityTimestamp: new Date(Date.now() - 30 * 60 * 1000),
      hasNewMessages: true,
      unreadCount: 1,
      ownerId: 'loan_officers',
      ownerType: 'group',
      ownerName: 'Loan Officers',
      isActive: true
    },
    {
      id: 401,
      name: "Emily Watson - Refinance Discussion",
      packageId: 4,
      packageName: "Mortgage Refinance - Emily Watson",
      participants: [
        { id: 9, name: "Emily Watson", type: "external", initials: "EW", avatarClass: "avatar-orange", securityQuestion: "first_pet", securityAnswer: "buddy", verificationAttempts: 0, isLinkValid: true },
        { id: 10, name: "Amanda Brown", type: "internal", initials: "AB", avatarClass: "avatar-purple" }
      ],
      lastActivity: "45 days ago",
      lastMessage: "Our premium member program offers even better rates - let me check your eligibility",
      lastActivityTimestamp: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
      hasNewMessages: false,
      unreadCount: 0,
      ownerId: 100,
      isActive: false
    },
    {
      id: 501,
      name: "Robert Chen - General Inquiry",
      packageId: null,
      packageName: null,
      participants: [
        { id: 7, name: "Robert Chen", type: "external", initials: "RC", avatarClass: "avatar-blue", securityQuestion: "birth_city", securityAnswer: "chicago", verificationAttempts: 0, isLinkValid: true },
        { id: 100, name: "David Jones", type: "internal", initials: "DJ", avatarClass: "avatar-green" }
      ],
      lastActivity: "15 minutes ago",
      lastMessage: "Thank you for the information! I'll consider my options.",
      lastActivityTimestamp: new Date(Date.now() - 15 * 60 * 1000),
      hasNewMessages: true,
      unreadCount: 2,
      ownerId: 100,
      isActive: true
    },
    {
      id: 502,
      name: "Maria Gonzalez - Checking Account Inquiry",
      packageId: null,
      packageName: null,
      participants: [
        { id: 16, name: "Maria Gonzalez", type: "external", initials: "MG", avatarClass: "avatar-purple", securityQuestion: "favorite_color", securityAnswer: "blue", verificationAttempts: 0, isLinkValid: true },
        { id: 100, name: "David Jones", type: "internal", initials: "DJ", avatarClass: "avatar-green" }
      ],
      lastActivity: "12 days ago",
      lastMessage: "Thank you for helping me set up online banking.",
      lastActivityTimestamp: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
      hasNewMessages: false,
      unreadCount: 0,
      ownerId: 100,
      isActive: true
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
    ],
    501: [
      {
        id: 1,
        conversationId: 501,
        senderId: 7,
        sender: "Robert Chen",
        senderInitials: "RC",
        avatarClass: "avatar-blue",
        content: "Hi, I'm interested in learning about auto loan options. What rates are currently available?",
        time: "20 minutes ago",
        timestamp: new Date(Date.now() - 20 * 60 * 1000),
        isOwn: false,
        status: "read"
      },
      {
        id: 2,
        conversationId: 501,
        senderId: 100,
        sender: "David Jones",
        senderInitials: "DJ",
        avatarClass: "avatar-green",
        content: "Hi Robert! I'd be happy to help you with auto loan information. Our current rates start at 4.5% for new vehicles and 5.2% for used vehicles, depending on your credit profile and loan term. Are you looking to purchase a new or used vehicle?",
        time: "18 minutes ago",
        timestamp: new Date(Date.now() - 18 * 60 * 1000),
        isOwn: true,
        status: "delivered"
      },
      {
        id: 3,
        conversationId: 501,
        senderId: 7,
        sender: "Robert Chen",
        senderInitials: "RC",
        avatarClass: "avatar-blue",
        content: "I'm looking at a used 2022 Honda Civic. The price is around $22,000. What would my monthly payment be for a 5-year loan?",
        time: "16 minutes ago",
        timestamp: new Date(Date.now() - 16 * 60 * 1000),
        isOwn: false,
        status: "read"
      },
      {
        id: 4,
        conversationId: 501,
        senderId: 100,
        sender: "David Jones",
        senderInitials: "DJ",
        avatarClass: "avatar-green",
        content: "For a $22,000 used vehicle loan at our current 5.2% rate over 60 months, your monthly payment would be approximately $418. This assumes good credit (700+). If you'd like to move forward, I can help you start a formal auto loan application and attach this conversation to your loan package for easy tracking.",
        time: "15 minutes ago",
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        isOwn: true,
        status: "delivered"
      },
      {
        id: 5,
        conversationId: 501,
        senderId: 7,
        sender: "Robert Chen",
        senderInitials: "RC",
        avatarClass: "avatar-blue",
        content: "Thank you for the information! I'll consider my options.",
        time: "15 minutes ago",
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        isOwn: false,
        status: "delivered"
      }
    ],
    502: [
      {
        id: 1,
        conversationId: 502,
        senderId: 16,
        sender: "Maria Gonzalez",
        senderInitials: "MG",
        avatarClass: "avatar-purple",
        content: "Hi, I'm having trouble logging into my online banking account. Can you help me?",
        time: "12 days ago",
        timestamp: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
        isOwn: false,
        status: "read"
      },
      {
        id: 2,
        conversationId: 502,
        senderId: 100,
        sender: "David Jones",
        senderInitials: "DJ",
        avatarClass: "avatar-green",
        content: "I'd be happy to help you with that. Let me reset your password and walk you through the login process.",
        time: "12 days ago",
        timestamp: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000 + 5 * 60 * 1000),
        isOwn: true,
        status: "delivered"
      },
      {
        id: 3,
        conversationId: 502,
        senderId: 16,
        sender: "Maria Gonzalez",
        senderInitials: "MG",
        avatarClass: "avatar-purple",
        content: "Thank you for helping me set up online banking.",
        time: "12 days ago",
        timestamp: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000 + 10 * 60 * 1000),
        isOwn: false,
        status: "delivered"
      }
    ]
  },

  // Groups
  groups: [
    {
      id: 'hr',
      name: 'Human Resources',
      description: 'HR Department',
      members: [
        { id: 201, name: "Jennifer Adams", email: "jennifer.adams@creditunion.com", role: "HR Manager", initials: "JA", avatarClass: "avatar-blue" },
        { id: 202, name: "Mark Thompson", email: "mark.thompson@creditunion.com", role: "HR Specialist", initials: "MT", avatarClass: "avatar-purple" }
      ]
    },
    {
      id: 'tellers',
      name: 'Tellers',
      description: 'Teller Department',
      members: [
        { id: 301, name: "Anna Davis", email: "anna.davis@creditunion.com", role: "Senior Teller", initials: "AD", avatarClass: "avatar-green" },
        { id: 302, name: "Carlos Martinez", email: "carlos.martinez@creditunion.com", role: "Teller", initials: "CM", avatarClass: "avatar-orange" },
        { id: 303, name: "Jessica Kim", email: "jessica.kim@creditunion.com", role: "Teller", initials: "JK", avatarClass: "avatar-blue" }
      ]
    },
    {
      id: 'loan_officers',
      name: 'Loan Officers',
      description: 'Loan Department',
      members: [
        { id: 2, name: "Sarah Johnson", email: "sarah.johnson@creditunion.com", role: "Loan Officer", initials: "SJ", avatarClass: "avatar-purple" },
        { id: 8, name: "John Smith", email: "john.smith@creditunion.com", role: "Loan Officer", initials: "JS", avatarClass: "avatar-green" },
        { id: 10, name: "Amanda Brown", email: "amanda.brown@creditunion.com", role: "Loan Officer", initials: "AB", avatarClass: "avatar-purple" },
        { id: 12, name: "Tom Wilson", email: "tom.wilson@creditunion.com", role: "Business Loan Officer", initials: "TW", avatarClass: "avatar-orange" },
        { id: 100, name: "David Jones", email: "david.jones@creditunion.com", role: "Senior Loan Officer", initials: "DJ", avatarClass: "avatar-green" }
      ]
    }
  ],

  // All users (for individual assignment)
  allUsers: [
    { id: 2, name: "Sarah Johnson", email: "sarah.johnson@creditunion.com", role: "Loan Officer", initials: "SJ", avatarClass: "avatar-purple", groupMemberships: ['loan_officers'] },
    { id: 3, name: "Mike Chen", email: "mike.chen@creditunion.com", role: "Underwriter", initials: "MC", avatarClass: "avatar-orange", groupMemberships: ['loan_officers'] },
    { id: 5, name: "Lisa Rodriguez", email: "lisa.rodriguez@creditunion.com", role: "Loan Officer", initials: "LR", avatarClass: "avatar-blue", groupMemberships: ['loan_officers'] },
    { id: 6, name: "David Park", email: "david.park@creditunion.com", role: "Manager", initials: "DP", avatarClass: "avatar-green", groupMemberships: ['loan_officers'] },
    { id: 8, name: "John Smith", email: "john.smith@creditunion.com", role: "Loan Officer", initials: "JS", avatarClass: "avatar-green", groupMemberships: ['loan_officers'] },
    { id: 10, name: "Amanda Brown", email: "amanda.brown@creditunion.com", role: "Loan Officer", initials: "AB", avatarClass: "avatar-purple", groupMemberships: ['loan_officers'] },
    { id: 12, name: "Tom Wilson", email: "tom.wilson@creditunion.com", role: "Business Loan Officer", initials: "TW", avatarClass: "avatar-orange", groupMemberships: ['loan_officers'] },
    { id: 13, name: "Rachel Adams", email: "rachel.adams@creditunion.com", role: "Processor", initials: "RA", avatarClass: "avatar-blue", groupMemberships: ['loan_officers'] },
    { id: 14, name: "Mary Garcia", email: "mary.garcia@creditunion.com", role: "Auto Loan Specialist", initials: "MG", avatarClass: "avatar-purple", groupMemberships: ['loan_officers'] },
    { id: 15, name: "James Lee", email: "james.lee@creditunion.com", role: "Mortgage Specialist", initials: "JL", avatarClass: "avatar-orange", groupMemberships: ['loan_officers'] },
    { id: 100, name: "David Jones", email: "david.jones@creditunion.com", role: "Senior Loan Officer", initials: "DJ", avatarClass: "avatar-green", groupMemberships: ['hr', 'tellers', 'loan_officers'] },
    { id: 201, name: "Jennifer Adams", email: "jennifer.adams@creditunion.com", role: "HR Manager", initials: "JA", avatarClass: "avatar-blue", groupMemberships: ['hr'] },
    { id: 202, name: "Mark Thompson", email: "mark.thompson@creditunion.com", role: "HR Specialist", initials: "MT", avatarClass: "avatar-purple", groupMemberships: ['hr'] },
    { id: 301, name: "Anna Davis", email: "anna.davis@creditunion.com", role: "Senior Teller", initials: "AD", avatarClass: "avatar-green", groupMemberships: ['tellers'] },
    { id: 302, name: "Carlos Martinez", email: "carlos.martinez@creditunion.com", role: "Teller", initials: "CM", avatarClass: "avatar-orange", groupMemberships: ['tellers'] },
    { id: 303, name: "Jessica Kim", email: "jessica.kim@creditunion.com", role: "Teller", initials: "JK", avatarClass: "avatar-blue", groupMemberships: ['tellers'] }
  ],

  // Auto-archive settings
  autoArchiveAfterDays: 10,
  deleteAfterDays: 90,

  // Currently selected items
  selectedPackageId: null,
  selectedConversationId: 101,
  selectedExternalContactId: null,
  
  // External chat link data
  externalChatLink: null,

  // Helper methods
  sortConversationsByActivity(conversations) {
    return conversations.sort((a, b) => {
      const timeA = a.lastActivityTimestamp || new Date(0);
      const timeB = b.lastActivityTimestamp || new Date(0);
      return timeB - timeA; // Most recent first
    });
  },

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
    
    // Update conversation last message and timestamp
    const conversation = this.getConversationById(conversationId);
    if (conversation) {
      conversation.lastMessage = message.content;
      conversation.lastActivity = "just now";
      conversation.lastActivityTimestamp = new Date();
      
      // Re-sort conversations array to maintain proper order
      this.conversations = this.sortConversationsByActivity(this.conversations);
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
      lastActivityTimestamp: new Date(),
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

      // Add automatic greeting from another participant
      this.addAutomaticGreeting(newConversation.id);
    }
    
    return newConversation;
  },

  addAutomaticGreeting(conversationId) {
    const conversation = this.getConversationById(conversationId);
    if (!conversation) return;

    // Find another participant to send greeting (not the current user)
    const otherParticipant = conversation.participants.find(p => p.id !== this.currentUser.id);
    
    if (otherParticipant) {
      const greetings = [
        "Hi! Welcome to the conversation. I'm here to help with any questions you might have.",
        "Hello! Thanks for starting this conversation. How can I assist you today?",
        "Hi there! I've received your message and I'm ready to help you with this matter.",
        "Welcome! I'm glad we can connect this way. What can I help you with?",
        "Hello! I received your message and I'm here to assist you. What would you like to discuss?",
        "Hi! Thanks for reaching out. I'm available to help answer any questions you have.",
        "Hello and welcome! I'm here to provide support and answer any questions about your request."
      ];

      const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];

      // Add greeting message after a short delay to simulate real response
      setTimeout(() => {
        this.addMessage(conversationId, {
          id: Date.now(),
          conversationId: conversationId,
          senderId: otherParticipant.id,
          sender: otherParticipant.name,
          senderInitials: otherParticipant.initials,
          avatarClass: otherParticipant.avatarClass,
          content: randomGreeting,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          timestamp: new Date(),
          isOwn: false,
          status: "delivered"
        });

        // Update conversation's last message
        conversation.lastMessage = randomGreeting;
        conversation.lastActivity = "just now";

        // Refresh UI if this conversation is currently selected
        if (this.selectedConversationId === conversationId && typeof App !== 'undefined') {
          // Update messages area if it exists
          const messagesArea = document.getElementById('messagesArea');
          if (messagesArea && typeof ChatView !== 'undefined') {
            messagesArea.innerHTML = ChatView.renderMessages(conversationId);
            ChatView.scrollToBottom();
          }
          
          // Update conversations list to show new last message
          const conversationsList = document.getElementById('conversationsList');
          if (conversationsList && typeof ChatView !== 'undefined') {
            conversationsList.innerHTML = ChatView.renderConversationsList();
          }
        }
      }, 1500); // 1.5 second delay to make it feel natural
    }
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
  },

  transferOwnership(conversationId, assignee) {
    const conversation = this.getConversationById(conversationId);
    if (conversation) {
      if (assignee.type === 'group') {
        conversation.ownerId = assignee.id;
        conversation.ownerName = assignee.name;
        conversation.ownerType = 'group';
      } else {
        conversation.ownerId = assignee.id;
        conversation.ownerName = assignee.name;
        conversation.ownerType = 'user';
      }
      
      // Add system message about ownership transfer
      this.addMessage(conversationId, {
        id: Date.now(),
        conversationId: conversationId,
        senderId: 'system',
        sender: 'System',
        senderInitials: 'SYS',
        avatarClass: 'avatar-system',
        content: `Conversation ownership transferred to ${assignee.name}${assignee.type === 'group' ? ' (Group)' : ''}`,
        time: "just now",
        timestamp: new Date(),
        isOwn: false,
        isSystem: true,
        status: "delivered"
      });
    }
  },

  getUserById(id) {
    return this.allUsers.find(u => u.id === id);
  },

  getGroupById(id) {
    return this.groups.find(g => g.id === id);
  },

  canManageConversation(conversationId, userId = null) {
    const user = userId ? this.getUserById(userId) : this.currentUser;
    const conversation = this.getConversationById(conversationId);
    
    if (!conversation || !user) return false;
    
    // User owns the conversation directly
    if (conversation.ownerId === user.id) {
      return true;
    }
    
    // Check if conversation is owned by a group the user belongs to
    if (conversation.ownerType === 'group') {
      const ownerGroup = this.getGroupById(conversation.ownerId);
      if (ownerGroup && user.groupMemberships) {
        return user.groupMemberships.includes(ownerGroup.id);
      }
    }
    
    return false;
  },

  attachConversationToPackage(conversationId, packageId) {
    const conversation = this.getConversationById(conversationId);
    const pkg = this.getPackageById(packageId);
    
    if (conversation && pkg) {
      conversation.packageId = packageId;
      conversation.packageName = pkg.name;
      
      // Add system message about package attachment
      this.addMessage(conversationId, {
        id: Date.now(),
        conversationId: conversationId,
        senderId: 'system',
        sender: 'System',
        senderInitials: 'SYS',
        avatarClass: 'avatar-system',
        content: `Conversation attached to package: ${pkg.name}`,
        time: "just now",
        timestamp: new Date(),
        isOwn: false,
        isSystem: true,
        status: "delivered"
      });
      
      // Update package to indicate it has chats
      pkg.hasChats = true;
      if (pkg.chatCount) {
        pkg.chatCount++;
      } else {
        pkg.chatCount = 1;
      }
      
      return true;
    }
    
    return false;
  },

  addParticipantsToConversation(conversationId, participants) {
    const conversation = this.getConversationById(conversationId);
    
    if (conversation && participants.length > 0) {
      const addedParticipants = [];
      
      // Process each participant
      participants.forEach(participant => {
        if (participant.type === 'group') {
          // Add all members of the group
          participant.members.forEach(member => {
            // Check if member is not already in the conversation
            if (!conversation.participants.some(p => p.email === member.email)) {
              const memberParticipant = {
                id: member.id,
                name: member.name,
                email: member.email,
                role: member.role,
                type: 'internal',
                initials: member.initials,
                avatarClass: member.avatarClass
              };
              conversation.participants.push(memberParticipant);
              addedParticipants.push(memberParticipant);
            }
          });
        } else {
          // Add individual participant (internal or external)
          if (!conversation.participants.some(p => p.email === participant.email)) {
            conversation.participants.push(participant);
            addedParticipants.push(participant);
          }
        }
      });
      
      if (addedParticipants.length > 0) {
        // Create system message about added participants
        const groupNames = participants.filter(p => p.type === 'group').map(p => `${p.name} (Group)`);
        const individualNames = addedParticipants.filter(p => p.type !== 'group').map(p => p.name);
        const allNames = [...groupNames, ...individualNames];
        
        this.addMessage(conversationId, {
          id: Date.now(),
          conversationId: conversationId,
          senderId: 'system',
          sender: 'System',
          senderInitials: 'SYS',
          avatarClass: 'avatar-system',
          content: `${allNames.join(', ')} ${allNames.length > 1 ? 'have' : 'has'} joined the conversation`,
          time: "just now",
          timestamp: new Date(),
          isOwn: false,
          isSystem: true,
          isJoinMessage: true,
          status: "delivered"
        });
      }
      
      return true;
    }
    
    return false;
  },

  // Auto-archive functionality
  checkAndArchiveInactiveConversations() {
    const now = new Date();
    let archivedCount = 0;
    
    this.conversations.forEach(conversation => {
      // Only check active conversations
      if (conversation.isActive !== false) {
        const daysSinceActivity = this.getDaysSinceTimestamp(conversation.lastActivityTimestamp || now);
        
        if (daysSinceActivity >= this.autoArchiveAfterDays) {
          conversation.isActive = false;
          archivedCount++;
          
          // Add system message about auto-archiving
          this.addMessage(conversation.id, {
            id: Date.now() + Math.random(),
            conversationId: conversation.id,
            senderId: 'system',
            sender: 'System',
            senderInitials: 'SYS',
            avatarClass: 'avatar-system',
            content: `Conversation automatically archived after ${daysSinceActivity} days of inactivity`,
            time: "just now",
            timestamp: now,
            isOwn: false,
            isSystem: true,
            status: "delivered"
          });
        }
      }
    });
    
    return archivedCount;
  },

  // Force archive conversations older than 10 days
  archiveOldConversations() {
    const now = new Date();
    let archivedCount = 0;
    
    this.conversations.forEach(conversation => {
      // Only check active conversations
      if (conversation.isActive !== false) {
        const daysSinceActivity = this.getDaysSinceTimestamp(conversation.lastActivityTimestamp || now);
        
        // Archive conversations older than 10 days
        if (daysSinceActivity >= 10) {
          conversation.isActive = false;
          archivedCount++;
          
          // Add system message about archiving
          this.addMessage(conversation.id, {
            id: Date.now() + Math.random(),
            conversationId: conversation.id,
            senderId: 'system',
            sender: 'System',
            senderInitials: 'SYS',
            avatarClass: 'avatar-system',
            content: `Conversation archived after ${daysSinceActivity} days of inactivity`,
            time: "just now",
            timestamp: now,
            isOwn: false,
            isSystem: true,
            status: "delivered"
          });
        }
      }
    });
    
    return archivedCount;
  },

  // Clean up very old conversations (90+ days)
  cleanupOldConversations() {
    const now = new Date();
    let deletedCount = 0;
    
    this.conversations = this.conversations.filter(conversation => {
      if (conversation.isActive === false) {
        const daysSinceActivity = this.getDaysSinceTimestamp(conversation.lastActivityTimestamp || now);
        
        if (daysSinceActivity >= this.deleteAfterDays) {
          // Delete messages for this conversation
          delete this.messages[conversation.id];
          deletedCount++;
          return false; // Remove from conversations array
        }
      }
      return true; // Keep the conversation
    });
    
    return deletedCount;
  },

  getDaysSinceTimestamp(timestamp) {
    const now = new Date();
    const diffTime = Math.abs(now - timestamp);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  },

  // Get archive status for display
  getConversationArchiveInfo(conversation) {
    if (!conversation.lastActivityTimestamp) {
      return null;
    }
    
    const daysSinceActivity = this.getDaysSinceTimestamp(conversation.lastActivityTimestamp);
    
    if (conversation.isActive === false) {
      const daysUntilDeletion = this.deleteAfterDays - daysSinceActivity;
      return {
        status: 'archived',
        daysSinceActivity: daysSinceActivity,
        daysUntilDeletion: Math.max(0, daysUntilDeletion),
        autoArchived: daysSinceActivity >= this.autoArchiveAfterDays
      };
    } else {
      const daysUntilAutoArchive = this.autoArchiveAfterDays - daysSinceActivity;
      return {
        status: 'active',
        daysSinceActivity: daysSinceActivity,
        daysUntilAutoArchive: Math.max(0, daysUntilAutoArchive),
        willAutoArchive: daysUntilAutoArchive <= 0
      };
    }
  },

  deleteConversation(conversationId) {
    // Get conversation before deleting to update package info
    const conversationToDelete = this.getConversationById(conversationId);
    
    // Remove conversation from conversations array
    const conversationIndex = this.conversations.findIndex(c => c.id === conversationId);
    if (conversationIndex !== -1) {
      this.conversations.splice(conversationIndex, 1);
    }
    
    // Delete messages for this conversation
    delete this.messages[conversationId];
    
    // Update package chat count if conversation was attached to a package
    if (conversationToDelete && conversationToDelete.packageId) {
      const pkg = this.getPackageById(conversationToDelete.packageId);
      if (pkg && pkg.chatCount > 0) {
        pkg.chatCount--;
        if (pkg.chatCount === 0) {
          pkg.hasChats = false;
        }
      }
    }
    
    return true;
  }
};