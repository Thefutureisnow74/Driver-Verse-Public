
import {
    Fuel,
    ExternalLink,
    Truck,
    Search,
    ChevronLeft,
    Car,
    Wrench,
    Building,
    Calculator,
    MapPin,
    FileText,
    Navigation,
    Grid3X3,
    Award,
    Shield,
    Users,
    Heart,
    CreditCard,
    LayoutGrid,
    List,
    ChevronDown,
    Save
} from "lucide-react";

// Financial Institutions Data (1 item)
export const FINANCIAL_INSTITUTIONS = [
    {
        id: "drivers-credit-union",
        name: "Drivers Credit Union",
        type: "Credit Union",
        description: "Specialized financial services for professional drivers and transportation workers",
        website: "https://www.driverscu.org",
        features: ["Driver-specific loans", "Commercial vehicle financing", "Fuel card programs", "Mobile banking"],
        badges: ["Driver Focused", "Nationwide", "Member Owned"],
        color: "violet"
    }
];

// Financial Tools Data (6 items)
export const FINANCIAL_TOOLS = [
    {
        id: "quickbooks",
        name: "QuickBooks Self-Employed",
        type: "Tax & Expense Tracking",
        description: "Track business expenses, mileage, and estimated taxes automatically",
        website: "https://quickbooks.intuit.com/self-employed",
        features: ["Automatic mileage tracking", "Expense categorization", "Quarterly tax estimates", "Receipt capture"],
        badges: ["Popular Choice", "IRS Approved", "Mobile App"],
        color: "blue"
    },
    {
        id: "hurdlr",
        name: "Hurdlr",
        type: "Expense & Mileage Tracking",
        description: "Real-time expense tracking and mileage logging for gig workers",
        website: "https://www.hurdlr.com",
        features: ["Real-time tracking", "Tax deduction maximizer", "Profit/loss reports", "Multiple business tracking"],
        badges: ["Gig Worker Focused", "Real-time", "Multi-business"],
        color: "green"
    },
    {
        id: "stride-tax",
        name: "Stride Tax",
        type: "Tax Preparation",
        description: "Free tax app designed specifically for independent contractors and drivers",
        website: "https://www.stridehealth.com/tax",
        features: ["Free tax filing", "Deduction finder", "Year-round tracking", "Driver-specific deductions"],
        badges: ["Free", "Driver Specific", "Year-round"],
        color: "purple"
    },
    {
        id: "everlance",
        name: "Everlance",
        type: "Mileage & Expense Tracker",
        description: "Automatic mileage and expense tracking with IRS-compliant reporting",
        website: "https://www.everlance.com",
        features: ["Automatic trip detection", "IRS-compliant reports", "Receipt scanning", "Tax deduction calculator"],
        badges: ["IRS Compliant", "Automatic", "Receipt Scanner"],
        color: "orange"
    },
    {
        id: "taxbot",
        name: "TaxBot",
        type: "Business Expense Tracker",
        description: "Smart expense tracking with automated categorization and tax preparation",
        website: "https://www.taxbot.com",
        features: ["Smart categorization", "Receipt management", "Tax preparation", "Business insights"],
        badges: ["Smart AI", "Receipt Manager", "Business Insights"],
        color: "cyan"
    },
    {
        id: "wave-accounting",
        name: "Wave Accounting",
        type: "Accounting Software",
        description: "Free accounting software for small businesses and independent contractors",
        website: "https://www.waveapps.com",
        features: ["Free accounting", "Invoicing", "Payment processing", "Financial reporting"],
        badges: ["Free", "Full Accounting", "Invoicing"],
        color: "teal"
    }
];

