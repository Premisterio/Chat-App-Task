const axios = require('axios');
require('dotenv').config();

let quotes = [];
let lastFetchTime = 0;
const CACHE_DURATION = 3600000; // 1 hour in milliseconds

// Fetch quotes from API and store them
const fetchQuotes = async () => {
  try {
    // Check if we need to refresh the cache
    const now = Date.now();
    if (quotes.length > 0 && (now - lastFetchTime) < CACHE_DURATION) {
      return quotes;
    }

    const response = await axios.get(process.env.QUOTES_API_URL, {
      timeout: 5000, // 5 second timeout
      headers: {
        'Accept': 'application/json'
      }
    });

    if (response.data && response.data.quotes && response.data.quotes.length > 0) {
      quotes = response.data.quotes;
      lastFetchTime = now;
      console.log(`Loaded ${quotes.length} quotes successfully`);
      return quotes;
    } else {
      throw new Error('Invalid API response format');
    }
  } catch (error) {
    console.error('Error fetching quotes:', error);
    // If we have cached quotes, use them
    if (quotes.length > 0) {
      console.log('Using cached quotes');
      return quotes;
    }
    // Otherwise use fallback quotes
    quotes = [
      { quote: "Life isn't about getting and having, it's about giving and being.", author: "Kevin Kruse" },
      { quote: "Whatever the mind of man can conceive and believe, it can achieve.", author: "Napoleon Hill" },
      { quote: "Strive not to be a success, but rather to be of value.", author: "Albert Einstein" },
      { quote: "The mind is everything. What you think you become.", author: "Buddha" },
      { quote: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" }
    ];
    lastFetchTime = now;
    console.log('Using fallback quotes');
    return quotes;
  }
};

// Get a random quote
const getRandomQuote = async () => {
  try {
    // Ensure quotes are loaded
    await fetchQuotes();
    
    // Get a random quote
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    
    return `"${randomQuote.quote}" - ${randomQuote.author}`;
  } catch (error) {
    console.error('Error getting random quote:', error);
    return `"The best way to predict the future is to create it." - Peter Drucker`;
  }
};

// Initialize quotes when the service starts
fetchQuotes().catch(console.error);

module.exports = {
  fetchQuotes,
  getRandomQuote
};