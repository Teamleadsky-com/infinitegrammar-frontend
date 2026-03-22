import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputDir = path.resolve(__dirname, '../public/images/articles');
fs.mkdirSync(outputDir, { recursive: true });

const baseUrl = 'https://www.infinitegrammar.de';

const browser = await puppeteer.launch({
  headless: 'new',
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

const page = await browser.newPage();
await page.setViewport({ width: 1400, height: 900 });

// Set localStorage to simulate admin login
await page.goto(baseUrl, { waitUntil: 'networkidle0', timeout: 30000 });
await page.evaluate(() => {
  const user = { id: 'admin', email: 'aleksandr.zuravliov1@gmail.com', name: 'Alex' };
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('isLoggedIn', 'true');
});

console.log('Auth set. Navigating to admin...');
await page.goto(`${baseUrl}/admin`, { waitUntil: 'networkidle0', timeout: 30000 });
await new Promise(r => setTimeout(r, 3000));

// Click Similarity tab
const tabs = await page.$$('button[role="tab"]');
for (const tab of tabs) {
  const text = await page.evaluate(el => el.textContent, tab);
  if (text && text.includes('Similarity')) {
    await tab.click();
    console.log('Clicked Similarity tab');
    break;
  }
}
await new Promise(r => setTimeout(r, 4000));

// Click on a section with data
const sectionRows = await page.$$('table tbody tr');
for (const row of sectionRows) {
  const rowText = await page.evaluate(el => el.textContent, row);
  if (rowText && /0\.\d+/.test(rowText)) {
    await row.click();
    console.log(`Clicked section: ${rowText.substring(0, 60)}...`);
    break;
  }
}
await new Promise(r => setTimeout(r, 5000));

// Screenshot: Dendrogram (scroll to it)
await page.evaluate(() => {
  const h = [...document.querySelectorAll('h3, h4, p')].find(
    el => el.textContent && el.textContent.includes('Exercise Clustering')
  );
  if (h) h.scrollIntoView({ block: 'start' });
});
await new Promise(r => setTimeout(r, 500));
// Already have good dendrogram screenshot, keep it as admin-similarity-heatmap.png (rename later)

// Screenshot: Heatmap - scroll to the "Similarity Heatmap" heading
await page.evaluate(() => {
  const h = [...document.querySelectorAll('h3, h4, p')].find(
    el => el.textContent && el.textContent.trim() === 'Similarity Heatmap'
  );
  if (h) h.scrollIntoView({ block: 'start' });
});
await new Promise(r => setTimeout(r, 1000));

// Use a taller viewport to capture more of the heatmap
await page.setViewport({ width: 1400, height: 1200 });
await new Promise(r => setTimeout(r, 500));
await page.screenshot({
  path: path.join(outputDir, 'admin-similarity-heatmap-grid.png'),
  type: 'png'
});
console.log('✓ admin-similarity-heatmap-grid.png');

// Reset viewport
await page.setViewport({ width: 1400, height: 900 });

// Scroll to Top Similar Pairs and click the first div with cursor-pointer
await page.evaluate(() => {
  const headings = [...document.querySelectorAll('h3, h4')];
  const h = headings.find(el => el.textContent && el.textContent.includes('Top Similar Pairs'));
  if (h) h.scrollIntoView({ block: 'start' });
});
await new Promise(r => setTimeout(r, 1000));

// Click on the first clickable pair row (div with cursor-pointer class)
const pairClicked = await page.evaluate(() => {
  const divs = document.querySelectorAll('div.cursor-pointer');
  for (const div of divs) {
    const text = div.textContent || '';
    // Top Similar Pairs rows contain similarity scores like "0.75"
    if (/0\.\d+/.test(text) && text.length < 300) {
      div.click();
      return text.substring(0, 80);
    }
  }
  return 'no-click';
});
console.log(`Pair click result: ${pairClicked}`);
await new Promise(r => setTimeout(r, 4000));

const dialogOpen = await page.evaluate(() => {
  return document.querySelector('[role="dialog"]') ? 'open' : 'closed';
});
console.log(`Dialog state: ${dialogOpen}`);

if (dialogOpen === 'open') {
  await page.screenshot({
    path: path.join(outputDir, 'admin-similarity-pair-detail.png'),
    type: 'png'
  });
  console.log('✓ admin-similarity-pair-detail.png');
} else {
  console.log('Dialog still did not open. Trying heatmap cell click via Puppeteer...');
  // Scroll to heatmap and use Puppeteer click (not evaluate click)
  await page.evaluate(() => {
    const h = [...document.querySelectorAll('h3, h4, p')].find(
      el => el.textContent && el.textContent.trim() === 'Similarity Heatmap'
    );
    if (h) h.scrollIntoView({ block: 'start' });
  });
  await new Promise(r => setTimeout(r, 1000));

  // Find a colored cell's bounding box and click it with Puppeteer
  const cellBox = await page.evaluate(() => {
    const tds = document.querySelectorAll('td');
    for (const td of tds) {
      const bg = window.getComputedStyle(td).backgroundColor;
      if (!bg || bg === 'rgba(0, 0, 0, 0)' || bg === 'rgb(255, 255, 255)') continue;
      const rect = td.getBoundingClientRect();
      if (rect.width > 5 && rect.width < 50 && rect.height > 5) {
        return { x: rect.x + rect.width/2, y: rect.y + rect.height/2 };
      }
    }
    return null;
  });

  if (cellBox) {
    await page.mouse.click(cellBox.x, cellBox.y);
    console.log(`Clicked cell at ${cellBox.x}, ${cellBox.y}`);
    await new Promise(r => setTimeout(r, 4000));

    const d2 = await page.evaluate(() => document.querySelector('[role="dialog"]') ? 'open' : 'closed');
    console.log(`Dialog state after mouse click: ${d2}`);
    if (d2 === 'open') {
      await page.screenshot({
        path: path.join(outputDir, 'admin-similarity-pair-detail.png'),
        type: 'png'
      });
      console.log('✓ admin-similarity-pair-detail.png');
    }
  }
}

console.log('\nDone!');
await browser.close();