// Fuel Cards Data (21 items)
export const FUEL_CARDS = [
    {
        id: "upside",
        name: "Upside",
        type: "Cashback App",
        description: "Get cash back at gas stations, grocery stores, and restaurants",
        website: "https://www.upside.com",
        cashback: "Up to 25¢/gal",
        features: ["No membership fees", "Instant cashback", "Stack with other rewards", "Wide network"],
        badges: ["Popular", "No Fees", "Instant Cashback"],
        color: "green"
    },
    {
        id: "wex-fleet-card",
        name: "WEX Fleet Card",
        type: "Fleet Card",
        description: "Commercial fuel card with detailed reporting and controls",
        website: "https://www.wexinc.com",
        cashback: "Volume discounts",
        features: ["Fuel controls", "Detailed reporting", "Driver management", "24/7 support"],
        badges: ["Commercial", "Fleet Management", "Controls"],
        color: "blue"
    },
    {
        id: "shell-fuel-rewards",
        name: "Shell Fuel Rewards",
        type: "Loyalty Program",
        description: "Earn and redeem fuel rewards at Shell stations nationwide",
        website: "https://www.shell.us/motorists/shell-fuel-rewards",
        cashback: "5¢-20¢/gal savings",
        features: ["No membership fee", "Partner rewards", "Mobile app", "Nationwide network"],
        badges: ["Major Brand", "Partner Rewards", "Mobile App"],
        color: "yellow"
    },
    {
        id: "exxon-mobil-rewards",
        name: "Exxon Mobil Rewards+",
        type: "Loyalty Program",
        description: "Earn points on fuel and convenience store purchases",
        website: "https://www.exxon.com/en/rewards",
        cashback: "3¢/gal in points",
        features: ["Points redemption", "Bonus offers", "Mobile pay", "Convenience rewards"],
        badges: ["Points System", "Mobile Pay", "Convenience"],
        color: "red"
    },
    {
        id: "bp-driver-rewards",
        name: "BPme Rewards",
        type: "Mobile Rewards",
        description: "Mobile app with fuel savings and payment convenience",
        website: "https://www.bp.com/en_us/united-states/home/products-and-services/bp-rewards.html",
        cashback: "5¢/gal savings",
        features: ["Mobile payment", "Skip the line", "Instant rewards", "Pump control"],
        badges: ["Mobile First", "Instant", "Pump Control"],
        color: "green"
    },
    {
        id: "speedway-speedy-rewards",
        name: "Speedy Rewards",
        type: "Loyalty Program",
        description: "Earn points on fuel and store purchases at Speedway locations",
        website: "https://www.speedway.com/speedy-rewards",
        cashback: "Points for rewards",
        features: ["Points system", "Mobile app", "Special offers", "Store rewards"],
        badges: ["Points System", "Store Rewards", "Special Offers"],
        color: "red"
    },
    {
        id: "circle-k-easy-rewards",
        name: "Easy Rewards",
        type: "Loyalty Program",
        description: "Circle K's rewards program for fuel and convenience store savings",
        website: "https://www.circlek.com/easy-rewards",
        cashback: "Points and discounts",
        features: ["Mobile app", "Personalized offers", "Fuel discounts", "Store rewards"],
        badges: ["Personalized", "Mobile App", "Store Rewards"],
        color: "red"
    },
    {
        id: "costco-gas",
        name: "Costco Gas Stations",
        type: "Membership Discount",
        description: "Members-only fuel stations with wholesale pricing",
        website: "https://www.costco.com/gas-stations",
        cashback: "Wholesale pricing",
        features: ["Member pricing", "High quality fuel", "Cashback with Citi card", "Convenient locations"],
        badges: ["Member Only", "Wholesale Price", "High Quality"],
        color: "blue"
    },
    {
        id: "sams-club-gas",
        name: "Sam's Club Fuel Centers",
        type: "Membership Discount",
        description: "Member fuel savings at Sam's Club fuel centers",
        website: "https://www.samsclub.com/content/fuel",
        cashback: "5¢/gal discount",
        features: ["Member discount", "Plus member extra savings", "Quality fuel", "Convenient hours"],
        badges: ["Member Discount", "Plus Benefits", "Quality"],
        color: "blue"
    },
    {
        id: "chevron-techron-advantage",
        name: "Chevron Techron Advantage",
        type: "Credit Card",
        description: "Chevron and Texaco credit card with fuel rewards",
        website: "https://www.chevron.com/cards",
        cashback: "3¢/gal rebate",
        features: ["Fuel rebates", "No annual fee", "Fraud protection", "Online account management"],
        badges: ["Credit Card", "No Annual Fee", "Rebates"],
        color: "blue"
    },
    {
        id: "pilot-flying-j-myrewards",
        name: "myRewards Plus",
        type: "Professional Driver Program",
        description: "Pilot Flying J's professional driver rewards program",
        website: "https://pilotflyingj.com/fuel/myrewards-plus",
        cashback: "Shower credits & discounts",
        features: ["Shower credits", "Food discounts", "Fuel discounts", "Professional driver focused"],
        badges: ["Professional", "Shower Credits", "Trucker Focused"],
        color: "orange"
    },
    {
        id: "loves-travel-stops",
        name: "Love's Fuel Card",
        type: "Travel Center Card",
        description: "Professional driver benefits at Love's Travel Stops",
        website: "https://www.loves.com/en/fuel-cards",
        cashback: "Driver benefits",
        features: ["Professional driver discounts", "Shower programs", "Food discounts", "Wide network"],
        badges: ["Professional", "Travel Centers", "Driver Benefits"],
        color: "red"
    },
    {
        id: "ta-petro-ultraone",
        name: "UltraONE",
        type: "Professional Driver Card",
        description: "TravelCenters of America professional driver rewards",
        website: "https://www.ta-petro.com/ultraone",
        cashback: "Driver rewards",
        features: ["Shower credits", "Food rewards", "Fuel discounts", "Maintenance discounts"],
        badges: ["Professional", "Maintenance", "Shower Credits"],
        color: "blue"
    },
    {
        id: "fleet-one-fuelman",
        name: "Fuelman",
        type: "Fleet Fuel Card",
        description: "Fleet management fuel card with comprehensive controls",
        website: "https://www.fleetone.com",
        cashback: "Fleet discounts",
        features: ["Fleet controls", "Detailed reporting", "Fraud protection", "Driver management"],
        badges: ["Fleet Management", "Controls", "Reporting"],
        color: "gray"
    },
    {
        id: "voyager-fleet-card",
        name: "Voyager Fleet Card",
        type: "Commercial Fleet Card",
        description: "U.S. Bank's fleet fuel card for commercial vehicles",
        website: "https://www.voyagerfleet.com",
        cashback: "Commercial pricing",
        features: ["Commercial pricing", "Expense controls", "Detailed reports", "24/7 support"],
        badges: ["Commercial", "U.S. Bank", "24/7 Support"],
        color: "navy"
    },
    {
        id: "comdata-mastercard",
        name: "Comdata MasterCard",
        type: "Fleet Payment Card",
        description: "Fleet payment solutions with fuel and maintenance coverage",
        website: "https://www.comdata.com",
        cashback: "Fleet savings",
        features: ["Fuel and maintenance", "Expense management", "Driver tools", "Fleet optimization"],
        badges: ["Fleet Solutions", "Maintenance", "Driver Tools"],
        color: "red"
    },
    {
        id: "rts-carrier-services",
        name: "RTS Fuel Card",
        type: "Carrier Services",
        description: "Fuel card designed specifically for trucking companies and drivers",
        website: "https://www.rtscarrier.com",
        cashback: "Carrier discounts",
        features: ["Trucking focused", "Carrier services", "Fuel optimization", "Route planning"],
        badges: ["Trucking Focused", "Carrier Services", "Route Planning"],
        color: "orange"
    },
    {
        id: "multi-service-fuel-card",
        name: "Multi Service Fuel Card",
        type: "Independent Network",
        description: "Independent fuel card network with competitive pricing",
        website: "https://www.multiservicefuelcard.com",
        cashback: "Network discounts",
        features: ["Independent network", "Competitive pricing", "No setup fees", "Quick approval"],
        badges: ["Independent", "No Setup Fees", "Quick Approval"],
        color: "green"
    },
    {
        id: "mudflap",
        name: "Mudflap",
        type: "Mobile Fuel App",
        description: "Mobile app offering instant fuel discounts for truckers",
        website: "https://www.mudflap.com",
        cashback: "10-60¢/gal discount",
        features: ["No fees", "No cards needed", "Instant discounts", "Trucker focused"],
        badges: ["No Fees", "Mobile Only", "Instant", "Trucker App"],
        color: "brown"
    },
    {
        id: "tcs-fuel-card",
        name: "TCS Fuel Card",
        type: "Transportation Card",
        description: "Fuel card services for transportation and logistics companies",
        website: "https://www.tcsfuelcard.com",
        cashback: "Transportation discounts",
        features: ["Transportation focused", "Fleet management", "Expense tracking", "Driver support"],
        badges: ["Transportation", "Fleet Management", "Driver Support"],
        color: "blue"
    },
    {
        id: "gasbuddy-pay",
        name: "GasBuddy Pay",
        type: "Mobile Payment App",
        description: "Mobile payment app with fuel savings and station finder",
        website: "https://www.gasbuddy.com/pay",
        cashback: "Up to 40¢/gal savings",
        features: ["Mobile payment", "Station finder", "Price comparison", "Fuel savings"],
        badges: ["Mobile Payment", "Price Comparison", "Station Finder"],
        color: "purple"
    }
];

