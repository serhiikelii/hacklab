#!/usr/bin/env node

/**
 * Analyze current Supabase database schema via API
 * This script queries the actual DB state, ignoring migration files
 */

import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const SUPABASE_URL = 'https://leiornbrnenbaabeqawk.supabase.co'
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxlaW9ybmJybmVuYmFhYmVxYXdrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTU4ODQ1MCwiZXhwIjoyMDc3MTY0NDUwfQ.vN_S0ib5x1aIqJC7BzDylxIt929zvascaZdxitTRUDA'

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

async function getTableSchema(tableName) {
  console.log(`\n📊 Analyzing table: ${tableName}`)

  const { data, error } = await supabase
    .from(tableName)
    .select('*')
    .limit(1)

  if (error) {
    console.error(`❌ Error: ${error.message}`)
    return null
  }

  return data
}

async function getAllTables() {
  const { data, error } = await supabase.rpc('get_tables_info')

  if (error) {
    console.log('⚠️  Using manual table discovery...')
    // Fallback: try known tables
    return [
      'device_categories',
      'device_models',
      'services',
      'category_services',
      'prices',
      'admins',
      'audit_log'
    ]
  }

  return data
}

async function getTableData(tableName) {
  const { data, error, count } = await supabase
    .from(tableName)
    .select('*', { count: 'exact' })

  if (error) {
    console.error(`❌ ${tableName}: ${error.message}`)
    return { count: 0, sample: null }
  }

  return { count, sample: data?.slice(0, 3) }
}

async function analyzeDatabase() {
  console.log('🔍 Starting database analysis...\n')

  const analysis = {
    timestamp: new Date().toISOString(),
    tables: {}
  }

  const tables = await getAllTables()

  for (const tableName of tables) {
    const { count, sample } = await getTableData(tableName)

    console.log(`\n📦 ${tableName}:`)
    console.log(`   Rows: ${count}`)

    if (sample && sample.length > 0) {
      const columns = Object.keys(sample[0])
      console.log(`   Columns: ${columns.join(', ')}`)

      analysis.tables[tableName] = {
        row_count: count,
        columns: columns,
        sample_data: sample
      }
    }
  }

  // Save analysis
  const outputPath = 'docs/DATABASE_ANALYSIS.json'
  fs.writeFileSync(outputPath, JSON.stringify(analysis, null, 2))
  console.log(`\n✅ Analysis saved to: ${outputPath}`)

  return analysis
}

// Run analysis
analyzeDatabase().catch(console.error)
