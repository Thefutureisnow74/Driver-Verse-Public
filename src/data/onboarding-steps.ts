export interface OnboardingSubStep {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  isOptional?: boolean;
  order: number;
  actionUrl?: string;
  actionLabel?: string;
}

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  order: number;
  completionPercentage: number;
  subSteps: OnboardingSubStep[];
  isCompleted: boolean;
}

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: "account-profile-setup",
    title: "Account & Profile Setup",
    description: "Complete your user profile with all personal and professional information.",
    order: 1,
    completionPercentage: 0,
    isCompleted: false,
    subSteps: [
      {
        id: "complete-personal-info",
        title: "Complete personal information",
        description: "Go to User Profile → Complete personal information (name, email, phone)",
        isCompleted: false,
        order: 1,
        actionUrl: "/dashboard/profile",
        actionLabel: "Open User Profile"
      },
      {
        id: "upload-profile-photo",
        title: "Upload professional profile photo",
        description: "Add a clear, professional headshot to your profile",
        isCompleted: false,
        order: 2,
        actionUrl: "/dashboard/profile",
        actionLabel: "Upload Photo"
      },
      {
        id: "add-dot-mc-numbers",
        title: "Add DOT Number and MC Number if applicable",
        description: "Enter your DOT and MC numbers if you have commercial vehicle operations",
        isCompleted: false,
        order: 3,
        isOptional: true,
        actionUrl: "/dashboard/profile",
        actionLabel: "Add DOT/MC Numbers"
      },
      {
        id: "setup-dual-auth",
        title: "Set up dual authentication",
        description: "Set up dual authentication (Replit OAuth + traditional login) for enhanced security",
        isCompleted: false,
        order: 4,
        isOptional: true,
        actionUrl: "/dashboard/profile",
        actionLabel: "Setup Authentication"
      }
    ]
  },
  {
    id: "fleet-vehicle-management",
    title: "My Fleet - Vehicle Management",
    description: "Set up and manage your vehicle information and documentation.",
    order: 2,
    completionPercentage: 0,
    isCompleted: false,
    subSteps: [
      {
        id: "research-vehicle-financing",
        title: "Research vehicle financing options",
        description: "Check Personal Credit → Vehicle Financing section for qualification requirements (680+ credit = better rates)",
        isCompleted: false,
        order: 1,
        isOptional: true,
        actionUrl: "/dashboard/credit",
        actionLabel: "Check Credit"
      },
      {
        id: "research-reliable-vehicles",
        title: "Research reliable gig vehicles",
        description: "Research reliable gig vehicles: Honda Civic, Toyota Corolla, Nissan Sentra (fuel efficiency + reliability). Consider CarMax, Carvana, local dealerships",
        isCompleted: false,
        order: 2,
        isOptional: true,
        actionLabel: "Research Vehicles"
      },
      {
        id: "add-vehicle-details",
        title: "Add vehicle details",
        description: "Go to My Fleet → Add vehicle details (year, make, model, VIN, purchase/lease info)",
        isCompleted: false,
        order: 3,
        actionUrl: "/dashboard/fleet",
        actionLabel: "Open My Fleet"
      },
      {
        id: "upload-vehicle-documents",
        title: "Upload vehicle documents",
        description: "Upload vehicle registration, insurance, and inspection documents",
        isCompleted: false,
        order: 4,
        actionUrl: "/dashboard/fleet",
        actionLabel: "Upload Documents"
      },
      {
        id: "setup-maintenance-schedule",
        title: "Set up maintenance schedule",
        description: "Set up maintenance schedule using the built-in accessory checklist",
        isCompleted: false,
        order: 5,
        actionUrl: "/dashboard/fleet",
        actionLabel: "Setup Maintenance"
      },
      {
        id: "configure-vehicle-alerts",
        title: "Configure vehicle alerts",
        description: "Configure vehicle alerts for insurance renewal, registration, and maintenance",
        isCompleted: false,
        order: 6,
        actionUrl: "/dashboard/fleet",
        actionLabel: "Setup Alerts"
      },
      {
        id: "add-vehicle-photos",
        title: "Add vehicle photos",
        description: "Add vehicle photos (exterior, interior, dashboard, odometer) for insurance/resale documentation",
        isCompleted: false,
        order: 7,
        actionUrl: "/dashboard/fleet",
        actionLabel: "Upload Photos"
      }
    ]
  },
  {
    id: "business-entity-formation",
    title: "Business Entity Formation",
    description: "Establish your business entity and legal structure.",
    order: 3,
    completionPercentage: 0,
    isCompleted: false,
    subSteps: [
      {
        id: "research-business-structure",
        title: "Research business structure",
        description: "Research: LLC (recommended for liability protection) vs Sole Prop (simpler but less protection)",
        isCompleted: false,
        order: 1,
        actionLabel: "Research Options"
      },
      {
        id: "file-with-state",
        title: "File with your state",
        description: "File with your state: use LegalZoom, Nolo, or state website directly (typically $50-300)",
        isCompleted: false,
        order: 2,
        actionLabel: "File Business Entity"
      },
      {
        id: "get-federal-ein",
        title: "Get Federal EIN",
        description: "Get Federal EIN from IRS website (free) - never pay third-party services for this",
        isCompleted: false,
        order: 3,
        actionUrl: "https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online",
        actionLabel: "Get EIN"
      },
      {
        id: "open-business-bank-account",
        title: "Open business bank account",
        description: "Open business bank account: Chase Business, Wells Fargo, or local credit unions",
        isCompleted: false,
        order: 4,
        actionLabel: "Open Bank Account"
      },
      {
        id: "upload-business-documents",
        title: "Upload business documents",
        description: "Go to Business Document Storage → Upload EIN letter, Articles of Incorporation",
        isCompleted: false,
        order: 5,
        actionUrl: "/dashboard/business",
        actionLabel: "Open Business Storage"
      },
      {
        id: "complete-business-plan",
        title: "Complete business plan template",
        description: "Use app's business plan template to complete executive summary and market analysis",
        isCompleted: false,
        order: 6,
        actionUrl: "/dashboard/business",
        actionLabel: "Complete Business Plan"
      },
      {
        id: "setup-business-banking",
        title: "Set up business banking and tax elections",
        description: "Set up business banking info and choose tax elections (S-Corp election can save on self-employment tax)",
        isCompleted: false,
        order: 7,
        actionUrl: "/dashboard/business",
        actionLabel: "Setup Banking & Tax"
      }
    ]
  },
  {
    id: "license-certification-upload",
    title: "License & Certification Upload",
    description: "Upload all required licenses and certifications.",
    order: 4,
    completionPercentage: 0,
    isCompleted: false,
    subSteps: [
      {
        id: "upload-drivers-license",
        title: "Upload driver's license",
        description: "Go to User Profile → License and Certification section. Upload clean driver's license photo and any CDL endorsements",
        isCompleted: false,
        order: 1,
        actionUrl: "/dashboard/profile",
        actionLabel: "Upload License"
      },
      {
        id: "get-medical-transport-certs",
        title: "Get medical transport certifications",
        description: "Medical transport premium: Get HIPAA training (online $20-50), CPR/First Aid certification",
        isCompleted: false,
        order: 2,
        isOptional: true,
        actionLabel: "Get Medical Certs"
      },
      {
        id: "get-high-value-cargo-certs",
        title: "Get high-value cargo certifications",
        description: "High-value cargo: OSHA Bloodborne Pathogens, HazMat certification from local training centers",
        isCompleted: false,
        order: 3,
        isOptional: true,
        actionLabel: "Get HazMat Cert"
      },
      {
        id: "get-biohazard-transport-cert",
        title: "Get BioHazard transport training",
        description: "BioHazard transport: BioHazard Transport Training for medical waste and infectious materials (DOT/EPA compliance)",
        isCompleted: false,
        order: 4,
        isOptional: true,
        actionLabel: "Get BioHazard Cert"
      },
      {
        id: "get-airport-international-cert",
        title: "Get airport/international certifications",
        description: "Airport/international: DOT/IATA Dangerous Goods certification (check local airports for training)",
        isCompleted: false,
        order: 5,
        isOptional: true,
        actionLabel: "Get Airport Cert"
      },
      {
        id: "understand-earning-potential",
        title: "Understand certification earning potential",
        description: "Use app's educational buttons to understand which certifications boost your earning potential",
        isCompleted: false,
        order: 6,
        actionUrl: "/dashboard/profile",
        actionLabel: "Learn Earning Potential"
      },
      {
        id: "add-custom-certifications",
        title: "Add custom certifications",
        description: "Add custom certifications using the two customizable slots for specialized training",
        isCompleted: false,
        order: 7,
        isOptional: true,
        actionUrl: "/dashboard/profile",
        actionLabel: "Add Custom Certs"
      }
    ]
  },
  {
    id: "personal-credit-setup",
    title: "Personal Credit Setup",
    description: "Set up credit monitoring for vehicle financing and business expansion. Essential for fleet growth.",


    
    order: 5,
    completionPercentage: 0,
    isCompleted: false,
    subSteps: [
      {
        id: "get-free-credit-reports",
        title: "Get free credit reports",
        description: "Get free credit reports: AnnualCreditReport.com (official government site)",
        isCompleted: false,
        order: 1,
        actionUrl: "https://www.annualcreditreport.com",
        actionLabel: "Get Credit Reports"
      },
      {
        id: "check-credit-scores",
        title: "Check credit scores",
        description: "Check scores: Credit Karma, Experian app, or your bank's free credit monitoring",
        isCompleted: false,
        order: 2,
        actionLabel: "Check Credit Scores"
      },
      {
        id: "enter-credit-scores",
        title: "Enter current credit scores",
        description: "Go to Personal Credit → Enter current scores from all three bureaus (Equifax, Experian, TransUnion)",
        isCompleted: false,
        order: 3,
        actionUrl: "/dashboard/credit",
        actionLabel: "Open Personal Credit"
      },
      {
        id: "use-financing-calculator",
        title: "Use vehicle financing calculator",
        description: "Use app's vehicle financing calculator to see what you qualify for (680+ credit = better rates)",
        isCompleted: false,
        order: 4,
        actionUrl: "/dashboard/credit",
        actionLabel: "Check Financing"
      },
      {
        id: "set-improvement-goals",
        title: "Set credit improvement goals",
        description: "Set improvement goals: Pay down credit cards below 30% utilization, dispute errors",
        isCompleted: false,
        order: 5,
        actionUrl: "/dashboard/credit",
        actionLabel: "Set Goals"
      },
      {
        id: "setup-credit-monitoring",
        title: "Set up credit monitoring alerts",
        description: "Set up credit monitoring alerts for new accounts, inquiries, and score changes",
        isCompleted: false,
        order: 6,
        actionUrl: "/dashboard/credit",
        actionLabel: "Setup Alerts"
      },
      {
        id: "plan-fleet-expansion",
        title: "Plan for fleet expansion",
        description: "Plan for fleet expansion: Good credit = access to business vehicle loans and leases",
        isCompleted: false,
        order: 7,
        isOptional: true,
        actionUrl: "/dashboard/credit",
        actionLabel: "Plan Expansion"
      }
    ]
  },
  {
    id: "driver-opportunities-research",
    title: "Driver Opportunities Research",
    description: "Research and track gig companies using the comprehensive 449+ company database. Use GigBot AI for personalized recommendations.",
    order: 6,
    completionPercentage: 0,
    isCompleted: false,
    subSteps: [
      {
        id: "browse-company-database",
        title: "Browse 449+ verified companies",
        description: "Go to Driver Opportunities → Browse 449+ verified non-CDL courier companies by service vertical",
        isCompleted: false,
        order: 1,
        actionUrl: "/dashboard/opportunities",
        actionLabel: "Open Driver Opportunities"
      },
      {
        id: "focus-high-demand-verticals",
        title: "Focus on high-demand verticals",
        description: "Start with high-demand verticals: Medical (premium pay), Food Delivery (consistent volume), Package Delivery",
        isCompleted: false,
        order: 2,
        actionUrl: "/dashboard/opportunities",
        actionLabel: "Browse Verticals"
      },
      {
        id: "use-search-filters",
        title: "Use search criteria filters",
        description: "Use search criteria filters: Medical Search, Food Search, Package Search for targeted results",
        isCompleted: false,
        order: 3,
        actionUrl: "/dashboard/opportunities",
        actionLabel: "Use Filters"
      },
      {
        id: "ask-gigbot-ai",
        title: "Ask GigBot AI for recommendations",
        description: "Ask GigBot AI assistant for personalized company recommendations based on your location/vehicle",
        isCompleted: false,
        order: 4,
        actionUrl: "/dashboard/opportunities",
        actionLabel: "Ask GigBot"
      },
      {
        id: "set-company-actions",
        title: "Set company action statuses",
        description: "Set company actions: Research → Apply → Active status (all selections save permanently)",
        isCompleted: false,
        order: 5,
        actionUrl: "/dashboard/opportunities",
        actionLabel: "Set Statuses"
      },
      {
        id: "add-detailed-notes",
        title: "Add detailed company notes",
        description: "Add detailed notes: pay rates, requirements, contact info, application status",
        isCompleted: false,
        order: 6,
        actionUrl: "/dashboard/opportunities",
        actionLabel: "Add Notes"
      },
      {
        id: "set-followup-reminders",
        title: "Set follow-up reminders",
        description: "Set reminders for follow-ups using the app's integrated reminder system",
        isCompleted: false,
        order: 7,
        actionUrl: "/dashboard/reminders",
        actionLabel: "Set Reminders"
      },
      {
        id: "focus-verified-companies",
        title: "Focus on verified companies",
        description: "Focus on companies with verified websites and active hiring status",
        isCompleted: false,
        order: 8,
        actionUrl: "/dashboard/opportunities",
        actionLabel: "Filter Verified"
      }
    ]
  },
  {
    id: "application-management",
    title: "Application Management",
    description: "Track your application lifecycle from submission to hiring.",
    order: 7,
    completionPercentage: 0,
    isCompleted: false,
    subSteps: [
      {
        id: "update-company-status-applied",
        title: "Update company status to Applied",
        description: "Update company status from Research → Applied when submitting",
        isCompleted: false,
        order: 1,
        actionUrl: "/dashboard/opportunities",
        actionLabel: "Update Status"
      },
      {
        id: "schedule-track-interviews",
        title: "Schedule and track interview dates",
        description: "Schedule and track interview dates (auto-saves to notes)",
        isCompleted: false,
        order: 2,
        actionUrl: "/dashboard/opportunities",
        actionLabel: "Schedule Interviews"
      },
      {
        id: "move-status-based-outcomes",
        title: "Move status based on outcomes",
        description: "Move status to Interview → Hired/Rejected based on outcomes",
        isCompleted: false,
        order: 3,
        actionUrl: "/dashboard/opportunities",
        actionLabel: "Update Outcomes"
      },
      {
        id: "log-contact-communications",
        title: "Log all contact communications",
        description: "Log all contact communications and follow-ups",
        isCompleted: false,
        order: 4,
        actionUrl: "/dashboard/opportunities",
        actionLabel: "Log Communications"
      },
      {
        id: "setup-reminder-notifications",
        title: "Set up reminder notifications",
        description: "Set up reminder notifications for important dates",
        isCompleted: false,
        order: 5,
        actionUrl: "/dashboard/reminders",
        actionLabel: "Setup Reminders"
      }
    ]
  },
  {
    id: "platform-signups-onboarding",
    title: "Platform Sign-Ups & Onboarding",
    description: "Start with 3-5 platforms to avoid overwhelm. Track requirements and payouts.",
    order: 8,
    completionPercentage: 0,
    isCompleted: false,
    subSteps: [
      {
        id: "signup-food-grocery-platforms",
        title: "Sign up for Food/Grocery platforms",
        description: "Food/Grocery: DoorDash, Uber Eats, Instacart, Shipt",
        isCompleted: false,
        order: 1,
        actionLabel: "Sign Up Food Platforms"
      },
      {
        id: "signup-parcel-ondemand-platforms",
        title: "Sign up for Parcel/On-Demand platforms",
        description: "Parcel/On-Demand: Amazon Flex, Roadie, Dispatch, Veho",
        isCompleted: false,
        order: 2,
        actionLabel: "Sign Up Parcel Platforms"
      },
      {
        id: "signup-medical-platforms",
        title: "Sign up for Medical platforms",
        description: "Medical: USPack, Dropoff, Medifleet (use medical certifications)",
        isCompleted: false,
        order: 3,
        isOptional: true,
        actionLabel: "Sign Up Medical Platforms"
      },
      {
        id: "signup-construction-parts-platforms",
        title: "Sign up for Construction/Parts platforms",
        description: "Construction/Parts: Curri, GoShare, Frayt",
        isCompleted: false,
        order: 4,
        isOptional: true,
        actionLabel: "Sign Up Construction Platforms"
      },
      {
        id: "complete-background-checks",
        title: "Complete background checks and requirements",
        description: "Complete background checks, MVR, and vehicle photo requirements",
        isCompleted: false,
        order: 5,
        actionLabel: "Complete Background Checks"
      }
    ]
  },
  {
    id: "task-project-management",
    title: "Task & Project Management",
    description: "Use Kanban boards and calendar views to organize your gig work. Seamless integration with reminder system.",
    order: 9,
    completionPercentage: 0,
    isCompleted: false,
    subSteps: [
      {
        id: "create-kanban-boards",
        title: "Create Kanban boards",
        description: "Go to Task Management → Create boards: 'Applications', 'Vehicle Maintenance', 'Business Tasks'",
        isCompleted: false,
        order: 1,
        actionUrl: "/dashboard/tasks",
        actionLabel: "Open Task Management"
      },
      {
        id: "setup-application-cards",
        title: "Set up application cards",
        description: "Set up cards for each company application with deadlines and requirements",
        isCompleted: false,
        order: 2,
        actionUrl: "/dashboard/tasks",
        actionLabel: "Create Application Cards"
      },
      {
        id: "add-vehicle-maintenance-cards",
        title: "Add vehicle maintenance cards",
        description: "Add vehicle maintenance cards: oil changes, registration renewals, insurance updates",
        isCompleted: false,
        order: 3,
        actionUrl: "/dashboard/tasks",
        actionLabel: "Add Maintenance Cards"
      },
      {
        id: "use-calendar-view",
        title: "Use calendar view for scheduling",
        description: "Use calendar view for interview scheduling and deadline visualization",
        isCompleted: false,
        order: 4,
        actionUrl: "/dashboard/tasks",
        actionLabel: "Use Calendar View"
      },
      {
        id: "set-due-dates-reminders",
        title: "Set due dates and reminders",
        description: "Set due dates and reminders (automatically sync with left navigation reminder count)",
        isCompleted: false,
        order: 5,
        actionUrl: "/dashboard/tasks",
        actionLabel: "Set Due Dates"
      },
      {
        id: "track-progress-dragdrop",
        title: "Track progress with drag-and-drop",
        description: "Track progress with drag-and-drop: To Do → In Progress → Completed",
        isCompleted: false,
        order: 6,
        actionUrl: "/dashboard/tasks",
        actionLabel: "Track Progress"
      }
    ]
  },
  {
    id: "driver-gigs-academy",
    title: "Driver Gigs Academy",
    description: "Complete training courses to improve skills and qualifications.",
    order: 10,
    completionPercentage: 0,
    isCompleted: false,
    subSteps: [
      {
        id: "browse-available-courses",
        title: "Browse available courses",
        description: "Go to Academy → Browse available courses and certifications",
        isCompleted: false,
        order: 1,
        actionUrl: "/dashboard/academy",
        actionLabel: "Open Academy"
      },
      {
        id: "complete-safety-compliance-training",
        title: "Complete safety and compliance training",
        description: "Complete safety and compliance training modules",
        isCompleted: false,
        order: 2,
        actionUrl: "/dashboard/academy",
        actionLabel: "Complete Safety Training"
      },
      {
        id: "track-course-progress",
        title: "Track course progress",
        description: "Track course progress and completion certificates",
        isCompleted: false,
        order: 3,
        actionUrl: "/dashboard/academy",
        actionLabel: "Track Progress"
      },
      {
        id: "access-video-text-content",
        title: "Access video and text content",
        description: "Access video and text content for skill development",
        isCompleted: false,
        order: 4,
        actionUrl: "/dashboard/academy",
        actionLabel: "Access Content"
      },
      {
        id: "download-certificates",
        title: "Download completion certificates",
        description: "Download certificates for employment applications",
        isCompleted: false,
        order: 5,
        actionUrl: "/dashboard/academy",
        actionLabel: "Download Certificates"
      }
    ]
  },
  {
    id: "daily-operations-workflow",
    title: "Daily Operations Workflow",
    description: "Establish efficient daily routines and safety protocols.",
    order: 11,
    completionPercentage: 0,
    isCompleted: false,
    subSteps: [
      {
        id: "setup-pretrip-checklist",
        title: "Set up pre-trip checklist",
        description: "Pre-trip checklist: fuel, tires, wipes, towels, flashlight",
        isCompleted: false,
        order: 1,
        actionLabel: "Create Pre-trip Checklist"
      },
      {
        id: "activate-dashcam-safety-kit",
        title: "Activate dashcam and safety kit",
        description: "Dashcam active + safety kit (vest, gloves, emergency contacts)",
        isCompleted: false,
        order: 2,
        actionLabel: "Setup Safety Equipment"
      },
      {
        id: "implement-shift-logging",
        title: "Implement start/end shift logging",
        description: "Start/end shift logging with mileage tracking",
        isCompleted: false,
        order: 3,
        actionLabel: "Setup Shift Logging"
      },
      {
        id: "establish-proof-delivery-protocol",
        title: "Establish proof-of-delivery protocol",
        description: "Proof-of-delivery protocol: geo-photos + video + notes",
        isCompleted: false,
        order: 4,
        actionLabel: "Setup POD Protocol"
      },
      {
        id: "setup-endshift-routine",
        title: "Set up end-shift routine",
        description: "End-shift: upload PODs, reconcile payouts, log issues",
        isCompleted: false,
        order: 5,
        actionLabel: "Create End-shift Routine"
      }
    ]
  },
  {
    id: "professional-networking",
    title: "Professional Networking",
    description: "Build professional relationships and expand your network.",
    order: 13,
    completionPercentage: 0,
    isCompleted: false,
    subSteps: [
      {
        id: "join-networking-groups",
        title: "Join relevant professional groups",
        description: "Go to Networking Groups → Join relevant professional groups",
        isCompleted: false,
        order: 1,
        actionUrl: "/dashboard/network",
        actionLabel: "Join Groups"
      },
      {
        id: "connect-with-professionals",
        title: "Connect with other drivers and industry professionals",
        description: "Connect with other drivers and industry professionals",
        isCompleted: false,
        order: 2,
        actionUrl: "/dashboard/network",
        actionLabel: "Connect with Professionals"
      },
      {
        id: "attend-networking-events",
        title: "Attend networking events",
        description: "Attend virtual and local networking events",
        isCompleted: false,
        order: 3,
        actionLabel: "Attend Events"
      },
      {
        id: "share-experiences-learn",
        title: "Share experiences and learn best practices",
        description: "Share experiences and learn best practices",
        isCompleted: false,
        order: 4,
        actionUrl: "/dashboard/network",
        actionLabel: "Share & Learn"
      },
      {
        id: "build-referral-relationships",
        title: "Build referral relationships",
        description: "Build referral relationships for new opportunities",
        isCompleted: false,
        order: 5,
        actionUrl: "/dashboard/network",
        actionLabel: "Build Referrals"
      }
    ]
  },
  {
    id: "earnings-strategy-analytics",
    title: "Earnings Strategy & Analytics",
    description: "Optimize your earning potential using data-driven insights.",
    order: 14,
    completionPercentage: 0,
    isCompleted: false,
    subSteps: [
      {
        id: "review-dashboard-analytics",
        title: "Review Dashboard analytics",
        description: "Review Dashboard analytics: earnings, completion rates, efficiency",
        isCompleted: false,
        order: 1,
        actionUrl: "/dashboard",
        actionLabel: "Review Analytics"
      },
      {
        id: "map-hot-zones-peak-hours",
        title: "Map hot zones and peak hours",
        description: "Map hot zones and peak hours per platform",
        isCompleted: false,
        order: 2,
        actionUrl: "/dashboard",
        actionLabel: "Map Hot Zones"
      },
      {
        id: "choose-primary-backup-apps",
        title: "Choose primary and backup apps",
        description: "Choose primary app + backup apps for slow periods",
        isCompleted: false,
        order: 3,
        actionLabel: "Choose Apps Strategy"
      },
      {
        id: "track-kpis",
        title: "Track key performance indicators",
        description: "Track KPIs: $/hour, $/mile, idle time percentage",
        isCompleted: false,
        order: 4,
        actionUrl: "/dashboard",
        actionLabel: "Track KPIs"
      },
      {
        id: "conduct-weekly-review",
        title: "Conduct weekly performance review",
        description: "Weekly review: eliminate low-pay routes, scale profitable ones",
        isCompleted: false,
        order: 5,
        actionUrl: "/dashboard",
        actionLabel: "Weekly Review"
      }
    ]
  },
  {
    id: "business-scaling-growth",
    title: "Business Scaling & Growth",
    description: "Expand your operation for increased revenue and sustainability.",
    order: 15,
    completionPercentage: 0,
    isCompleted: false,
    subSteps: [
      {
        id: "choose-specialization-niche",
        title: "Choose specialization niche",
        description: "Choose specialization niche: medical, parts, catering, B2B routes",
        isCompleted: false,
        order: 1,
        actionLabel: "Choose Niche"
      },
      {
        id: "consider-second-vehicle",
        title: "Consider second vehicle acquisition",
        description: "Consider second vehicle acquisition (review credit requirements)",
        isCompleted: false,
        order: 2,
        actionUrl: "/dashboard/credit",
        actionLabel: "Review Credit Requirements"
      },
      {
        id: "setup-subcontractor-agreements",
        title: "Set up subcontractor agreements",
        description: "Set up subcontractor agreements and insurance verification",
        isCompleted: false,
        order: 3,
        actionUrl: "/dashboard/business",
        actionLabel: "Setup Agreements"
      },
      {
        id: "establish-invoicing-systems",
        title: "Establish invoicing systems",
        description: "Establish invoicing systems and payment processing",
        isCompleted: false,
        order: 4,
        actionUrl: "/dashboard/business",
        actionLabel: "Setup Invoicing"
      },
      {
        id: "build-cash-reserves",
        title: "Build cash reserves",
        description: "Build cash reserves for vehicle maintenance and expansion",
        isCompleted: false,
        order: 5,
        actionUrl: "/dashboard/business",
        actionLabel: "Plan Cash Reserves"
      }
    ]
  },
  {
    id: "ongoing-platform-maintenance",
    title: "Ongoing Platform Maintenance",
    description: "Keep your DriverGigsPro account and business running smoothly.",
    order: 16,
    completionPercentage: 0,
    isCompleted: false,
    subSteps: [
      {
        id: "weekly-maintenance-tasks",
        title: "Weekly maintenance tasks",
        description: "Weekly: Review reminders, update company statuses, check analytics",
        isCompleted: false,
        order: 1,
        actionUrl: "/dashboard",
        actionLabel: "Weekly Review"
      },
      {
        id: "monthly-maintenance-tasks",
        title: "Monthly maintenance tasks",
        description: "Monthly: Update vehicle maintenance records and certification renewals",
        isCompleted: false,
        order: 2,
        actionUrl: "/dashboard/fleet",
        actionLabel: "Monthly Update"
      },
      {
        id: "quarterly-maintenance-tasks",
        title: "Quarterly maintenance tasks",
        description: "Quarterly: Review business entity compliance and tax obligations",
        isCompleted: false,
        order: 3,
        actionUrl: "/dashboard/business",
        actionLabel: "Quarterly Review"
      },
      {
        id: "annual-maintenance-tasks",
        title: "Annual maintenance tasks",
        description: "Annually: Assess growth goals, insurance policies, and platform strategy",
        isCompleted: false,
        order: 4,
        actionUrl: "/dashboard",
        actionLabel: "Annual Assessment"
      },
      {
        id: "continuous-maintenance-tasks",
        title: "Continuous maintenance tasks",
        description: "Continuous: Maintain document uploads and profile accuracy",
        isCompleted: false,
        order: 5,
        actionUrl: "/dashboard/profile",
        actionLabel: "Continuous Updates"
      }
    ]
  }
];

// Helper functions
export function calculateStepProgress(subSteps: OnboardingSubStep[]): number {
  if (subSteps.length === 0) return 0;
  const completedSteps = subSteps.filter(step => step.isCompleted).length;
  return Math.round((completedSteps / subSteps.length) * 100);
}

export function calculateOverallProgress(steps: OnboardingStep[]): number {
  if (steps.length === 0) return 0;
  const totalProgress = steps.reduce((sum, step) => sum + step.completionPercentage, 0);
  return Math.round(totalProgress / steps.length);
}

export function getStepById(stepId: string): OnboardingStep | undefined {
  return ONBOARDING_STEPS.find(step => step.id === stepId);
}

export function getNextIncompleteStep(steps: OnboardingStep[]): OnboardingStep | undefined {
  return steps.find(step => !step.isCompleted);
}