// Category definitions (organized alphabetically)
export const DRIVER_CATEGORIES = [
    {
        id: "financial-institutions",
        name: "Financial Institutions",
        icon: CreditCard,
        description: "Banks and credit unions offering driver benefits",
        count: FINANCIAL_INSTITUTIONS.length,
        color: "violet"
    },
    {
        id: "financial-tools",
        name: "Financial Tools",
        icon: Calculator,
        description: "Expense tracking and tax preparation",
        count: FINANCIAL_TOOLS.length,
        color: "purple"
    },
    {
        id: "fuel-cards",
        name: "Fuel Cards",
        icon: Fuel,
        description: "Discover and track fuel card rewards",
        count: FUEL_CARDS.length,
        color: "green"
    },
    {
        id: "job-boards",
        name: "General Job Boards",
        icon: Grid3X3,
        description: "Major employment platforms for W-2 driver positions",
        count: 21,
        color: "blue"
    },
    {
        id: "job-posting-platforms",
        name: "Gig & Delivery Platforms",
        icon: Building,
        description: "Independent contractor and gig work opportunities",
        count: 9,
        color: "cyan"
    },
    {
        id: "insurance-tax",
        name: "Insurance & Tax",
        icon: Shield,
        description: "Insurance providers and tax services",
        count: 7,
        color: "red"
    },
    {
        id: "driver-loadboards",
        name: "Load Boards & Freight",
        icon: Navigation,
        description: "Find loads, freight, and cargo opportunities for your vehicle",
        count: 14,
        color: "blue"
    },
    {
        id: "medical-insurance",
        name: "Medical Insurance and Health Care",
        icon: Heart,
        description: "Healthcare benefits and medical cost sharing memberships",
        count: 2,
        color: "rose"
    },
    {
        id: "online-resources",
        name: "Online Resources",
        icon: Grid3X3,
        description: "Useful websites and online resources for drivers",
        count: 7,
        color: "amber"
    },
    {
        id: "training-associations",
        name: "Training and Trade Associations to Join",
        icon: Users,
        description: "Professional organizations, training programs, and industry associations",
        count: 12,
        color: "teal"
    }
];




