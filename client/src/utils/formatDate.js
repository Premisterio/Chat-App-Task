/**
 * Format a date for display in the UI
 * 
 * @param {Date|string} date - The date to format
 * @returns {string} - Formatted date string
 */


export const formatDate = (date) => {
    if (!date) return '';
  
    const dateObj = new Date(date);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (dateObj >= today) {
      return dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    if (dateObj >= yesterday) {
      return 'Yesterday';
    }

    if (dateObj.getFullYear() === now.getFullYear()) {
      return dateObj.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
 
    return dateObj.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });
  };