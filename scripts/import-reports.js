#!/usr/bin/env node

/**
 * Intelligent Markdown Report Import Script
 * 
 * Automatically extracts metadata from markdown files and uploads to database.
 * No manual frontmatter needed - everything is extracted from content!
 * 
 * Usage: npm run import-reports
 */

const fs = require('fs');
const path = require('path');
const { marked } = require('marked');
const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const REPORTS_DIR = path.join(__dirname, '..', 'content', 'reports');
const API_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

// Initialize Supabase client with service role key for admin access
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('\n❌ Error: Missing Supabase credentials');
  console.error('Required environment variables:');
  console.error('  - NEXT_PUBLIC_SUPABASE_URL');
  console.error('  - SUPABASE_SERVICE_ROLE_KEY');
  console.error('\nAdd these to your .env.local file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Category detection keywords
const CATEGORY_KEYWORDS = {
  'Economics': ['economic', 'market', 'consumer', 'pricing', 'supply', 'demand', 'financial', 'monetary', 'fiscal', 'trade'],
  'Psychology': ['psychology', 'psychological', 'behavior', 'behaviour', 'sdt', 'self-determination', 'cognitive', 'mental'],
  'Neuroscience': ['neuroscience', 'neural', 'brain', 'neurological', 'neuron', 'cortex', 'dopamine', 'limbic'],
  'Organizational Behavior': ['organization', 'organizational', 'workplace', 'leadership', 'management', 'team', 'corporate', 'business'],
  'Education': ['education', 'educational', 'learning', 'teaching', 'student', 'classroom', 'pedagogy', 'curriculum'],
  'Health': ['health', 'medical', 'clinical', 'patient', 'healthcare', 'wellness', 'therapy', 'treatment']
};

// Core AIM Framework terms
const AIM_TERMS = ['appetites', 'intrinsic motivation', 'mimetic desire', 'aim framework', 'motivational sources'];

/**
 * Extract title from markdown content
 */
function extractTitle(content, filename) {
  // Try to find first H1 heading
  const h1Match = content.match(/^#\s+(.+)$/m);
  if (h1Match) {
    return h1Match[1].trim();
  }
  
  // Fallback to filename
  return filename
    .replace(/\.md$/i, '')
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Generate slug from title
 */
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

/**
 * Detect category from content
 */
function detectCategory(content) {
  const lowerContent = content.toLowerCase();
  
  let bestCategory = 'Research';
  let highestScore = 0;
  
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    let score = 0;
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      const matches = lowerContent.match(regex);
      if (matches) {
        score += matches.length;
      }
    });
    
    if (score > highestScore) {
      highestScore = score;
      bestCategory = category;
    }
  }
  
  return bestCategory;
}

/**
 * Extract meaningful tags from content
 */