//Job Boards
export const JOB_BOARDS = [
    {
        name: "Indeed",
        url: "https://www.indeed.com/jobs?q=delivery+driver",
        description: "World's largest job site with comprehensive delivery opportunities",
        type: "Major Platform",
        category: "general",
        rating: 4.8,
        jobCount: "50,000+",
        location: "Global",
        features: ["🔍 Advanced Search", "📊 Salary Insights", "📝 Company Reviews", "🔔 Job Alerts"]
    },
    {
        name: "ZipRecruiter",
        url: "https://www.ziprecruiter.com/Jobs/Delivery-Driver",
        description: "AI-powered job matching for delivery and logistics positions",
        type: "AI Matching",
        category: "general",
        rating: 4.7,
        jobCount: "40,000+",
        location: "US",
        features: ["🤖 Smart Matching", "⚡ One-Click Apply", "📈 Market Insights", "💰 Salary Range"]
    },
    {
        name: "LinkedIn Jobs",
        url: "https://www.linkedin.com/jobs/search/?keywords=delivery%20driver",
        description: "Professional networking with delivery and logistics opportunities",
        type: "Professional",
        category: "professional",
        rating: 4.6,
        jobCount: "30,000+",
        location: "Global",
        features: ["🤝 Networking", "🏢 Company Insights", "📋 Professional Profiles", "💼 Corporate Jobs"]
    },
    {
        name: "FlexJobs",
        url: "https://www.flexjobs.com/search?search=delivery+driver",
        description: "Flexible and remote-friendly delivery opportunities",
        type: "Flexible",
        category: "flexible",
        rating: 4.3,
        jobCount: "8,000+",
        location: "US",
        features: ["🏠 Remote Options", "⏰ Flexible Schedule", "✅ Vetted Jobs", "🔒 Scam-Free"]
    },
    {
        name: "SimplyHired",
        url: "https://www.simplyhired.com/search?q=delivery+driver",
        description: "Job aggregation platform with comprehensive filtering",
        type: "Aggregator",
        category: "general",
        rating: 4.2,
        jobCount: "35,000+",
        location: "Global",
        features: ["🔍 Job Aggregation", "📊 Salary Estimates", "🌍 Wide Coverage", "🎯 Local Focus"]
    },
    {
        name: "Jooble",
        url: "https://jooble.org/jobs-delivery+driver",
        description: "Global job search engine aggregating opportunities from thousands of websites",
        type: "Aggregator",
        category: "general",
        rating: 4.3,
        jobCount: "25,000+",
        location: "Global",
        features: ["🌍 International Coverage", "🔍 Multi-Source Search", "📱 Mobile Friendly", "🎯 Location-Based Results"]
    },
    {
        name: "Monster",
        url: "https://www.monster.com/jobs/search?q=delivery-driver",
        description: "Career platform with focus on full-time delivery positions",
        type: "Established",
        category: "general",
        rating: 4.1,
        jobCount: "20,000+",
        location: "US",
        features: ["📈 Career Tools", "💼 Full-Time Focus", "🎯 Local Jobs", "📋 Resume Builder"]
    },
    {
        name: "Glassdoor",
        url: "https://www.glassdoor.com/Job/delivery-driver-jobs-SRCH_KO0,15.htm",
        description: "Job platform with company insights and salary transparency",
        type: "Transparent",
        category: "general",
        rating: 4.4,
        jobCount: "25,000+",
        location: "Global",
        features: ["💰 Salary Data", "🏢 Company Reviews", "📊 Market Analysis", "⭐ Employee Ratings"]
    },
    {
        name: "Craigslist",
        url: "https://craigslist.org/search/jjj?query=delivery+driver",
        description: "Local classified ads with direct employer contact",
        type: "Local",
        category: "local",
        rating: 3.8,
        jobCount: "15,000+",
        location: "US",
        features: ["📍 Local Focus", "💰 Direct Contact", "🚛 Independent Contractors", "🏪 Small Businesses"]
    },
    {
        name: "Workwheel",
        url: "https://workwheel.com",
        description: "Local delivery jobs and gig opportunities for drivers",
        type: "Local Gigs",
        category: "local",
        rating: 4.1,
        jobCount: "4,000+",
        location: "US",
        features: ["📍 Local Focus", "🚗 Personal Vehicle", "⚡ Quick Apply", "💼 Part-Time Options"]
    },
    {
        name: "FindRFP.com",
        url: "https://findrfp.com",
        description: "Government contract database for courier services, medical deliveries, and document transport",
        type: "Government Contracts",
        category: "specialized",
        rating: 4.4,
        jobCount: "1,000+",
        location: "US & Canada",
        features: ["🏛️ Government Contracts", "📋 RFP Database", "💰 Higher Pay Rates", "📊 Contract Alerts", "🔐 Security Clearance Jobs"]
    },
    {
        name: "Dice",
        url: "https://www.dice.com/jobs?q=delivery+driver&q=courier&q=logistics",
        description: "Tech-focused job platform with technology and logistics opportunities",
        type: "Tech Platform",
        category: "general",
        rating: 4.3,
        jobCount: "5,000+",
        location: "US",
        features: ["💻 Tech Focus", "📈 Career Tools", "💰 Salary Data", "🎯 Skills Matching"]
    },
    {
        name: "CareerBuilder",
        url: "https://www.careerbuilder.com/jobs?keywords=delivery+driver",
        description: "Established career platform with comprehensive delivery job listings",
        type: "Career Platform",
        category: "general",
        rating: 4.2,
        jobCount: "25,000+",
        location: "US",
        features: ["📊 Career Resources", "💼 Full-Time Focus", "📱 Mobile App", "🎯 Local Jobs"]
    },
    {
        name: "USAJobs",
        url: "https://www.usajobs.gov/Search/Results?k=delivery%20driver",
        description: "Official US government job portal for federal delivery and logistics positions",
        type: "Government",
        category: "specialized",
        rating: 4.5,
        jobCount: "2,000+",
        location: "US",
        features: ["🏛️ Federal Jobs", "💰 Government Benefits", "🔐 Security Clearance", "📊 Veteran Preference"]
    },
    {
        name: "BuiltIn",
        url: "https://builtin.com/jobs/remote/dev-engineering?f%5B%5D=logistics",
        description: "Tech startup platform with logistics and delivery technology roles",
        type: "Startup Platform",
        category: "general",
        rating: 4.1,
        jobCount: "3,000+",
        location: "US",
        features: ["🚀 Startup Focus", "💻 Tech Companies", "🌟 Innovation", "📍 City-Based"]
    },
    {
        name: "The Muse",
        url: "https://www.themuse.com/jobs?keyword=delivery+driver",
        description: "Career-focused platform with company culture insights and delivery jobs",
        type: "Career Platform",
        category: "professional",
        rating: 4.3,
        jobCount: "8,000+",
        location: "US",
        features: ["🏢 Company Culture", "📈 Career Advice", "🎯 Cultural Fit", "💼 Professional Growth"]
    },
    {
        name: "Lensa",
        url: "https://lensa.com/jobs/delivery-driver",
        description: "AI-powered job platform with personalized delivery job recommendations",
        type: "AI Platform",
        category: "general",
        rating: 4.2,
        jobCount: "15,000+",
        location: "US",
        features: ["🤖 AI Matching", "📊 Salary Insights", "⚡ Quick Apply", "🎯 Personalized Results"]
    },
    {
        name: "Nexxt",
        url: "https://www.nexxt.com/jobs?keywords=delivery+driver",
        description: "Professional networking platform with targeted delivery job opportunities",
        type: "Network Platform",
        category: "professional",
        rating: 4.0,
        jobCount: "10,000+",
        location: "US",
        features: ["🤝 Professional Network", "🎯 Targeted Jobs", "📊 Industry Focus", "💼 Career Development"]
    }
];

