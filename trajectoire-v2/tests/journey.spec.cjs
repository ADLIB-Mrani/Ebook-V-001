const {test,expect}=require('@playwright/test');

async function createGoal(page,goal='Devenir développeur web en 6 mois'){
  await page.locator('#goal').fill(goal);
  await page.locator('#months').selectOption('6');
  await page.locator('#hoursPerWeek').fill('8');
  await page.locator('#profile-form button[type=submit]').click();
  await expect(page.locator('#workspace')).toBeVisible();
  await expect(page.locator('#dash-title')).toContainText(goal);
}

test('créer un objectif, suivre une tâche et retrouver son progrès après rechargement',async({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('');
  await expect(page.locator('#setup')).toBeVisible();
  await createGoal(page);
  await expect(page.locator('#next-actions input[data-task]').first()).toBeVisible();
  await page.locator('#next-actions input[data-task]').first().check();
  await expect(page.locator('#metric-done')).toContainText('1 /');
  await page.reload();
  await expect(page.locator('#metric-done')).toContainText('1 /');
  expect(errors).toEqual([]);
});

test('plusieurs objectifs, basculement et sauvegarde complète',async({page})=>{
  await page.goto('');
  await createGoal(page);
  await page.locator('#new-goal').click();
  await expect(page.locator('#setup')).toBeVisible();
  await createGoal(page,'Créer une entreprise en 3 mois');
  await expect(page.locator('#goal-switch option')).toHaveCount(2);
  await page.locator('#goal-switch').selectOption({index:0});
  await expect(page.locator('#dash-title')).toContainText('développeur web');
  const download=page.waitForEvent('download');
  await page.locator('#backup-all').click();
  expect((await download).suggestedFilename()).toContain('tous-les-objectifs');
  await page.reload();
  await expect(page.locator('#goal-switch option')).toHaveCount(2);
});

test('mini-diagnostic : bilan visible, progrès conservé et ebook mis à jour',async({page})=>{
  await page.goto('');
  await createGoal(page);
  await page.locator('#next-actions input[data-task]').first().check();
  await expect(page.locator('#metric-done')).toContainText('1 /');
  await expect(page.locator('#diagnostic-form')).toBeVisible();
  for(let i=0;i<4;i++)await page.locator('input[name="diag-'+i+'"]').first().check();
  page.once('dialog',d=>d.accept());
  await page.locator('#diagnostic-form button[type=submit]').click();
  await expect(page.locator('#diagnostic-result')).toContainText('Dernier bilan');
  await expect(page.locator('#metric-done')).toContainText('1 /');
  await page.locator('[data-view="book"]').click();
  await expect(page.locator('#book-preview')).toContainText('Mini-diagnostics');
});

test('source personnalisée, suggestions et export sans exécution automatique',async({page})=>{
  await page.goto('');
  await createGoal(page);
  await page.locator('[data-view="sources"]').click();
  await page.locator('#source-url').fill('https://developer.mozilla.org/fr/docs/Web/JavaScript');
  await page.locator('#source-title').fill('JavaScript DOM');
  await page.locator('#source-note').fill('Apprendre JavaScript et comprendre le DOM et les tests');
  await page.locator('#source-form button[type=submit]').click();
  await expect(page.locator('#source-list')).toContainText('JavaScript DOM');
  await page.locator('#analyze-sources').click();
  await expect(page.locator('#source-suggestions')).toContainText('JavaScript DOM');
  const download=page.waitForEvent('download');
  await page.locator('#manifest-btn').click();
  expect((await download).suggestedFilename()).toContain('regroupement-sources');
  await page.locator('[data-view="book"]').click();
  await expect(page.locator('#book-preview')).toContainText('Sources fournies');
});

test('navigation mobile sans débordement horizontal majeur',async({page,isMobile})=>{
  await page.goto('');
  await expect(page.locator('#profile-form')).toBeVisible();
  const sizes=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth}));
  expect(sizes.scroll-sizes.width).toBeLessThanOrEqual(isMobile?8:8);
});