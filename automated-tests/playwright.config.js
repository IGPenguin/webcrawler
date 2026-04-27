module.exports = {
  testDir: '.',
  use: {
    baseURL: 'http://localhost:4000',
    viewport: { width: 393, height: 852 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
  },
  webServer: {
    command: 'bundle exec jekyll serve --port 4000 --no-watch',
    port: 4000,
    timeout: 120_000,
    reuseExistingServer: !process.env.CI,
  },
};
