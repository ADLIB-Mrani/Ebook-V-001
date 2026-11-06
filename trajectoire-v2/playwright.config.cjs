const { defineConfig, devices } = require('@playwright/test');
module.exports = defineConfig({
  testDir: './tests',
  timeout: 30000,
  expect: { timeout: 8000 },
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['line'],['html',{open:'never',outputFolder:'playwright-report'}]] : 'list',
  use: { baseURL: 'http://127.0.0.1:8123/trajectoire-v2/', trace: 'retain-on-failure' },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } }
  ],
  webServer: {
    command: 'python3 -m http.server 8123 --directory ..',
    cwd: __dirname,
    url: 'http://127.0.0.1:8123/trajectoire-v2/',
    reuseExistingServer: !process.env.CI,
    timeout: 30000
  }
});