/**
 * Formats a number into a human-readable string with K suffix for thousands
 * @param {number} count - The number to format
 * @returns {string|number} - Formatted number (e.g., 1K) or original number if less than 1000
 */
export const formatCount = (count) => {
  if (!count) return 0;
  
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`.replace('.0K', 'K');
  }
  
  return count;
}; 