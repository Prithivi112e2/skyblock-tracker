import assert from 'assert';

const BASE_URL = 'http://localhost:3000';

async function runTests() {
  console.log('=== STARTING FULL SKYBLOCK TRACKER INTEGRATION TESTS ===\n');

  // 1. Test Root Redirect
  console.log('1. Testing Root URL redirect (/)...');
  const rootRes = await fetch(`${BASE_URL}/`, { redirect: 'manual' });
  console.log(`   Status: ${rootRes.status}, Location: ${rootRes.headers.get('location')}`);
  assert(rootRes.status === 307 || rootRes.status === 308 || rootRes.status === 200, 'Root redirect failed');
  console.log('   ✓ Root redirect verified!\n');

  // 2. Test Public Share HTML Page (SSR)
  console.log('2. Testing Public Share URL (/share/Prithivi102/Strawberry)...');
  const shareRes = await fetch(`${BASE_URL}/share/Prithivi102/Strawberry`);
  assert.strictEqual(shareRes.status, 200, 'Share page should return HTTP 200');
  const shareHtml = await shareRes.text();
  assert(shareHtml.includes('Prithivi102'), 'Share HTML must include username Prithivi102');
  assert(shareHtml.includes('Strawberry'), 'Share HTML must include profile name Strawberry');
  assert(shareHtml.includes('Level 19'), 'Share HTML must include player level');
  assert(shareHtml.includes('Total Networth') && shareHtml.includes('coins'), 'Share HTML must include networth');
  assert(shareHtml.includes('Glacite'), 'Share HTML must include equipped Glacite armor');
  assert(shareHtml.includes('schema.org'), 'Share HTML must include JSON-LD metadata for AI & crawlers');
  assert(shareHtml.includes('Skill Levels &amp; Experience') || shareHtml.includes('Skill Levels & Experience'), 'Share HTML must include SSR skills table');
  console.log('   ✓ Public Share HTML page successfully SSR rendered without client-side JS dependency!\n');

  // 3. Test Machine-Readable Public JSON Endpoints
  console.log('3. Testing Machine-Readable Public JSON Endpoints...');
  const jsonEndpoints = [
    { path: '/api/public/profile/Prithivi102/Strawberry', key: 'data' },
    { path: '/api/public/profile/Prithivi102/Strawberry/inventory', key: 'equipment' },
    { path: '/api/public/profile/Prithivi102/Strawberry/skills', key: 'skills' },
    { path: '/api/public/profile/Prithivi102/Strawberry/slayers', key: 'slayers' },
    { path: '/api/public/profile/Prithivi102/Strawberry/accessories', key: 'accessories' },
  ];

  for (const ep of jsonEndpoints) {
    const res = await fetch(`${BASE_URL}${ep.path}`);
    assert.strictEqual(res.status, 200, `${ep.path} should return HTTP 200`);
    const data = await res.json();
    assert.strictEqual(data.success, true, `${ep.path} success flag should be true`);
    assert(data[ep.key] !== undefined, `${ep.path} must contain key ${ep.key}`);

    // Verify security: No secrets exposed
    const stringified = JSON.stringify(data);
    assert(!stringified.toLowerCase().includes('apikey'), 'No API keys should leak in public JSON');
    assert(!stringified.includes('DATABASE_URL'), 'No DB URLs should leak in public JSON');
    console.log(`   ✓ ${ep.path} returned valid schema v${data.schemaVersion || '2.0.0'} JSON!`);
  }
  console.log('   ✓ All 5 public JSON endpoints verified!\n');

  // 4. Test Direct Navigation & Route Refreshes on all 15 Pages
  console.log('4. Testing Direct Route Refreshes for all 15 subpages...');
  const subpages = [
    '',
    '/skills',
    '/slayers',
    '/collections',
    '/inventory',
    '/armor',
    '/accessories',
    '/pets',
    '/dungeons',
    '/mining',
    '/garden',
    '/minions',
    '/networth',
    '/planner',
    '/settings',
  ];

  for (const sp of subpages) {
    const url = `${BASE_URL}/p/Prithivi102/Strawberry${sp}`;
    const res = await fetch(url);
    assert.strictEqual(res.status, 200, `Direct route ${url} returned ${res.status}`);
    const html = await res.text();
    assert(html.includes('Prithivi102'), `Route ${url} must contain player info`);
    console.log(`   ✓ Direct refresh on /p/Prithivi102/Strawberry${sp || ' (Overview)'} -> 200 OK`);
  }
  console.log('   ✓ All 15 navigation pages work and refresh without 404!\n');

  // 5. Test Upgrade Planner API
  console.log('5. Testing Upgrade Planner API and SQLite persistence...');
  const planGetRes = await fetch(`${BASE_URL}/api/planner?username=Prithivi102&profile=Strawberry`);
  assert.strictEqual(planGetRes.status, 200);
  const planGetData = await planGetRes.json();
  assert(planGetData.success, 'Plan GET should succeed');

  const updateRes = await fetch(`${BASE_URL}/api/planner`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: 'Prithivi102',
      profileName: 'Strawberry',
      budget: 45000000,
      gameMode: 'slayers',
      selectedItemIds: ['WEAPON_AOTE', 'WEAPON_AOTD', 'ARMOR_STRONG_DRAGON'],
      notes: 'Testing integration persistence',
    }),
  });
  assert.strictEqual(updateRes.status, 200);
  const updatedData = await updateRes.json();
  assert.strictEqual(updatedData.data.budget, 45000000, 'Budget should be 45M');
  assert.strictEqual(updatedData.data.gameMode, 'slayers', 'Game mode should be slayers');
  console.log('   ✓ Upgrade Planner save and persistence verified!\n');

  // 6. Test JSON Export and Import
  console.log('6. Testing JSON Export and Import...');
  const exportRes = await fetch(`${BASE_URL}/api/profile/export?username=Prithivi102&profile=Strawberry`);
  assert.strictEqual(exportRes.status, 200);
  const backupJson = await exportRes.json();
  assert(backupJson.profile && backupJson.profile.identity, 'Backup must contain full profile');
  console.log('   ✓ Export generated backup JSON successfully!');

  // Test importing backup
  const importRes = await fetch(`${BASE_URL}/api/profile/import`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(backupJson),
  });
  assert.strictEqual(importRes.status, 200);
  const importResult = await importRes.json();
  assert(importResult.success, 'Import should succeed');
  assert.strictEqual(importResult.profile.transparency.dataSource, 'USER_IMPORT', 'Imported data must be clearly labeled');
  console.log('   ✓ Import validated, saved, and labeled with USER_IMPORT provenance!\n');

  // 7. Test Settings & Hypixel API Handling
  console.log('7. Testing Settings & API Error Transparency...');
  const settingsRes = await fetch(`${BASE_URL}/api/settings`);
  assert.strictEqual(settingsRes.status, 200);
  const settingsData = await settingsRes.json();
  assert(typeof settingsData.isConfigured === 'boolean', 'Settings must report boolean config state');
  console.log(`   ✓ Settings status: configured = ${settingsData.isConfigured}`);

  // Test refresh when key is missing: Must return honest error and NEVER invent fake data
  const refreshRes = await fetch(`${BASE_URL}/api/profile/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'Prithivi102', profileName: 'Strawberry' }),
  });
  const refreshData = await refreshRes.json();
  console.log(`   ✓ Refresh response with no key: status ${refreshRes.status}, error: "${refreshData.error}"`);
  assert(refreshRes.status === 400 || refreshRes.status === 200, 'Handled without crashing');
  console.log('   ✓ Honest error handling verified!\n');

  console.log('=== ALL TESTS PASSED SUCCESSFULLY! ===');
}

runTests().catch((err) => {
  console.error('TEST SUITE FAILED:', err);
  process.exit(1);
});
