const puppeteer = require('puppeteer');

async function fetchFutbinPrices() {
  const browser = await puppeteer.launch({ headless: true }); // Launch a headless browser
  const page = await browser.newPage(); // Open a new page

  // Set headers to simulate a real browser
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36');
  await page.setViewport({ width: 1280, height: 800 }); // Set the viewport to simulate a standard screen size

  // Go to Futbin's player page
  await page.goto('https://www.futbin.com/25/player/57209/zamn-they-dont-check-this', { waitUntil: 'domcontentloaded' });

  // Wait for the page to load completely
  await page.waitForSelector('.price-box-original-player'); // Wait for the price-box-original-player divs to appear
  await page.waitForSelector('.narrow-table'); // Wait for the narrow-table to appear

  // Extract player names from the table and prices from divs with class 'price-box-original-player'
  const data = await page.evaluate(() => {
    // Extract the player name from the first row in the .narrow-table
    const nameRow = document.querySelector('.narrow-table tbody tr'); // Get the first row in the table
    const playerName = nameRow ? nameRow.querySelector('td') ? nameRow.querySelector('td').textContent.trim() : null : null;

    const priceDivs = document.querySelectorAll('.price-box-original-player'); // Select all divs with class 'price-box-original-player'
    
    // Extract the price numbers within these divs
    const prices = Array.from(priceDivs).map(div => {
      const priceElement = div.querySelector('.price'); // Find the .price element within each div
      return priceElement ? priceElement.textContent.trim() : null; // Extract price or return null if not found
    }).filter(price => price !== null); // Remove null values from the array

    return { playerName, prices }; // Return both the player name and prices
  });

  console.log('Player Name:', data.playerName); // Log the player name
  console.log('Prices:', data.prices); // Log the extracted prices

  await browser.close(); // Close the browser
}

fetchFutbinPrices().catch(console.error);
