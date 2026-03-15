#include <WiFi.h>
#include <Firebase_ESP_Client.h>
#include <addons/TokenHelper.h>
#include <time.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

/* ================= WIFI ================= */
#define WIFI_SSID "OnePlus"
#define WIFI_PASSWORD "hello12345"

/* ============== FIREBASE ================ */
#define API_KEY "AIzaSyASJ95SENqp8UBsshdSwwtMurDgdwCKADk"
#define DATABASE_URL "https://test-1-eee0e-default-rtdb.firebaseio.com/"

/* OLED SETTINGS */
#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define OLED_RESET -1

Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

/* Firebase objects */
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

unsigned long lastSendTime = 0;

String deviceID = "ARIGO_001";

float lat = 12.83968;
float lng = 80.15524;

bool forceHighAQI = false;

/* NTP */
const char* ntpServer = "pool.ntp.org";
const long gmtOffset_sec = 19800;
const int daylightOffset_sec = 0;

/* Sensor values */
float before_aqi = 0;
float after_aqi = 0;
float humidity = 0;
float temperature = 0;
float dust = 0;

/* ================= DISPLAY SCREENS ================= */

void welcomeScreen()
{
  display.clearDisplay();

  display.setTextSize(2);
  display.setCursor(22,10);
  display.println("AriGo");

  display.setTextSize(1);
  display.setCursor(18,35);
  display.println("AirGuard Pro");

  display.drawLine(0,50,128,50,WHITE);

  display.setCursor(30,54);
  display.println("Smart Air Safety");

  display.display();
}

void loadingScreen()
{
  display.clearDisplay();

  display.setTextSize(1);
  display.setCursor(20,10);
  display.println("Initializing Sensors");

  display.drawRect(14,30,100,10,WHITE);

  for(int i=0;i<=100;i+=10)
  {
    display.fillRect(14,30,i,10,WHITE);
    display.display();
    delay(120);
  }

  display.setCursor(45,50);
  display.println("Ready");

  display.display();
  delay(1000);
}

void dashboard()
{
  display.clearDisplay();

  display.drawRect(0,0,128,12,WHITE);

  display.setTextSize(1);
  display.setCursor(5,2);
  display.print("AriGo AQI Monitor");

  display.setTextSize(2);
  display.setCursor(0,18);
  display.print("AQI:");
  display.print((int)after_aqi);

  display.setTextSize(1);

  display.setCursor(0,42);
  display.print("Temp:");
  display.print(temperature);
  display.print("C");

  display.setCursor(0,54);
  display.print("Hum:");
  display.print(humidity);
  display.print("%");

  display.setCursor(70,42);
  display.print("Dust:");
  display.print(dust);

  display.display();
}

/* ================= SETUP ================= */

void setup()
{
  Serial.begin(115200);

  /* OLED INIT */

  if(!display.begin(SSD1306_SWITCHCAPVCC,0x3C))
  {
    Serial.println("OLED failed");
    while(true);
  }

  welcomeScreen();
  delay(3000);

  loadingScreen();

  /* WIFI */

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  Serial.print("Connecting WiFi");

  while (WiFi.status() != WL_CONNECTED)
  {
    Serial.print(".");
    delay(500);
  }

  Serial.println("\nWiFi Connected");

  /* TIME */

  configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);

  /* FIREBASE */

  config.api_key = API_KEY;
  config.database_url = DATABASE_URL;

  Firebase.signUp(&config, &auth, "", "");

  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);
}

/* ================= LOOP ================= */

void loop()
{

  /* SERIAL CONTROL */

  if (Serial.available())
  {
    int input = Serial.parseInt();

    if (input == 1)
    {
      forceHighAQI = true;
      Serial.println("Manual AQI Trigger Activated");
    }
    else
    {
      forceHighAQI = false;
      Serial.println("Normal Sensor Mode");
    }
  }

  if (Firebase.ready() && millis() - lastSendTime > 5000)
  {
    lastSendTime = millis();

    struct tm timeinfo;

    if (!getLocalTime(&timeinfo))
      return;

    char dateStr[11];
    char timeStr[9];
    char timestamp[25];

    strftime(dateStr, sizeof(dateStr), "%Y-%m-%d", &timeinfo);
    strftime(timeStr, sizeof(timeStr), "%H:%M:%S", &timeinfo);
    strftime(timestamp, sizeof(timestamp), "%Y-%m-%dT%H:%M:%S", &timeinfo);

    /* SENSOR SIMULATION */

    before_aqi = random(15, 40);
    after_aqi = before_aqi * 0.08;

    if (forceHighAQI)
      after_aqi = 60;

    float co_ppm = random(300, 600) / 100.0;
    float after_co = co_ppm * 0.13;

    dust = random(10, 60);
    float after_dust = dust * 0.20;

    float no2 = random(10, 25);
    float after_no2 = no2 * 0.80;

    humidity = random(55, 70);
    temperature = random(220, 300) / 10.0;

    bool motor_state = before_aqi > 25;

    FirebaseJson json;

    json.set("Before aqi", before_aqi);
    json.set("After aqi", after_aqi);
    json.set("co_ppm", co_ppm);
    json.set("After co_ppm", after_co);
    json.set("dust_density", dust);
    json.set("After dust_density", after_dust);
    json.set("no2_ppm", no2);
    json.set("After no2_ppm", after_no2);
    json.set("humidity", humidity);
    json.set("temperature", temperature);
    json.set("motor_state", motor_state);
    json.set("User Latitude", lat);
    json.set("User Longitude", lng);
    json.set("recorded_at", timestamp);

    String basePath = "/airguard_devices/" + deviceID;

    Firebase.RTDB.setBool(&fbdo, basePath + "/device_status/online", true);
    Firebase.RTDB.setString(&fbdo, basePath + "/device_status/last_seen", timestamp);

    Firebase.RTDB.setJSON(&fbdo, basePath + "/latest_reading", &json);

    String historyPath = basePath + "/history/" + String(dateStr) + "/" + String(timeStr);

    Firebase.RTDB.setJSON(&fbdo, historyPath, &json);

    Firebase.RTDB.setFloat(&fbdo, basePath + "/user_location/lat", lat);
    Firebase.RTDB.setFloat(&fbdo, basePath + "/user_location/lng", lng);
    Firebase.RTDB.setString(&fbdo, basePath + "/user_location/updated_at", timestamp);

    Serial.println("Data Uploaded");

    /* UPDATE OLED DASHBOARD */

    dashboard();
  }
}