export const CATEGORIES = [
    { id: "all", name: "All Platforms", count: JOB_BOARDS.length },
    { id: "general", name: "Major Platforms", count: JOB_BOARDS.filter(b => b.category === 'general').length },
    { id: "flexible", name: "Flexible Work", count: JOB_BOARDS.filter(b => b.category === 'flexible').length },
    { id: "professional", name: "Professional", count: JOB_BOARDS.filter(b => b.category === 'professional').length },
    { id: "local", name: "Local & Direct", count: JOB_BOARDS.filter(b => b.category === 'local').length }
];



//Job Posting Platforms
export const JOB_POSTING_PLATFORMS = [
    {
        name: "CB Driver",
        url: "https://www.cbdriver.com",
        description: "Part of Drivv/Courierboard ecosystem with 250,000+ registered drivers connecting independent contractors with professional courier companies nationwide",
        type: "Driver Platform",
        category: "specialized",
        rating: 4.5,
        jobCount: "10,000+",
        location: "US",
        features: ["🚚 Professional Courier Network", "👥 250K+ Registered Drivers", "📧 Job Alerts", "📋 Resume Builder", "🏢 Established Companies"]
    },
    {
        name: "Onfleet",
        url: "https://onfleet.com/drivers",
        description: "Leading delivery management platform for last-mile operations",
        type: "Platform",
        category: "specialized",
        rating: 4.5,
        jobCount: "3,000+",
        location: "Global",
        features: ["📦 Last-Mile Delivery", "🔗 Fleet Integration", "📱 Driver App", "🏢 Enterprise Clients"]
    },
    {
        name: "CourierGigs",
        url: "https://couriergigs.com",
        description: "Specialized platform for courier and delivery opportunities",
        type: "Courier Focused",
        category: "specialized",
        rating: 4.6,
        jobCount: "5,000+",
        location: "US",
        features: ["🚚 Delivery Focus", "📱 Mobile Optimized", "💰 Pay Transparency", "⚡ Quick Apply"]
    },
    {
        name: "Dispatch",
        url: "https://www.dispatchit.com/drivers",
        description: "Independent contractor delivery jobs with flexible scheduling nationwide",
        type: "Delivery Network",
        category: "gig",
        rating: 4.6,
        jobCount: "10,000+",
        location: "US",
        features: ["🗓️ Flexible Schedule", "🚗 Any Vehicle", "💰 Weekly Pay", "📍 Choose Your Area"]
    },
    {
        name: "CitizenShipper",
        url: "https://www.citizenshipper.com/drivers",
        description: "Pet transport and specialty item delivery network",
        type: "Specialty Transport",
        category: "specialized",
        rating: 4.7,
        jobCount: "3,000+",
        location: "US",
        features: ["🐾 Pet Transport", "📦 Specialty Items", "💰 Premium Rates", "🛡️ Insurance Covered"]
    },
    {
        name: "Dolly",
        url: "https://dolly.com/driver/",
        description: "Moving and delivery platform for helpers and drivers",
        type: "Moving & Delivery",
        category: "specialized",
        rating: 4.2,
        jobCount: "5,000+",
        location: "US",
        features: ["📦 Moving Services", "🚛 Delivery Jobs", "💰 Earn Up To $35/hr", "📱 Easy Scheduling"]
    },
    {
        name: "Roadie",
        url: "https://www.roadie.com/drivers",
        description: "Cross-town and long-distance delivery opportunities",
        type: "Logistics Network",
        category: "gig",
        rating: 4.1,
        jobCount: "20,000+",
        location: "US",
        features: ["🛣️ Long Distance", "📦 Package Delivery", "✈️ Airport Routes", "💰 Competitive Pay"]
    },
    {
        name: "GigSmart",
        url: "https://gigsmart.com",
        description: "Flexible workforce platform connecting workers with shifts across all industries nationwide",
        type: "Flexible Shifts",
        category: "gig",
        rating: 4.2,
        jobCount: "12,000+",
        location: "US",
        features: ["⏰ Choose Your Schedule", "💼 Work Today", "💰 Get Paid Instantly", "🔄 Multiple Industries"]
    }
];


