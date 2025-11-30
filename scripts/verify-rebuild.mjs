#!/usr/bin/env node

/**
 * Verify database rebuild via Management API
 */

const SUPABASE_ACCESS_TOKEN = 'sbp_d7c69b05f0883145037aa88c3f0638bdf07fbf4d';
const PROJECT_REF = 'leiornbrnenbaabeqawk';

async function executeSql(sql) {
  const response = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SUPABASE_ACCESS_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query: sql })
  });

  const result = await response.json();

  if (!response.ok) {
    console.error('❌ Error:', result);
    return null;
  }

  return result;
}

console.log('🔍 Verifying database state via Management API...\n');

const checkQuery = `
SELECT
  'device_categories' as table_name,
  COUNT(*)::int as count
FROM device_categories
UNION ALL
SELECT 'device_models', COUNT(*)::int FROM device_models
UNION ALL
SELECT 'services', COUNT(*)::int FROM services
UNION ALL
SELECT 'category_services', COUNT(*)::int FROM category_services
UNION ALL
SELECT 'prices', COUNT(*)::int FROM prices
UNION ALL
SELECT 'discounts', COUNT(*)::int FROM discounts;
`;

const result = await executeSql(checkQuery);

if (result) {
  console.log('📊 Database counts:\n');
  result.forEach(row => {
    const expected = {
      'device_categories': 4,
      'device_models': 111,
      'services': 15,
      'category_services': 24,
      'prices': 606,
      'discounts': 3
    }[row.table_name];

    const status = row.count === expected ? '✅' : '❌';
    console.log(`   ${row.table_name}: ${row.count} ${status} (expected: ${expected})`);
  });
}
