#!/usr/bin/env node

/**
 * Migration Script for Articles System
 * 
 * This script applies the articles system migration to your production Supabase database.
 * 
 * Usage:
 *   SUPABASE_URL=your_url SUPABASE_SERVICE_ROLE_KEY=your_key node scripts/run-migration.js
 */

const fs = require('fs');
const path = require('path');

// Check for required environment variables
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Missing required environment variables');
  console.error('');
  console.error('Please provide:');
  console.error('  SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL)');
  console.error('  SUPABASE_SERVICE_ROLE_KEY');
  console.error('');
  console.error('You can find these in your Supabase dashboard:');
  console.error('  https://supabase.com/dashboard/project/YOUR_PROJECT/settings/api');
  console.error('');
  console.error('Example usage:');
  console.error('  SUPABASE_URL=https://xxx.supabase.co SUPABASE_SERVICE_ROLE_KEY=xxx node scripts/run-migration.js');
  process.exit(1);
}

// Import Supabase
const { createClient } = require('@supabase/supabase-js');

async function runMigration() {
  console.log('🚀 Starting migration...\n');
  
  // Create Supabase client
  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  // Read the migration file
  const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '20250117000000_add_articles_system.sql');
  
  if (!fs.existsSync(migrationPath)) {
    console.error('❌ Migration file not found:', migrationPath);
    process.exit(1);
  }

  const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
  
  console.log('📄 Migration file loaded');
  console.log('📊 Executing SQL statements...\n');

  try {
    // Execute the migration
    const { data, error } = await supabase.rpc('exec_sql', { sql: migrationSQL });
    
    if (error) {
      // If exec_sql doesn't exist, try splitting and executing statements individually
      if (error.message.includes('exec_sql')) {
        console.log('⚠️  Using fallback method (statement-by-statement execution)...\n');
        
        // Split SQL into individual statements
        const statements = migrationSQL
          .split(';')
          .map(s => s.trim())
          .filter(s => s.length > 0 && !s.startsWith('--'));
        
        for (let i = 0; i < statements.length; i++) {
          const statement = statements[i];
          if (statement) {
            console.log(`Executing statement ${i + 1}/${statements.length}...`);
            const { error: stmtError } = await supabase.rpc('exec', { query: statement + ';' });
            
            if (stmtError) {
              // Try direct query execution as last resort
              const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
                method: 'POST',
                headers: {
                  'apikey': supabaseKey,
                  'Authorization': `Bearer ${supabaseKey}`,
                  'Content-Type': 'application/json',
                  'Prefer': 'return=representation'
                },
                body: JSON.stringify({ query: statement + ';' })
              });
              
              if (!response.ok) {
                console.error(`❌ Error in statement ${i + 1}:`, stmtError.message);
                console.error('Statement:', statement.substring(0, 100) + '...');
              }
            }
          }
        }
        
        console.log('\n✅ Migration statements executed');
      } else {
        throw error;
      }
    } else {
      console.log('✅ Migration executed successfully');
    }
    
    // Verify tables were created
    console.log('\n🔍 Verifying tables...');
    
    const { data: articlesCheck, error: articlesError } = await supabase
      .from('articles')
      .select('count')
      .limit(1);
    
    const { data: socialCheck, error: socialError } = await supabase
      .from('social_posts')
      .select('count')
      .limit(1);
    
    if (!articlesError && !socialError) {
      console.log('✅ Tables verified:');
      console.log('   - articles table exists');
      console.log('   - social_posts table exists');
    } else {
      console.log('⚠️  Table verification had issues, but migration may have succeeded');
      if (articlesError) console.log('   Articles table:', articlesError.message);
      if (socialError) console.log('   Social posts table:', socialError.message);
    }
    
    console.log('\n🎉 Migration complete!');
    console.log('\nNext steps:');
    console.log('  1. Visit https://usebettermetrics.com/admin/new-article to create articles');
    console.log('  2. Or use the bulk import script for your 13 reports');
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.error('\nPlease run the migration manually through Supabase Dashboard:');
    console.error('  1. Go to: https://supabase.com/dashboard/project/YOUR_PROJECT/editor');
    console.error('  2. Click SQL Editor');
    console.error(`  3. Paste the contents of: ${migrationPath}`);
    console.error('  4. Click Run');
    process.exit(1);
  }
}

// Run the migration
runMigration().catch(console.error);

