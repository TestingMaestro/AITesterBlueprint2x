package com.salesforce.tests;

import com.salesforce.base.BaseTest;
import com.salesforce.pages.LoginPage;
import io.qameta.allure.Description;
import io.qameta.allure.Severity;
import io.qameta.allure.SeverityLevel;
import org.testng.Assert;
import org.testng.annotations.Test;
import com.salesforce.utils.ConfigReader;

public class LoginTest extends BaseTest {

    @Test(priority = 1, description = "Verify Login with Valid Credentials")
    @Severity(SeverityLevel.CRITICAL)
    @Description("Test Description: Login into Salesforce with valid username and valid password.")
    public void testValidLogin() {
        try {
            LoginPage loginPage = new LoginPage(driver);
            loginPage.enterUsername(ConfigReader.getProperty("valid.username"));
            loginPage.enterPassword(ConfigReader.getProperty("valid.password"));
            loginPage.toggleRememberMe();
            loginPage.clickLoginButton();
            
            String currentUrl = driver.getCurrentUrl();
            Assert.assertTrue(currentUrl.contains("lightning.force.com") || currentUrl.contains("home/home.jsp"),
                    "Login unsuccessful, URL mismatch. Found: " + currentUrl);
        } catch (Exception e) {
            Assert.fail("Valid login test failed due to exception: " + e.getMessage());
        }
    }

    @Test(priority = 2, description = "Verify Login with Invalid Credentials")
    @Severity(SeverityLevel.NORMAL)
    @Description("Test Description: Login into Salesforce with invalid username and password.")
    public void testInvalidLogin() {
        try {
            LoginPage loginPage = new LoginPage(driver);
            loginPage.enterUsername(ConfigReader.getProperty("invalid.username"));
            loginPage.enterPassword(ConfigReader.getProperty("invalid.password"));
            loginPage.clickLoginButton();
            
            String errorMessage = loginPage.getErrorMessage();
            Assert.assertNotNull(errorMessage, "Error message element not found.");
            Assert.assertTrue(errorMessage.contains("check your username and password"),
                    "Incorrect error message displayed: " + errorMessage);
        } catch (Exception e) {
            Assert.fail("Invalid login test failed due to exception: " + e.getMessage());
        }
    }
}
