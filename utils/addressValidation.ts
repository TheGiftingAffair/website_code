// Google Maps Geocoding API utility for address validation
// Specifically checks if an address is within Singapore

// Type definitions for Google Maps Geocoding API response
interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

interface GeocodeResultItem {
  address_components: AddressComponent[];
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
    location_type: string;
    viewport: {
      northeast: {
        lat: number;
        lng: number;
      };
      southwest: {
        lat: number;
        lng: number;
      };
    };
  };
  place_id: string;
  plus_code?: {
    compound_code: string;
    global_code: string;
  };
  types: string[];
}

interface GeocodeResponse {
  results: GeocodeResultItem[];
  status: string;
}

type ValidationResult = {
  isValid: boolean;
  message?: string;
  formattedAddress?: string;
};

/**
 * Validates if an address is in Singapore using Google Maps Geocoding API
 * 
 * @param address The address string to validate
 * @param apiKey Google Maps API key
 * @returns Object with validation result
 */
export const validateSingaporeAddress = async (
  address: string,
  apiKey: string
): Promise<ValidationResult> => {
  try {
    // Check if API key is provided
    if (!apiKey) {
      console.error("Google Maps API key is missing");
      return {
        isValid: false,
        message: "Address validation service is not configured. Please contact support.",
      };
    }

    // Form the URL for the Geocoding API request
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${apiKey}`;

    console.log("Sending request to Google Maps API");
    
    // Make the API request
    const response = await fetch(url);
    const data = await response.json();
    
    console.log("Google Maps API response status:", data.status);
    
    // Check if the API returned a valid result
    if (data.status !== "OK") {
      console.error("Google Maps API error:", data.status, data.error_message);
      return {
        isValid: false,
        message: `Address validation failed: ${data.status}${data.error_message ? ` - ${data.error_message}` : ''}`,
      };
    }

    if (!data.results || data.results.length === 0) {
      return {
        isValid: false,
        message: "Could not find the specified address",
      };
    }

    // Log the full response for debugging
    console.log("Google Maps API results:", JSON.stringify(data.results));
    
    // Check if the address is in Singapore
    let foundCountry = false;
    let isInSingapore = false;
    
    // Try to find the country in the address components
    for (const result of data.results) {
      console.log("Checking result:", result.formatted_address);
      
      for (const component of result.address_components) {
        if (component.types.includes("country")) {
          foundCountry = true;
          console.log("Found country:", component.long_name, component.short_name);
          
          if (component.short_name === "SG" || 
              component.long_name.toLowerCase() === "singapore") {
            isInSingapore = true;
          }
        }
      }
      
      // If we found a country in this result, no need to check further results
      if (foundCountry) break;
    }
    
    // If we didn't find any country component, the address might be too vague
    if (!foundCountry) {
      return {
        isValid: false,
        message: "Could not determine the country for this address. Please provide a more specific address.",
      };
    }
    
    if (!isInSingapore) {
      return {
        isValid: false,
        message: "The address is not in Singapore. We currently only deliver within Singapore.",
      };
    }

    // Address is in Singapore, return the formatted address
    return {
      isValid: true,
      formattedAddress: data.results[0].formatted_address,
    };
  } catch (error) {
    console.error("Address validation error:", error);
    return {
      isValid: false,
      message: "Error validating address. Please try again.",
    };
  }
};
