// Client-side license and certification types and configurations
// This file doesn't import Prisma and can be used in client components

// License types and their configurations
export const LICENSE_TYPES = {
  'drivers-license': {
    name: "Driver's License",
    description: "Must be valid & meet state requirements",
    isRequired: true,
    folder: 'LICENSES' as const,
  },
  'auto-insurance': {
    name: "Regular Auto Insurance",
    description: "Current vehicle insurance certificate",
    isRequired: true,
    folder: 'INSURANCE' as const,
  },
  'commercial-insurance': {
    name: "Commercial Auto Insurance",
    description: "Commercial vehicle insurance certificate",
    isRequired: true,
    folder: 'INSURANCE' as const,
  },
  'tsa-cert': {
    name: "TSA Certification",
    description: "Transportation Security Administration certification",
    isRequired: true,
    folder: 'CERTIFICATES' as const,
  },
  'twic-cert': {
    name: "TWIC® Certification",
    description: "Transportation Worker Identification Credential for maritime facilities",
    isRequired: true,
    folder: 'CERTIFICATES' as const,
  },
} as const;

// Certification types and their configurations
export const CERTIFICATION_TYPES = {
  // Core Medical Certifications
  'hipaa': {
    name: "HIPAA Certification",
    description: "Patient privacy and medical information handling",
    category: "core-medical",
    isRequired: true,
    folder: 'CERTIFICATES' as const,
  },
  'osha-bbp': {
    name: "OSHA Bloodborne Pathogens",
    description: "Safe handling of specimens and infectious materials",
    category: "core-medical",
    isRequired: true,
    folder: 'CERTIFICATES' as const,
  },
  'osha-fire': {
    name: "OSHA Workplace Fire Safety Training",
    description: "Fire prevention and emergency response procedures",
    category: "core-medical",
    isRequired: true,
    folder: 'CERTIFICATES' as const,
  },
  'osha-hazcom': {
    name: "OSHA Hazard Communication (Haz-Com)",
    description: "Chemical hazard communication for medical couriers",
    category: "core-medical",
    isRequired: true,
    folder: 'CERTIFICATES' as const,
  },
  'cpr-firstaid': {
    name: "CPR/First Aid Certification",
    description: "American Red Cross or American Heart Association",
    category: "core-medical",
    isRequired: true,
    folder: 'CERTIFICATES' as const,
  },
  'hazmat': {
    name: "HazMat Certification",
    description: "Hazardous Materials Transportation (DOT)",
    category: "core-medical",
    isRequired: true,
    folder: 'CERTIFICATES' as const,
  },
  
  // Advanced Medical/Transport Certifications
  'iata-dot': {
    name: "IATA/DOT Dangerous Goods",
    description: "Air/ground specimen transportation certification",
    category: "advanced-medical",
    isRequired: false,
    folder: 'CERTIFICATES' as const,
  },
  'specimen-handling': {
    name: "Specimen Handling & Transport",
    description: "Collection, storage, and chain of custody",
    category: "advanced-medical",
    isRequired: false,
    folder: 'CERTIFICATES' as const,
  },
  'biohazard-infectious': {
    name: "Biohazard & Infectious Substance",
    description: "Advanced training for high-risk materials",
    category: "advanced-medical",
    isRequired: false,
    folder: 'CERTIFICATES' as const,
  },
  'biohazard-transport': {
    name: "BioHazard Transport Training",
    description: "Transport protocols and containment procedures",
    category: "advanced-medical",
    isRequired: false,
    folder: 'CERTIFICATES' as const,
  },
  'medical-waste': {
    name: "Medical Waste Transportation",
    description: "Regulated medical waste handling",
    category: "advanced-medical",
    isRequired: false,
    folder: 'CERTIFICATES' as const,
  },
  
  // Integrity Delivers Certifications
  'specimen-bundle': {
    name: "Specimen Handling & Transportation",
    description: "Bloodborne Pathogen + HIPAA Bundle (Integrity Delivers)",
    category: "advanced-medical",
    isRequired: false,
    folder: 'CERTIFICATES' as const,
  },
  'chemotherapy': {
    name: "Chemotherapy (Hazardous) Drugs",
    description: "Safe handling & spill management (Integrity Delivers)",
    category: "advanced-medical",
    isRequired: false,
    folder: 'CERTIFICATES' as const,
  },
  'hipaa-only': {
    name: "HIPAA-only Course",
    description: "Focused HIPAA training (Integrity Delivers)",
    category: "advanced-medical",
    isRequired: false,
    folder: 'CERTIFICATES' as const,
  },
  'bbp-only': {
    name: "Bloodborne Pathogen (BBP) Only",
    description: "Standalone BBP training (Integrity Delivers)",
    category: "advanced-medical",
    isRequired: false,
    folder: 'CERTIFICATES' as const,
  },
  'dental-transport': {
    name: "Dental Transportation",
    description: "Specialized dental specimen handling (Integrity Delivers)",
    category: "advanced-medical",
    isRequired: false,
    folder: 'CERTIFICATES' as const,
  },
  
  // Safety & Compliance Certifications
  'chain-of-custody': {
    name: "Chain of Custody Certification",
    description: "Drug test samples and forensic specimens",
    category: "safety-compliance",
    isRequired: false,
    folder: 'CERTIFICATES' as const,
  },
  'dangerous-goods': {
    name: "Dangerous Goods (DG) Certified",
    description: "General dangerous goods handling and transport",
    category: "safety-compliance",
    isRequired: false,
    folder: 'CERTIFICATES' as const,
  },
  'dg7': {
    name: "Dangerous Goods Class 7 (DG7) Certified",
    description: "Radioactive materials handling and transport",
    category: "safety-compliance",
    isRequired: false,
    folder: 'CERTIFICATES' as const,
  },
  'defensive-driving': {
    name: "Defensive Driving Certification",
    description: "Insurance and liability requirements",
    category: "safety-compliance",
    isRequired: false,
    folder: 'CERTIFICATES' as const,
  },
  'osha-general': {
    name: "OSHA General Industry Training",
    description: "10-hour or 30-hour workplace safety card",
    category: "safety-compliance",
    isRequired: false,
    folder: 'CERTIFICATES' as const,
  },
  'cold-chain': {
    name: "Cold Chain Management",
    description: "Temperature-sensitive medications and vaccines",
    category: "safety-compliance",
    isRequired: false,
    folder: 'CERTIFICATES' as const,
  },
  
  // Optional Value-Adding Certifications
  'phlebotomy': {
    name: "Phlebotomy Technician",
    description: "Blood sample handling credibility (optional)",
    category: "optional",
    isRequired: false,
    folder: 'CERTIFICATES' as const,
  },
  'customer-service': {
    name: "Customer Service Training",
    description: "Professionalism for medical environments",
    category: "optional",
    isRequired: false,
    folder: 'CERTIFICATES' as const,
  },
  'independent-contractor': {
    name: "Independent Contractor Membership",
    description: "Business structure & compliance (Integrity Delivers)",
    category: "optional",
    isRequired: false,
    folder: 'CERTIFICATES' as const,
  },
  'courier-business': {
    name: "Starting Your Own Courier Business",
    description: "Entrepreneurship & business setup (Integrity Delivers)",
    category: "optional",
    isRequired: false,
    folder: 'CERTIFICATES' as const,
  },
  'financial-masterclass': {
    name: "Medical Courier Financial Masterclass",
    description: "Financial planning & business growth (Integrity Delivers)",
    category: "optional",
    isRequired: false,
    folder: 'CERTIFICATES' as const,
  },
  'marketing-tips': {
    name: "Essential Marketing Tips",
    description: "Business promotion & client acquisition (Integrity Delivers)",
    category: "optional",
    isRequired: false,
    folder: 'CERTIFICATES' as const,
  },
  'administrative': {
    name: "Administrative Recommendations",
    description: "Operations & administrative best practices (Integrity Delivers)",
    category: "optional",
    isRequired: false,
    folder: 'CERTIFICATES' as const,
  },
  'dispatcher-training': {
    name: "Dispatchers Training Course",
    description: "Dispatch operations & coordination (Integrity Delivers)",
    category: "optional",
    isRequired: false,
    folder: 'CERTIFICATES' as const,
  },
} as const;

// Type definitions for client-side use
export type LicenseType = keyof typeof LICENSE_TYPES;
export type CertificationType = keyof typeof CERTIFICATION_TYPES;
export type FolderType = 'LICENSES' | 'INSURANCE' | 'CERTIFICATES' | 'MEDICAL_RECORDS' | 'VEHICLE_DOCS' | 'DOCUMENTS' | 'TEMP';