// Insurance & Tax Data (7 items)
export const INSURANCE_COMPANIES = [
    {
        id: "progressive-commercial",
        name: "Progressive Commercial",
        type: "Commercial Insurance",
        description: "Commercial auto insurance for professional drivers and fleet operations",
        website: "https://www.progressive.com/commercial",
        features: ["Commercial coverage", "Fleet discounts", "24/7 claims", "Online management"],
        badges: ["Commercial Focus", "Fleet Discounts", "24/7 Support"],
        color: "blue"
    },
    {
        id: "geico-commercial",
        name: "GEICO Commercial",
        type: "Commercial Insurance",
        description: "Affordable commercial auto insurance with flexible payment options",
        website: "https://www.geico.com/commercial",
        features: ["Competitive rates", "Flexible payments", "Multi-policy discounts", "Mobile app"],
        badges: ["Affordable", "Flexible", "Multi-Policy"],
        color: "green"
    },
    {
        id: "state-farm-commercial",
        name: "State Farm Commercial",
        type: "Commercial Insurance",
        description: "Comprehensive commercial insurance with personalized service",
        website: "https://www.statefarm.com/commercial",
        features: ["Personalized service", "Comprehensive coverage", "Local agents", "Claims support"],
        badges: ["Personalized", "Local Agents", "Comprehensive"],
        color: "red"
    },
    {
        id: "allstate-commercial",
        name: "Allstate Commercial",
        type: "Commercial Insurance",
        description: "Commercial auto insurance with business protection features",
        website: "https://www.allstate.com/commercial",
        features: ["Business protection", "Risk management", "Claims assistance", "Policy management"],
        badges: ["Business Focus", "Risk Management", "Claims Support"],
        color: "blue"
    },
    {
        id: "liberty-mutual-commercial",
        name: "Liberty Mutual Commercial",
        type: "Commercial Insurance",
        description: "Commercial insurance solutions for transportation businesses",
        website: "https://www.libertymutual.com/commercial",
        features: ["Transportation focus", "Customized coverage", "Risk consulting", "Claims expertise"],
        badges: ["Transportation Focus", "Customized", "Risk Consulting"],
        color: "green"
    },
    {
        id: "farmers-commercial",
        name: "Farmers Commercial",
        type: "Commercial Insurance",
        description: "Commercial auto insurance with business liability protection",
        website: "https://www.farmers.com/commercial",
        features: ["Business liability", "Fleet coverage", "Claims service", "Policy options"],
        badges: ["Business Liability", "Fleet Coverage", "Claims Service"],
        color: "orange"
    },
    {
        id: "usaa-commercial",
        name: "USAA Commercial",
        type: "Military Commercial Insurance",
        description: "Commercial insurance for military members and veterans",
        website: "https://www.usaa.com/commercial",
        features: ["Military focus", "Veteran benefits", "Competitive rates", "Member service"],
        badges: ["Military Focus", "Veteran Benefits", "Member Service"],
        color: "navy"
    }
];

// Load Boards & Freight Data (14 items)
export const LOAD_BOARDS_FOR_FREIGHT = [
    {
        id: "dat-load-board",
        name: "DAT Load Board",
        type: "Load Board",
        description: "Industry-leading load board with real-time freight matching",
        website: "https://www.dat.com",
        features: ["Real-time loads", "Rate insights", "Mobile app", "Carrier network"],
        badges: ["Industry Leader", "Real-time", "Rate Insights"],
        color: "blue"
    },
    {
        id: "truckstop-load-board",
        name: "Truckstop Load Board",
        type: "Load Board",
        description: "Comprehensive load board with advanced filtering and matching",
        website: "https://www.truckstop.com",
        features: ["Advanced filtering", "Load matching", "Rate analysis", "Carrier tools"],
        badges: ["Advanced Filtering", "Load Matching", "Rate Analysis"],
        color: "green"
    },
    {
        id: "sylectus-load-board",
        name: "Sylectus Load Board",
        type: "Load Board",
        description: "Technology-driven load board with automated matching",
        website: "https://www.sylectus.com",
        features: ["Automated matching", "Technology focus", "Efficiency tools", "Carrier network"],
        badges: ["Automated", "Technology", "Efficiency"],
        color: "purple"
    },
    {
        id: "freightwaves-sonar",
        name: "FreightWaves SONAR",
        type: "Freight Intelligence",
        description: "Freight market intelligence and load board platform",
        website: "https://sonar.freightwaves.com",
        features: ["Market intelligence", "Load board", "Rate forecasting", "Industry insights"],
        badges: ["Market Intelligence", "Rate Forecasting", "Industry Insights"],
        color: "orange"
    },
    {
        id: "trucker-path",
        name: "Trucker Path",
        type: "Load Board & Navigation",
        description: "Load board with integrated navigation and trucker services",
        website: "https://www.truckerpath.com",
        features: ["Load board", "Navigation", "Truck stops", "Fuel prices"],
        badges: ["Navigation", "Truck Stops", "Fuel Prices"],
        color: "blue"
    },
    {
        id: "getloaded",
        name: "GetLoaded",
        type: "Load Board",
        description: "Load board platform with carrier and broker tools",
        website: "https://www.getloaded.com",
        features: ["Load board", "Carrier tools", "Broker tools", "Rate management"],
        badges: ["Carrier Tools", "Broker Tools", "Rate Management"],
        color: "green"
    },
    {
        id: "freight-connection",
        name: "Freight Connection",
        type: "Load Board",
        description: "Load board with focus on owner-operators and small fleets",
        website: "https://www.freightconnection.com",
        features: ["Owner-operator focus", "Small fleet friendly", "Load matching", "Rate tools"],
        badges: ["Owner-Operator", "Small Fleet", "Load Matching"],
        color: "red"
    },
    {
        id: "loadsmart",
        name: "LoadSmart",
        type: "Digital Freight Platform",
        description: "Digital freight platform with instant booking and pricing",
        website: "https://www.loadsmart.com",
        features: ["Instant booking", "Digital platform", "Pricing tools", "Carrier network"],
        badges: ["Instant Booking", "Digital Platform", "Pricing Tools"],
        color: "purple"
    },
    {
        id: "convoy-load-board",
        name: "Convoy Load Board",
        type: "Digital Freight Network",
        description: "Digital freight network with automated matching and pricing",
        website: "https://www.convoy.com",
        features: ["Automated matching", "Digital network", "Pricing optimization", "Carrier tools"],
        badges: ["Automated", "Digital Network", "Pricing Optimization"],
        color: "blue"
    },
    {
        id: "uber-freight",
        name: "Uber Freight",
        type: "Digital Freight Platform",
        description: "Digital freight platform with transparent pricing and instant booking",
        website: "https://www.uberfreight.com",
        features: ["Transparent pricing", "Instant booking", "Digital platform", "Carrier support"],
        badges: ["Transparent Pricing", "Instant Booking", "Digital Platform"],
        color: "green"
    },
    {
        id: "freightos",
        name: "Freightos",
        type: "Freight Marketplace",
        description: "International freight marketplace with instant quotes",
        website: "https://www.freightos.com",
        features: ["International focus", "Instant quotes", "Marketplace", "Rate comparison"],
        badges: ["International", "Instant Quotes", "Marketplace"],
        color: "orange"
    },
    {
        id: "flexport",
        name: "Flexport",
        type: "Global Logistics Platform",
        description: "Global logistics platform with end-to-end freight management",
        website: "https://www.flexport.com",
        features: ["Global logistics", "End-to-end", "Technology platform", "Supply chain"],
        badges: ["Global Logistics", "End-to-End", "Technology Platform"],
        color: "blue"
    },
    {
        id: "freightquote",
        name: "FreightQuote",
        type: "Freight Brokerage",
        description: "Freight brokerage with load board and carrier network",
        website: "https://www.freightquote.com",
        features: ["Freight brokerage", "Load board", "Carrier network", "Rate management"],
        badges: ["Freight Brokerage", "Load Board", "Carrier Network"],
        color: "green"
    },
    {
        id: "landstar-load-board",
        name: "Landstar Load Board",
        type: "Carrier Load Board",
        description: "Load board for Landstar carrier network and owner-operators",
        website: "https://www.landstar.com",
        features: ["Carrier network", "Owner-operator", "Load board", "Support services"],
        badges: ["Carrier Network", "Owner-Operator", "Support Services"],
        color: "red"
    }
];

