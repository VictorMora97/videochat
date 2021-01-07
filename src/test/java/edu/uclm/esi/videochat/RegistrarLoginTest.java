package edu.uclm.esi.videochat;

// Generated by Selenium IDE
import org.junit.Test;
import org.junit.Before;
import org.junit.After;
import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.core.IsNot.not;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.openqa.selenium.remote.RemoteWebElement;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.openqa.selenium.Dimension;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.Alert;
import org.openqa.selenium.Keys;
import org.openqa.selenium.NoAlertPresentException;
import org.openqa.selenium.Point;

import java.util.*;
import java.util.concurrent.TimeUnit;
import java.net.MalformedURLException;
import java.net.URL;
public class RegistrarLoginTest {
  private WebDriver chrome;
  private Map<String, Object> vars;
  JavascriptExecutor js;
  @Before
  public void setUp() {
	 
	  System.setProperty("webdriver.chrome.driver", "C:\\Users\\CLASE\\Desktop\\TSW\\chromedriver.exe"); 
	  
    chrome = new ChromeDriver();
    js = (JavascriptExecutor) chrome;
    vars = new HashMap<String, Object>();
  }
  @After
  public void tearDown() {
    chrome.quit();
  }
  @Test
  public void registrarLogin() {
    chrome.get("https://localhost:7500/?ojr=register");
   

		chrome.findElement(By.id("details-button")).click();
		chrome.findElement(By.id("proceed-link")).click();
		 chrome.manage().window().setSize(new Dimension(939, 1025));
		

    
    
	WebElement cajaNombre = chrome.findElement(By.xpath("//*[@id=\"globalBody\"]/oj-module/div[1]/div[2]/div/div/div/input[1]"));
	WebElement cajaEmail = chrome.findElement(By.xpath("//*[@id=\"globalBody\"]/oj-module/div[1]/div[2]/div/div/div/input[2]"));
	WebElement cajaPwd1 = chrome.findElement(By.xpath("//*[@id=\"globalBody\"]/oj-module/div[1]/div[2]/div/div/div/input[3]"));
	WebElement cajaPwd2 = chrome.findElement(By.xpath("//*[@id=\"globalBody\"]/oj-module/div[1]/div[2]/div/div/div/input[4]"));
	//RemoteWebElement inputFile = (RemoteWebElement) chrome.findElement(By.xpath("//*[@id=\"globalBody\"]/oj-module/div[1]/div[2]/div/div/div/input[5]"));
	
	cajaNombre.sendKeys("selenium97");
	cajaEmail.sendKeys("selenium97@gmail.com");
	cajaPwd1.sendKeys("123");
	cajaPwd2.sendKeys("123");
	chrome.findElement(By.xpath("/html/body/div/oj-module/div[1]/div[2]/div/div/div/button")).click();
	WebElement botonCrearCuenta = chrome.findElement(By.id("btnCrearCuenta"));
	
	chrome.manage().timeouts().implicitlyWait(5, TimeUnit.SECONDS);

assertThat(chrome.switchTo().alert().getText(), is("Registrado correctamente"));
chrome.manage().timeouts().implicitlyWait(5, TimeUnit.SECONDS);
chrome.switchTo().alert().accept();
    
    
    chrome.findElement(By.cssSelector("html")).click();
    chrome.findElement(By.cssSelector(".oj-sm-12:nth-child(1) > input")).sendKeys("selenium1");
    chrome.findElement(By.cssSelector("button")).click();
  }
}