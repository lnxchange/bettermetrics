const fs = require('fs');
const path = require('path');

const APP_DIR = path.join(__dirname, '..', 'app');
const OUTPUT_FILE = path.join(__dirname, '..', 'public', 'search-index.json');

// Extract text content from JSX/TSX files
function extractContent(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Extract metadata title
  const titleMatch = content.match(/title:\s*['"`]([^'"`]+)['"`]/);
  const title = titleMatch ? titleMatch[1] : '';
  
  // Extract H1 headings
  const h1Matches = [...content.matchAll(/<h1[^>]*>(.*?)<\/h1>/gs)];
  const h1s = h1Matches.map(m => cleanText(m[1]));
  
  // Extract H2 headings with potential IDs
  const h2Matches = [...content.matchAll(/<h2[^>]*>(.*?)<\/h2>/gs)];
  const h2s = h2Matches.map(m => ({
    text: cleanText(m[1]),
    fullMatch: m[0]
  }));
  
  // Extract H3 headings
  const h3Matches = [...content.matchAll(/<h3[^>]*>(.*?)<\/h3>/gs)];
  const h3s = h3Matches.map(m => cleanText(m[1]));
  
  // Extract paragraph content (limit to avoid huge index)
  const pMatches = [...content.matchAll(/<p[^>]*>(.*?)<\/p>/gs)];
  const paragraphs = pMatches.slice(0, 20).map(m => cleanText(m[1]));
  
  return { title, h1s, h2s, h3s, paragraphs };
}

function cleanText(text) {
  return text
    .replace(/<[^>]+>/g, '') // Remove HTML tags
    .replace(/&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/{[^}]*}/g, '') // Remove JSX expressions
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
}

function generateHeadingId(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function findPageFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.startsWith('.') && !file.startsWith('_')) {
      findPageFiles(filePath, fileList);
    } else if (file === 'page.tsx' || file === 'page.ts') {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

function getUrlFromPath(filePath) {
  const relativePath = path.relative(APP_DIR, filePath);
  const dir = path.dirname(relativePath);
  
  if (dir === '.') {
    return '/';
  }
  
  return '/' + dir.replace(/\\/g, '/');
}

function generateSearchIndex() {
  console.log('🔍 Generating search index...');
  
  const pageFiles = findPageFiles(APP_DIR);
  const searchIndex = { pages: [] };
  
  pageFiles.forEach(filePath => {
    try {
      const url = getUrlFromPath(filePath);
      const { title, h1s, h2s, h3s, paragraphs } = extractContent(filePath);
      
      // Skip if no meaningful content
      if (!title && h1s.length === 0 && h2s.length === 0) {
        return;
      }
      
      const pageTitle = title || h1s[0] || 'Untitled Page';
      
      // Build sections from headings
      const sections = [];
      
      // Add main page as a section
      sections.push({
        heading: pageTitle,
        anchor: '',
        content: paragraphs.slice(0, 3).join(' ').substring(0, 300)
      });
      
      // Add H2 sections
      h2s.forEach((h2, index) => {
        const anchor = '#' + generateHeadingId(h2.text);
        const sectionContent = paragraphs.slice(index * 2, (index * 2) + 2).join(' ').substring(0, 200);
        
        sections.push({
          heading: h2.text,
          anchor: anchor,
          content: sectionContent
        });
      });
      
      searchIndex.pages.push({
        title: pageTitle,
        url: url,
        sections: sections
      });
      
      console.log(`  ✓ Indexed: ${url} - ${pageTitle}`);
    } catch (error) {
      console.error(`  ✗ Error processing ${filePath}:`, error.message);
    }
  });
  
  // Write to output file
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(searchIndex, null, 2));
  
  console.log(`\n✅ Search index generated: ${searchIndex.pages.length} pages indexed`);
  console.log(`📄 Output: ${OUTPUT_FILE}`);
}

generateSearchIndex();