// Medical Insurance and Health Care Data (2 items)
export const MEDICAL_INSURANCE_HEALTH = [
    {
        id: "liberty-healthshare",
        name: "Liberty HealthShare",
        type: "Health Cost Sharing",
        description: "Health cost sharing ministry for independent contractors and drivers",
        website: "https://www.libertyhealthshare.org",
        features: ["Cost sharing", "Independent contractor friendly", "Flexible plans", "Community support"],
        badges: ["Cost Sharing", "Independent Contractor", "Flexible Plans"],
        color: "blue"
    },
    {
        id: "samaritan-ministries",
        name: "Samaritan Ministries",
        type: "Health Cost Sharing",
        description: "Christian health cost sharing ministry with direct member support",
        website: "https://www.samaritanministries.org",
        features: ["Direct member support", "Christian ministry", "Cost sharing", "Community focused"],
        badges: ["Direct Support", "Christian Ministry", "Community Focused"],
        color: "green"
    }
];

// Online Resources Data (7 items)
export const ONLINE_TRAINING_COURSES = [
    {
        id: "cdl-training-online",
        name: "CDL Training Online",
        type: "CDL Training",
        description: "Online CDL training courses and practice tests",
        website: "https://www.cdltrainingonline.com",
        features: ["Online courses", "Practice tests", "Study materials", "Exam prep"],
        badges: ["Online Courses", "Practice Tests", "Exam Prep"],
        color: "blue"
    },
    {
        id: "trucking-school-directory",
        name: "Trucking School Directory",
        type: "Training Directory",
        description: "Comprehensive directory of trucking schools and training programs",
        website: "https://www.truckingschooldirectory.com",
        features: ["School directory", "Training programs", "Reviews", "Location search"],
        badges: ["School Directory", "Training Programs", "Reviews"],
        color: "green"
    },
    {
        id: "fmcsa-training",
        name: "FMCSA Training Resources",
        type: "Government Training",
        description: "Official FMCSA training resources and safety materials",
        website: "https://www.fmcsa.dot.gov/training",
        features: ["Official resources", "Safety training", "Regulations", "Free materials"],
        badges: ["Official Resources", "Safety Training", "Free Materials"],
        color: "red"
    },
    {
        id: "trucking-education-foundation",
        name: "Trucking Education Foundation",
        type: "Educational Resources",
        description: "Educational resources and training materials for trucking industry",
        website: "https://www.truckingeducationfoundation.org",
        features: ["Educational resources", "Training materials", "Industry focus", "Professional development"],
        badges: ["Educational Resources", "Training Materials", "Professional Development"],
        color: "purple"
    },
    {
        id: "driver-safety-training",
        name: "Driver Safety Training",
        type: "Safety Training",
        description: "Comprehensive driver safety training and certification programs",
        website: "https://www.driversafetytraining.com",
        features: ["Safety training", "Certification", "Online courses", "Compliance"],
        badges: ["Safety Training", "Certification", "Compliance"],
        color: "orange"
    },
    {
        id: "trucking-industry-resources",
        name: "Trucking Industry Resources",
        type: "Industry Resources",
        description: "Comprehensive resources for trucking industry professionals",
        website: "https://www.truckingindustryresources.com",
        features: ["Industry resources", "Professional tools", "News updates", "Best practices"],
        badges: ["Industry Resources", "Professional Tools", "Best Practices"],
        color: "teal"
    },
    {
        id: "logistics-education-hub",
        name: "Logistics Education Hub",
        type: "Logistics Training",
        description: "Training and education resources for logistics and transportation",
        website: "https://www.logisticseducationhub.com",
        features: ["Logistics training", "Transportation education", "Career development", "Industry insights"],
        badges: ["Logistics Training", "Career Development", "Industry Insights"],
        color: "cyan"
    }
];

