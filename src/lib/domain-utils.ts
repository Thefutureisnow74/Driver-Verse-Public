/**
 * Utility functions for domain extraction and logo generation
 */

/**
 * Extracts a clean domain from a URL
 * @param url - The URL to extract domain from
 * @returns Clean domain without www, protocols, paths, or query parameters
 */
export function extractDomain(url: string): string {
  if (!url) return '';
  
  try {
    // Remove protocol if present
    let cleanUrl = url.replace(/^https?:\/\//, '');
    
    // Remove www. prefix
    cleanUrl = cleanUrl.replace(/^www\./, '');
    
    // Remove path, query parameters, and fragments
    cleanUrl = cleanUrl.split('/')[0];
    cleanUrl = cleanUrl.split('?')[0];
    cleanUrl = cleanUrl.split('#')[0];
    
    // Remove port numbers
    cleanUrl = cleanUrl.split(':')[0];
    
    return cleanUrl.toLowerCase();
  } catch (error) {
    console.error('Error extracting domain:', error);
    return '';
  }
}

/**
 * Generates a logo URL using logo.dev service
 * @param url - The company URL or domain
 * @param token - The logo.dev API token
 * @returns Logo URL from logo.dev service
 */
export function getCompanyLogo(url: string): string {
  const domain = extractDomain(url);
  if (!domain) return '';
  
  return `https://img.logo.dev/${domain}?token=${process.env.NEXT_PUBLIC_LOGO_DEV_PK}`;
}

/**
 * Generates a fallback logo with company initials
 * @param companyName - The company name
 * @returns Data URL for a generated logo with initials
 */
export function generateFallbackLogo(companyName: string): string {
  if (!companyName) return '';
  
  // Extract initials (first letter of each word, max 2 letters)
  const initials = companyName
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
  
  // Generate a simple SVG logo with initials
  const svg = `
    <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="8" fill="#3B82F6"/>
      <text x="20" y="26" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="14" font-weight="bold">
        ${initials}
      </text>
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}
