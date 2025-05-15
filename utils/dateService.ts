import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

export interface BlockedDatesConfig {
  blockedRanges: Array<{ start: string; end: string }>;
  blockedSingleDates: string[];
}

// Default empty values in case fetching fails
const defaultBlockedDates: BlockedDatesConfig = {
  blockedRanges: [],
  blockedSingleDates: [],
};

/**
 * Fetches blocked dates configuration from Firestore
 */
export async function getBlockedDates(): Promise<BlockedDatesConfig> {
  try {
    const docRef = doc(db, "variables", "blockeddates");
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists() && docSnap.data().value) {
      // Parse the JSON string from the value field
      const blockedDatesData = JSON.parse(docSnap.data().value);
      return blockedDatesData as BlockedDatesConfig;
    }
    
    console.warn("No blocked dates found in database, using defaults");
    return defaultBlockedDates;
  } catch (error) {
    console.error("Error fetching blocked dates:", error);
    return defaultBlockedDates;
  }
}

/**
 * Checks if a date is within blocked ranges or is a blocked single date
 */
export function isDateBlocked(date: string, blockedDates: BlockedDatesConfig): boolean {
  const formattedDate = formatDate(date);

  // Check single blocked dates
  if (blockedDates.blockedSingleDates.includes(formattedDate)) {
    return true;
  }

  // Check date ranges
  return blockedDates.blockedRanges.some((range) => {
    const dateToCheck = new Date(date);
    const rangeStart = new Date(range.start);
    const rangeEnd = new Date(range.end);
    return dateToCheck >= rangeStart && dateToCheck <= rangeEnd;
  });
}

/**
 * Formats date to YYYY-MM-DD format
 */
export function formatDate(date: string): string {
  return new Date(date).toISOString().split("T")[0];
}