// Training and Trade Associations Data (12 items)
export const TRAINING_TRADE_ASSOCIATIONS = [
    {
        id: "american-trucking-associations",
        name: "American Trucking Associations",
        type: "Industry Association",
        description: "National trade association representing the trucking industry",
        website: "https://www.trucking.org",
        features: ["Industry advocacy", "Networking", "Training programs", "Policy updates"],
        badges: ["Industry Advocacy", "Networking", "Training Programs"],
        color: "blue"
    },
    {
        id: "owner-operator-independent-drivers",
        name: "Owner-Operator Independent Drivers Association",
        type: "Driver Association",
        description: "Association representing owner-operators and independent drivers",
        website: "https://www.ooida.com",
        features: ["Driver advocacy", "Legal support", "Business resources", "Networking"],
        badges: ["Driver Advocacy", "Legal Support", "Business Resources"],
        color: "green"
    },
    {
        id: "truckload-carriers-association",
        name: "Truckload Carriers Association",
        type: "Carrier Association",
        description: "Association for truckload carriers and industry professionals",
        website: "https://www.truckload.org",
        features: ["Carrier focus", "Industry events", "Training", "Advocacy"],
        badges: ["Carrier Focus", "Industry Events", "Training"],
        color: "red"
    },
    {
        id: "national-private-truck-council",
        name: "National Private Truck Council",
        type: "Private Fleet Association",
        description: "Association for private fleet operators and managers",
        website: "https://www.nptc.org",
        features: ["Private fleet focus", "Management resources", "Networking", "Best practices"],
        badges: ["Private Fleet", "Management Resources", "Best Practices"],
        color: "purple"
    },
    {
        id: "women-in-trucking",
        name: "Women in Trucking",
        type: "Professional Association",
        description: "Association promoting women's success in the trucking industry",
        website: "https://www.womenintrucking.org",
        features: ["Women's advocacy", "Professional development", "Networking", "Industry support"],
        badges: ["Women's Advocacy", "Professional Development", "Networking"],
        color: "pink"
    },
    {
        id: "trucking-association-executives",
        name: "Trucking Association Executives",
        type: "Executive Association",
        description: "Association for trucking industry executives and leaders",
        website: "https://www.taecouncil.org",
        features: ["Executive networking", "Leadership development", "Industry insights", "Policy updates"],
        badges: ["Executive Networking", "Leadership Development", "Industry Insights"],
        color: "navy"
    },
    {
        id: "commercial-vehicle-safety-alliance",
        name: "Commercial Vehicle Safety Alliance",
        type: "Safety Association",
        description: "Alliance focused on commercial vehicle safety and enforcement",
        website: "https://www.cvsa.org",
        features: ["Safety focus", "Enforcement", "Training", "Industry standards"],
        badges: ["Safety Focus", "Enforcement", "Industry Standards"],
        color: "orange"
    },
    {
        id: "national-association-small-trucking",
        name: "National Association of Small Trucking Companies",
        type: "Small Business Association",
        description: "Association representing small trucking companies and owner-operators",
        website: "https://www.nastc.com",
        features: ["Small business focus", "Owner-operator support", "Advocacy", "Resources"],
        badges: ["Small Business", "Owner-Operator Support", "Advocacy"],
        color: "teal"
    },
    {
        id: "trucking-industry-defense-association",
        name: "Trucking Industry Defense Association",
        type: "Legal Association",
        description: "Association providing legal defense and support for trucking industry",
        website: "https://www.tida.org",
        features: ["Legal defense", "Industry support", "Legal resources", "Advocacy"],
        badges: ["Legal Defense", "Industry Support", "Legal Resources"],
        color: "red"
    },
    {
        id: "intermodal-association-north-america",
        name: "Intermodal Association of North America",
        type: "Intermodal Association",
        description: "Association for intermodal transportation and logistics",
        website: "https://www.intermodal.org",
        features: ["Intermodal focus", "Logistics", "Industry events", "Networking"],
        badges: ["Intermodal Focus", "Logistics", "Industry Events"],
        color: "blue"
    },
    {
        id: "specialized-carriers-rigging-association",
        name: "Specialized Carriers & Rigging Association",
        type: "Specialized Transport Association",
        description: "Association for specialized carriers and heavy haulers",
        website: "https://www.scranet.org",
        features: ["Specialized transport", "Heavy hauling", "Safety training", "Industry standards"],
        badges: ["Specialized Transport", "Heavy Hauling", "Safety Training"],
        color: "green"
    },
    {
        id: "trucking-association-montana",
        name: "Montana Trucking Association",
        type: "State Association",
        description: "State-level trucking association for Montana carriers and drivers",
        website: "https://www.mttrucking.org",
        features: ["State advocacy", "Local networking", "Training programs", "Industry support"],
        badges: ["State Advocacy", "Local Networking", "Training Programs"],
        color: "yellow"
    }
];