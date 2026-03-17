package com.salesforce.base;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;

import java.time.Duration;

import com.salesforce.utils.ConfigReader;

public class BaseTest {
    protected WebDriver driver;

    @BeforeMethod
    public void setUp() {
        try {
            WebDriverManager.chromedriver().setup();
            ChromeOptions options = new ChromeOptions();
            options.addArguments("--remote-allow-origins=*");
            options.addArguments("--start-maximized");
            driver = new ChromeDriver(options);
            driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
            driver.get(ConfigReader.getProperty("url"));
        } catch (Exception e) {
            throw new RuntimeException("WebDriver initialization failed: " + e.getMessage(), e);
        }
    }

    @AfterMethod
    public void tearDown() {
        try {
            if (driver != null) {
                driver.quit();
            }
        } catch (Exception e) {
            System.err.println("Error during WebDriver teardown: " + e.getMessage());
        }
    }
}
