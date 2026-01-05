import puppeteer from 'puppeteer';
import { createServer } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Pages to prerender for SEO
const PAGES = [
  '/grammatik',
  '/grammatik/a1',
  '/grammatik/a2',
  '/grammatik/b1',
  '/grammatik/b2',
  '/grammatik/c1',
  '/pruefungszentren',
];

async function prerender() {
  console.log('Starting prerender process...');

  const distDir = path.resolve(__dirname, '../dist');

  // Start a local server to serve the built app
  console.log('Starting preview server...');
  const server = await createServer({
    root: distDir,
    server: { port: 4173 },
    configFile: false,
  });

  await server.listen();
  const baseUrl = 'http://localhost:4173';
  console.log(`Preview server running at ${baseUrl}`);

  // Launch browser
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();

    // Set viewport for consistent rendering
    await page.setViewport({ width: 1920, height: 1080 });

    // Prerender each page
    for (const pagePath of PAGES) {
      console.log(`Prerendering ${pagePath}...`);

      try {
        const url = `${baseUrl}${pagePath}`;

        // Navigate and wait for page to be fully loaded
        await page.goto(url, {
          waitUntil: 'networkidle0',
          timeout: 30000,
        });

        // Wait a bit more for React to hydrate
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Get the rendered HTML
        const html = await page.content();

        // Determine output path
        let outputPath;
        if (pagePath === '/') {
          outputPath = path.join(distDir, 'index.html');
        } else {
          const dirPath = path.join(distDir, pagePath);
          fs.mkdirSync(dirPath, { recursive: true });
          outputPath = path.join(dirPath, 'index.html');
        }

        // Write the HTML
        fs.writeFileSync(outputPath, html);
        console.log(`✓ Saved: ${outputPath}`);
      } catch (error) {
        console.error(`✗ Failed to prerender ${pagePath}:`, error.message);
      }
    }

    console.log('\nPrerendering complete!');
  } finally {
    await browser.close();
    await server.close();
  }
}

// Run the prerender
prerender().catch((error) => {
  console.error('Prerender failed:', error);
  process.exit(1);
});
