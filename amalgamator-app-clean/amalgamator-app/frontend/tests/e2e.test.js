const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

// Set up Chrome options
const options = new chrome.Options();
options.addArguments('--headless'); // Run in headless mode
options.addArguments('--no-sandbox');
options.addArguments('--disable-dev-shm-usage');

describe('Amalgamator E2E Tests', () => {
  let driver;

  beforeAll(async () => {
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
  });

  afterAll(async () => {
    await driver.quit();
  });

  test('Home page loads correctly', async () => {
    await driver.get('http://localhost:3000');
    
    // Check title
    const title = await driver.getTitle();
    expect(title).toContain('Amalgamator');
    
    // Check main heading
    const heading = await driver.findElement(By.css('h1')).getText();
    expect(heading).toContain('Amalgamator');
    
    // Check mode cards are present
    const modeCards = await driver.findElements(By.css('.MuiCard-root'));
    expect(modeCards.length).toBeGreaterThanOrEqual(3);
  }, 10000);

  test('Registration and login flow', async () => {
    // Go to register page
    await driver.get('http://localhost:3000/register');
    
    // Fill out registration form
    await driver.findElement(By.name('username')).sendKeys('e2etester');
    await driver.findElement(By.name('email')).sendKeys('e2e@test.com');
    await driver.findElement(By.name('password')).sendKeys('password123');
    await driver.findElement(By.name('confirmPassword')).sendKeys('password123');
    await driver.findElement(By.name('socialMediaLink')).sendKeys('https://twitter.com/e2etester');
    
    // Submit form
    await driver.findElement(By.css('button[type="submit"]')).click();
    
    // Wait for redirect to dashboard
    await driver.wait(until.urlContains('dashboard'), 5000);
    
    // Check if we're logged in
    const welcomeText = await driver.findElement(By.css('h4')).getText();
    expect(welcomeText).toContain('Dashboard');
    
    // Logout
    await driver.findElement(By.css('button[aria-label="account of current user"]')).click();
    await driver.findElement(By.xpath('//li[contains(text(), "Logout")]')).click();
    
    // Go to login page
    await driver.get('http://localhost:3000/login');
    
    // Fill out login form
    await driver.findElement(By.name('email')).sendKeys('e2e@test.com');
    await driver.findElement(By.name('password')).sendKeys('password123');
    
    // Submit form
    await driver.findElement(By.css('button[type="submit"]')).click();
    
    // Wait for redirect to dashboard
    await driver.wait(until.urlContains('dashboard'), 5000);
    
    // Check if we're logged in
    const dashboardText = await driver.findElement(By.css('h4')).getText();
    expect(dashboardText).toContain('Dashboard');
  }, 20000);

  test('Amalgamation explorer flow', async () => {
    // Go to explorer page
    await driver.get('http://localhost:3000/explorer');
    
    // Check mode selection
    const modeTitle = await driver.findElement(By.css('h4')).getText();
    expect(modeTitle).toContain('Choose Your Mode');
    
    // Select Play mode (default)
    const continueButton = await driver.findElement(By.xpath('//button[contains(text(), "Continue with Play Mode")]'));
    await continueButton.click();
    
    // Check term selection
    const termSelectionTitle = await driver.findElement(By.css('h4')).getText();
    expect(termSelectionTitle).toContain('Create an Amalgamation');
    
    // Select terms
    const term1Input = await driver.findElement(By.id('mui-autocomplete-0'));
    await term1Input.sendKeys('Guitar');
    await driver.wait(until.elementLocated(By.xpath('//li[contains(text(), "Guitar")]')), 5000);
    await driver.findElement(By.xpath('//li[contains(text(), "Guitar")]')).click();
    
    const term2Input = await driver.findElement(By.id('mui-autocomplete-1'));
    await term2Input.sendKeys('Snowboard');
    await driver.wait(until.elementLocated(By.xpath('//li[contains(text(), "Snowboard")]')), 5000);
    await driver.findElement(By.xpath('//li[contains(text(), "Snowboard")]')).click();
    
    // Submit
    const exploreButton = await driver.findElement(By.xpath('//button[contains(text(), "Explore Connection")]'));
    await exploreButton.click();
    
    // Wait for redirect to amalgamation detail
    await driver.wait(until.urlContains('amalgamation'), 5000);
    
    // Check if we're on the detail page
    const detailTitle = await driver.findElement(By.css('h4')).getText();
    expect(detailTitle).toContain('Exploring Connection');
  }, 30000);

  test('Contribution flow', async () => {
    // Assuming we're on an amalgamation detail page
    await driver.get('http://localhost:3000/amalgamation/new');
    
    // Select evaluation
    await driver.findElement(By.css('input[value="plausible"]')).click();
    
    // Add comment
    await driver.findElement(By.css('textarea')).sendKeys('Both require balance and body coordination to master');
    
    // Submit
    await driver.findElement(By.xpath('//button[contains(text(), "Submit")]')).click();
    
    // Check if submission was successful
    await driver.wait(until.elementLocated(By.xpath('//h5[contains(text(), "Thank you for your contribution")]')), 5000);
    
    // Check if results are shown
    const resultsTitle = await driver.findElement(By.xpath('//h5[contains(text(), "Community Results")]'));
    expect(resultsTitle).toBeTruthy();
  }, 15000);
});
