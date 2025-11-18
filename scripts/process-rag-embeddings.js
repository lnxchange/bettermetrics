#!/usr/bin/env node

/**
 * Process RAG Document Embeddings
 * 
 * Generates embeddings for all RAG documents that don't have them yet.
 * Requires Next.js dev server to be running.
 * 
 * Usage: npm run process-rag-embeddings
 */

require('dotenv').config({ path: '.env.local' });

const API_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

async function processAllRAGDocuments() {
  console.log('🤖 RAG Document Embedding Processor\n');
  console.log('=' .repeat(50));
  
  try {
    const response = await fetch(`${API_URL}/api/admin/process-all-rag-documents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error (${response.status}): ${errorText}`);
    }
    
    const result = await response.json();
    
    console.log('\n✅ Processing Complete!');
    console.log(`   Documents processed: ${result.processed || 0}`);
    console.log(`   Errors: ${result.errors || 0}`);
    
    if (result.results && result.results.length > 0) {
      console.log('\n📄 Document Results:');
      result.results.forEach(doc => {
        if (doc.success) {
          console.log(`   ✓ ${doc.title} (${doc.chunks} chunks)`);
        } else {
          console.log(`   ✗ ${doc.title}: ${doc.error}`);
        }
      });
    }
    
    console.log('\n🎉 Your chatbot can now reference these documents!');
    console.log(`   Test it at: ${API_URL}/chat\n`);
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('\nMake sure:');
    console.error('  1. Your Next.js dev server is running (npm run dev)');
    console.error('  2. The server is accessible at', API_URL);
    console.error('  3. You have a valid OPENAI_API_KEY in .env.local\n');
    process.exit(1);
  }
}

processAllRAGDocuments();

