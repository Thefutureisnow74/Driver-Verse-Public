/**
 * US States data for filters and forms
 */

export interface USState {
  value: string;
  label: string;
  abbreviation: string;
}

export const US_STATES: USState[] = [
  { value: "alabama", label: "Alabama", abbreviation: "AL" },
  { value: "alaska", label: "Alaska", abbreviation: "AK" },
  { value: "arizona", label: "Arizona", abbreviation: "AZ" },
  { value: "arkansas", label: "Arkansas", abbreviation: "AR" },
  { value: "california", label: "California", abbreviation: "CA" },
  { value: "colorado", label: "Colorado", abbreviation: "CO" },
  { value: "connecticut", label: "Connecticut", abbreviation: "CT" },
  { value: "delaware", label: "Delaware", abbreviation: "DE" },
  { value: "florida", label: "Florida", abbreviation: "FL" },
  { value: "georgia", label: "Georgia", abbreviation: "GA" },
  { value: "hawaii", label: "Hawaii", abbreviation: "HI" },
  { value: "idaho", label: "Idaho", abbreviation: "ID" },
  { value: "illinois", label: "Illinois", abbreviation: "IL" },
  { value: "indiana", label: "Indiana", abbreviation: "IN" },
  { value: "iowa", label: "Iowa", abbreviation: "IA" },
  { value: "kansas", label: "Kansas", abbreviation: "KS" },
  { value: "kentucky", label: "Kentucky", abbreviation: "KY" },
  { value: "louisiana", label: "Louisiana", abbreviation: "LA" },
  { value: "maine", label: "Maine", abbreviation: "ME" },
  { value: "maryland", label: "Maryland", abbreviation: "MD" },
  { value: "massachusetts", label: "Massachusetts", abbreviation: "MA" },
  { value: "michigan", label: "Michigan", abbreviation: "MI" },
  { value: "minnesota", label: "Minnesota", abbreviation: "MN" },
  { value: "mississippi", label: "Mississippi", abbreviation: "MS" },
  { value: "missouri", label: "Missouri", abbreviation: "MO" },
  { value: "montana", label: "Montana", abbreviation: "MT" },
  { value: "nebraska", label: "Nebraska", abbreviation: "NE" },
  { value: "nevada", label: "Nevada", abbreviation: "NV" },
  { value: "new-hampshire", label: "New Hampshire", abbreviation: "NH" },
  { value: "new-jersey", label: "New Jersey", abbreviation: "NJ" },
  { value: "new-mexico", label: "New Mexico", abbreviation: "NM" },
  { value: "new-york", label: "New York", abbreviation: "NY" },
  { value: "north-carolina", label: "North Carolina", abbreviation: "NC" },
  { value: "north-dakota", label: "North Dakota", abbreviation: "ND" },
  { value: "ohio", label: "Ohio", abbreviation: "OH" },
  { value: "oklahoma", label: "Oklahoma", abbreviation: "OK" },
  { value: "oregon", label: "Oregon", abbreviation: "OR" },
  { value: "pennsylvania", label: "Pennsylvania", abbreviation: "PA" },
  { value: "rhode-island", label: "Rhode Island", abbreviation: "RI" },
  { value: "south-carolina", label: "South Carolina", abbreviation: "SC" },
  { value: "south-dakota", label: "South Dakota", abbreviation: "SD" },
  { value: "tennessee", label: "Tennessee", abbreviation: "TN" },
  { value: "texas", label: "Texas", abbreviation: "TX" },
  { value: "utah", label: "Utah", abbreviation: "UT" },
  { value: "vermont", label: "Vermont", abbreviation: "VT" },
  { value: "virginia", label: "Virginia", abbreviation: "VA" },
  { value: "washington", label: "Washington", abbreviation: "WA" },
  { value: "west-virginia", label: "West Virginia", abbreviation: "WV" },
  { value: "wisconsin", label: "Wisconsin", abbreviation: "WI" },
  { value: "wyoming", label: "Wyoming", abbreviation: "WY" },
  { value: "district-of-columbia", label: "District of Columbia", abbreviation: "DC" },
];

/**
 * Get state by abbreviation
 */
export function getStateByAbbreviation(abbreviation: string): USState | undefined {
  return US_STATES.find(state => state.abbreviation.toLowerCase() === abbreviation.toLowerCase());
}

/**
 * Get state by value
 */
export function getStateByValue(value: string): USState | undefined {
  return US_STATES.find(state => state.value.toLowerCase() === value.toLowerCase());
}
