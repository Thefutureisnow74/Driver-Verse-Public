import prisma from './db';
import { getPresignedUploadUrl } from './file-service';
import { FolderType } from './s3';
import { LICENSE_TYPES, CERTIFICATION_TYPES, LicenseType, CertificationType } from './license-client';

// Get user licenses
export async function getUserLicenses(userId: string) {
  return await prisma.license.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
}

// Get user certifications
export async function getUserCertifications(userId: string) {
  return await prisma.certification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
}

// Get user DOT/MC numbers
export async function getUserDOTMCNumbers(userId: string) {
  return await prisma.dOTMCNumbers.findUnique({
    where: { userId },
  });
}

// Create or update license
export async function upsertLicense(
  userId: string,
  type: LicenseType,
  data: {
    licenseNumber?: string;
    issuingAuthority?: string;
    issueDate?: Date;
    expiryDate?: Date;
    description?: string;
    fileKey?: string;
    fileUrl?: string;
    status?: string;
  }
) {
  return await prisma.license.upsert({
    where: {
      userId_type: {
        userId,
        type,
      },
    },
    update: {
      ...data,
      updatedAt: new Date(),
    },
    create: {
      userId,
      type,
      isRequired: LICENSE_TYPES[type].isRequired,
      ...data,
    },
  });
}

// Create or update certification
export async function upsertCertification(
  userId: string,
  type: CertificationType,
  data: {
    certificateNumber?: string;
    issuingAuthority?: string;
    issueDate?: Date;
    expiryDate?: Date;
    description?: string;
    fileKey?: string;
    fileUrl?: string;
    status?: string;
    isCustom?: boolean;
  }
) {
  const certConfig = CERTIFICATION_TYPES[type];
  
  return await prisma.certification.upsert({
    where: {
      userId_type: {
        userId,
        type,
      },
    },
    update: {
      ...data,
      updatedAt: new Date(),
    },
    create: {
      userId,
      type,
      category: certConfig.category,
      isRequired: certConfig.isRequired,
      isCustom: data.isCustom || false,
      ...data,
    },
  });
}

// Create or update DOT/MC numbers
export async function upsertDOTMCNumbers(
  userId: string,
  data: {
    dotNumber?: string;
    mcNumber?: string;
    dotCertificateKey?: string;
    dotCertificateUrl?: string;
    mcCertificateKey?: string;
    mcCertificateUrl?: string;
    dotStatus?: string;
    mcStatus?: string;
  }
) {
  return await prisma.dOTMCNumbers.upsert({
    where: { userId },
    update: {
      ...data,
      updatedAt: new Date(),
    },
    create: {
      userId,
      ...data,
    },
  });
}

// Get presigned upload URL for license
export async function getLicenseUploadUrl(
  userId: string,
  licenseType: LicenseType,
  fileName: string,
  mimeType: string
) {
  const config = LICENSE_TYPES[licenseType];
  return await getPresignedUploadUrl(
    userId,
    fileName,
    mimeType,
    config.folder
  );
}

// Get presigned upload URL for certification
export async function getCertificationUploadUrl(
  userId: string,
  certType: CertificationType,
  fileName: string,
  mimeType: string
) {
  const config = CERTIFICATION_TYPES[certType];
  return await getPresignedUploadUrl(
    userId,
    fileName,
    mimeType,
    config.folder
  );
}

// Get presigned upload URL for DOT/MC certificate
export async function getDOTMCCertificateUploadUrl(
  userId: string,
  certificateType: 'dot' | 'mc',
  fileName: string,
  mimeType: string
) {
  return await getPresignedUploadUrl(
    userId,
    fileName,
    mimeType,
    'CERTIFICATES'
  );
}

// Get license/certification statistics
export async function getLicenseCertStats(userId: string) {
  const [licenses, certifications, dotMc] = await Promise.all([
    prisma.license.findMany({ where: { userId } }),
    prisma.certification.findMany({ where: { userId } }),
    prisma.dOTMCNumbers.findUnique({ where: { userId } }),
  ]);

  const totalLicenses = Object.keys(LICENSE_TYPES).length;
  const uploadedLicenses = licenses.filter(l => l.status === 'uploaded').length;
  const requiredLicenses = licenses.filter(l => l.isRequired).length;
  const uploadedRequiredLicenses = licenses.filter(l => l.isRequired && l.status === 'uploaded').length;

  const totalCertifications = Object.keys(CERTIFICATION_TYPES).length;
  const uploadedCertifications = certifications.filter(c => c.status === 'uploaded').length;
  const requiredCertifications = certifications.filter(c => c.isRequired).length;
  const uploadedRequiredCertifications = certifications.filter(c => c.isRequired && c.status === 'uploaded').length;

  return {
    licenses: {
      total: totalLicenses,
      uploaded: uploadedLicenses,
      required: requiredLicenses,
      uploadedRequired: uploadedRequiredLicenses,
      completionRate: totalLicenses > 0 ? (uploadedLicenses / totalLicenses) * 100 : 0,
    },
    certifications: {
      total: totalCertifications,
      uploaded: uploadedCertifications,
      required: requiredCertifications,
      uploadedRequired: uploadedRequiredCertifications,
      completionRate: totalCertifications > 0 ? (uploadedCertifications / totalCertifications) * 100 : 0,
    },
    dotMc: {
      hasDot: !!dotMc?.dotNumber,
      hasMc: !!dotMc?.mcNumber,
      dotUploaded: !!dotMc?.dotCertificateKey,
      mcUploaded: !!dotMc?.mcCertificateKey,
    },
  };
}