function extractTags(content, category) {
  const lowerContent = content.toLowerCase();
  const tags = new Set(['AIM Framework']); // Always include
  
  // Check for AIM Framework terms
  AIM_TERMS.forEach(term => {
    if (lowerContent.includes(term.toLowerCase())) {
      tags.add(term.charAt(0).toUpperCase() + term.slice(1));
    }
  });
  
  // Add category-related tag
  if (category !== 'Research') {
    tags.add(category);
  }
  
  // Extract frequent meaningful words (nouns/phrases)
  const commonWords = ['the', 'and', 'for', 'with', 'this', 'that', 'from', 'have', 'will', 'can', 'are', 'was', 'were', 'been', 'being'];
  const words = content
    .toLowerCase()
    .replace(/[^a-z\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 4 && !commonWords.includes(word));
  
  // Count word frequency
  const wordCount = {};
  words.forEach(word => {
    wordCount[word] = (wordCount[word] || 0) + 1;
  });
  
  // Get top words
  const topWords = Object.entries(wordCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([word]) => word);
  
  // Add relevant words as tags
  const relevantWords = ['motivation', 'behavior', 'behaviour', 'decision', 'choices', 'preferences', 'social', 'biological', 'cognitive'];
  topWords.forEach(word => {
    if (relevantWords.includes(word) && tags.size < 7) {
      tags.add(word.charAt(0).toUpperCase() + word.slice(1));
    }
  });
  
  return Array.from(tags).slice(0, 7); // Max 7 tags
}

/**
 * Generate meta description from content
 */
function generateMetaDescription(content, title) {
  // Remove markdown formatting
  const plainText = content
    .replace(/^#.*$/gm, '') // Remove headings
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Remove links
    .replace(/[*_~`]/g, '') // Remove formatting
    .replace(/\n+/g, ' ')
    .trim();
  
  // Get first few sentences
  const sentences = plainText.match(/[^.!?]+[.!?]+/g) || [];
  let description = '';
  
  for (const sentence of sentences) {
    if (description.length + sentence.length <= 155) {
      description += sentence.trim() + ' ';
    } else {
      break;
    }
  }
  
  // If too short, take first 160 chars
  if (description.length < 100) {
    description = plainText.substring(0, 155);
  }
  
  // Ensure it ends properly
  description = description.trim();
  if (description.length > 160) {
    description = description.substring(0, 157) + '...';
  } else if (!description.match(/[.!?]$/)) {
    description += '...';
  }
  
  return description;
}

/**
 * Parse markdown file and extract metadata
 */
function parseMarkdownFile(filepath) {
  const filename = path.basename(filepath);
  const content = fs.readFileSync(filepath, 'utf8');
  
  console.log(`\n📝 Processing: ${filename}`);
  
  // Check for frontmatter (if user added it manually)
  let metadata = {};
  let markdownContent = content;
  
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (frontmatterMatch) {
    // Parse YAML frontmatter
    const frontmatter = frontmatterMatch[1];
    markdownContent = frontmatterMatch[2];
    
    frontmatter.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split(':');
      if (key && valueParts.length) {
        const value = valueParts.join(':').trim();
        metadata[key.trim()] = value;
      }
    });
  }
  
  // Extract metadata (use manual frontmatter if provided, otherwise auto-extract)
  const title = metadata.title || extractTitle(markdownContent, filename);
  const slug = metadata.slug || generateSlug(title);
  const category = metadata.category || detectCategory(markdownContent);
  const tags = metadata.tags ? 
    metadata.tags.split(',').map(t => t.trim()) : 
    extractTags(markdownContent, category);
  const metaDescription = metadata.meta_description || 
    metadata.description || 
    generateMetaDescription(markdownContent, title);
  
  console.log(`  ✓ Title: "${title}"`);
  console.log(`  ✓ Slug: ${slug}`);
  console.log(`  ✓ Category: ${category}`);
  console.log(`  ✓ Tags: ${tags.join(', ')}`);
  console.log(`  ✓ Meta description: ${metaDescription.substring(0, 50)}...`);
  
  return {
    title,
    slug,
    content: markdownContent,
    author: metadata.author || 'Yule Guttenbeil',
    category,
    tags: tags.join(', '),
    metaDescription,
    status: metadata.status || 'draft',
    featuredImage: metadata.featured_image || metadata.image || '',
    linkedinMessage: metadata.linkedin_message || '',
    facebookMessage: metadata.facebook_message || '',
    xMessage: metadata.x_message || ''
  };
}

/**
 * Upload article to database via Supabase
 */
async function uploadArticle(articleData) {
  try {
    // Get current user ID (you need to be authenticated)
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    let userId = null;
    if (!authError && user) {
      userId = user.id;
    } else {
      // If not authenticated, we can still insert with null user_id (for service role)
      console.log('  ⚠️  No authenticated user, using service role');
    }
    
    // Prepare article data for database
    const articleRecord = {
      title: articleData.title,
      slug: articleData.slug,
      content: articleData.content,
      author: articleData.author,
      category: articleData.category,
      tags: articleData.tags.split(',').map(t => t.trim()),
      featured_image_url: articleData.featuredImage || null,
      meta_title: articleData.title,
      meta_description: articleData.metaDescription,
      status: articleData.status || 'draft',
      user_id: userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Insert into database
    const { data, error } = await supabase
      .from('articles')
      .insert(articleRecord)
      .select()
      .single();
    
    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }
    
    console.log(`  ✓ Uploaded to articles (ID: ${data.id})`);
    return data;
  } catch (error) {
    console.error(`  ✗ Upload error: ${error.message}`);
    throw error;
  }
}

/**
 * Upload document to RAG system (without processing embeddings)
 * Embeddings can be generated later from the admin panel
 */
async function uploadToRAG(articleData) {
  try {
    // Get current user ID
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    let userId = null;
    if (!authError && user) {
      userId = user.id;
    }
    
    // Prepare RAG document record
    const ragRecord = {
      title: articleData.title,
      content: articleData.content,
      uploaded_by: userId,
      file_type: 'text/markdown',
      metadata: {
        category: articleData.category,
        tags: articleData.tags.split(',').map(t => t.trim()),
        author: articleData.author,
        slug: articleData.slug,
        source: 'report_import'
      },
      created_at: new Date().toISOString()
    };
    
    // Insert into rag_documents table
    const { data: ragDoc, error: ragError } = await supabase
      .from('rag_documents')
      .insert(ragRecord)
      .select()
      .single();
    
    if (ragError) {
      throw new Error(`RAG database error: ${ragError.message}`);
    }
    
    console.log(`  ✓ Added to RAG (ID: ${ragDoc.id})`);
    console.log(`  ⏳ Embeddings pending (process manually from admin panel)`);
    
    return ragDoc;
  } catch (error) {
    console.error(`  ✗ RAG upload error: ${error.message}`);
    throw error;
  }
}

/**
 * Main import function
 */
async function importReports() {
  console.log('📚 AIM Framework Report Importer\n');
  console.log('=' .repeat(50));
  
  // Check if reports directory exists
  if (!fs.existsSync(REPORTS_DIR)) {
    console.error(`\n❌ Reports directory not found: ${REPORTS_DIR}`);
    console.log('\nPlease create the directory and add your markdown files:');
    console.log(`  mkdir -p ${REPORTS_DIR}`);
    process.exit(1);
  }
  
  // Find all markdown files
  const files = fs.readdirSync(REPORTS_DIR)
    .filter(file => file.endsWith('.md'))
    .sort();
  
  if (files.length === 0) {
    console.log(`\n📭 No markdown files found in ${REPORTS_DIR}`);
    console.log('\nAdd your .md files to this directory and run again.');
    process.exit(0);
  }
  
  console.log(`\nFound ${files.length} markdown file(s)\n`);
  
  const results = {
    total: files.length,
    successful: 0,
    failed: 0,
    ragSuccessful: 0,
    ragFailed: 0,
    categories: {}
  };
  
  // Process each file
  for (const file of files) {
    const filepath = path.join(REPORTS_DIR, file);
    
    try {
      const articleData = parseMarkdownFile(filepath);
      
      // Track categories
      results.categories[articleData.category] = 
        (results.categories[articleData.category] || 0) + 1;
      
      // Try to upload article to database (may fail if duplicate)
      try {
        await uploadArticle(articleData);
        results.successful++;
      } catch (articleError) {
        console.error(`  ✗ Article upload failed: ${articleError.message}`);
        results.failed++;
      }
      
      // Always try to upload to RAG system (independent of article upload)
      try {
        await uploadToRAG(articleData);
        results.ragSuccessful++;
      } catch (ragError) {
        console.error(`  ⚠️  RAG upload failed: ${ragError.message}`);
        results.ragFailed++;
      }
      
      // Small delay between uploads to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      console.error(`  ✗ Failed to process file: ${error.message}`);
      results.failed++;
    }
  }
  
  // Print summary
  console.log('\n' + '='.repeat(50));
  console.log('\n📊 Import Summary:');
  console.log(`   Total files: ${results.total}`);
  console.log(`\n   Articles:`);
  console.log(`   ✅ Successful: ${results.successful}`);
  console.log(`   ❌ Failed: ${results.failed}`);
  console.log(`\n   RAG Documents (Chatbot):`);
  console.log(`   ✅ Successful: ${results.ragSuccessful}`);
  console.log(`   ❌ Failed: ${results.ragFailed}`);
  
  if (Object.keys(results.categories).length > 0) {
    console.log('\n📁 Categories:');
    Object.entries(results.categories)
      .sort((a, b) => b[1] - a[1])
      .forEach(([category, count]) => {
        console.log(`   - ${category}: ${count} article(s)`);
      });
  }
  
  if (results.successful > 0) {
    console.log('\n✅ Articles uploaded to database!');
    console.log(`   View your articles at: ${API_URL}/admin/articles`);
    console.log(`   Published articles will appear at: ${API_URL}/articles/[slug]`);
  }
  
  if (results.ragSuccessful > 0) {
    console.log('\n🤖 RAG Documents uploaded successfully!');
    console.log(`   ${results.ragSuccessful} documents added to RAG system`);
    console.log(`\n⚠️  IMPORTANT: Embeddings not yet generated`);
    console.log(`   To make these documents searchable by the chatbot:`);
    console.log(`   1. Log into admin panel: ${API_URL}/admin/rag-documents`);
    console.log(`   2. Click "Process All Documents" button`);
    console.log(`   3. Or run: npm run process-rag-embeddings (requires dev server)\n`);
  } else if (results.ragFailed > 0) {
    console.log('\n⚠️  Some RAG uploads failed. Reports are saved as articles but not available to chatbot.\n');
  }
}

// Run the importer
importReports().catch(error => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});

