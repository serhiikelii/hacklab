const SUPABASE_ACCESS_TOKEN = 'sbp_d7c69b05f0883145037aa88c3f0638bdf07fbf4d';
const PROJECT_REF = 'leiornbrnenbaabeqawk';

const sql = `
SELECT dm.slug, dm.image_url
FROM device_models dm
JOIN device_categories dc ON dm.category_id = dc.id
WHERE dc.slug IN ('apple-watch', 'macbook') AND dm.image_url IS NOT NULL
ORDER BY dc.slug, dm.slug;
`;

const response = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${SUPABASE_ACCESS_TOKEN}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    query: sql
  })
});

const result = await response.json();
console.log('Результат запроса:', JSON.stringify(result, null, 2));
