import { defineConfig } from '@playwright/test'

const port = process.env.E2E_PORT || '3000'
const baseURL = process.env.E2E_BASE_URL || `http://127.0.0.1:${port}`

export default defineConfig({
  testDir: 'e2e',
  timeout: 60_000,
  use: { baseURL },
  webServer: process.env.E2E_NO_SERVER
    ? undefined
    : {
        command: 'npm run dev -- --port ' + port,
        url: baseURL,
        reuseExistingServer: true,
        timeout: 120_000
      }
})
