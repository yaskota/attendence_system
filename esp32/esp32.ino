#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <MFRC522.h>
#include <SPI.h>
#include <WiFi.h>
#include <WebSocketsClient.h>

// OLED setup
#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define OLED_ADDR 0x3C
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);

// RFID Setup
#define SS_PIN 5
#define RST_PIN 4
MFRC522 mfrc522(SS_PIN, RST_PIN);

// SPI Pins
#define SPI_SCK 18
#define SPI_MISO 19
#define SPI_MOSI 23

// Wi-Fi Credentials
const char* ssid = "CVR24";
const char* password = "123456789";

// WebSocket Config
WebSocketsClient webSocket;
String deviceId = "FAC001";
bool isPaired = false;
int studentCount = 0;

String scannedRolls[100]; // Local memory to track unique scans
String facultyName = "Faculty XYZ"; // Placeholder; can be made dynamic later
unsigned long lastRefresh = 0;
const unsigned long refreshInterval = 5000;
int scrollX = SCREEN_WIDTH;

void setup() {
  Serial.begin(115200);
  Serial.println("🔧 Setup started");

  Wire.begin(21, 22);
  Serial.println("🔌 I2C started on SDA=21, SCL=22");

  if (!display.begin(SSD1306_SWITCHCAPVCC, OLED_ADDR)) {
    Serial.println("❌ OLED init failed!");
    while (true);
  }
  Serial.println("✅ OLED initialized");
  displayMessage("Booting...", deviceId);

  SPI.begin(SPI_SCK, SPI_MISO, SPI_MOSI, SS_PIN);
  mfrc522.PCD_Init();
  Serial.println("✅ RFID initialized");

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    displayMessage("Connecting", "WiFi...");
    Serial.println("📶 Connecting to WiFi...");
    delay(500);
  }

  displayMessage("WiFi OK", WiFi.localIP().toString());
  Serial.println("✅ WiFi connected to: " + WiFi.localIP().toString());

  webSocket.begin("192.168.1.14", 8080, "/");
  webSocket.onEvent(webSocketEvent);
  Serial.println("🔌 WebSocket attempting connection to ws://192.168.1.14:8080/");
}

void loop() {
  webSocket.loop();

  // Serial input for pairing/stopping
  if (Serial.available()) {
    String command = Serial.readStringUntil('\n');
    command.trim();

    if (command == "pair" && !isPaired) {
      String msg = "{\"status\":\"PAIRING_REQUEST\",\"device_id\":\"" + deviceId + "\"}";
      Serial.println("📤 Sending pairing request: " + msg);
      webSocket.sendTXT(msg);
      displayMessage("Sent Pairing", deviceId);
      delay(500);
    }

    if (command == "stop" && isPaired) {
      webSocket.sendTXT("{\"event\":\"STOP_SESSION\",\"device_id\":\"" + deviceId + "\"}");
      isPaired = false;
      studentCount = 0;
      for (int i = 0; i < 100; i++) scannedRolls[i] = "";
      displayMessage("Available", "For Pairing");
      Serial.println("🛑 Session stopped & memory cleared.");
      delay(500);
    }
  }

  // Scrolling display every 5s
  if (isPaired && millis() - lastRefresh >= refreshInterval) {
    lastRefresh = millis();
    display.clearDisplay();
    display.setTextSize(1);
    display.setTextColor(WHITE);
    display.setCursor(scrollX, 0);
    display.print("Connected: " + facultyName);
    scrollX -= 5;
    if (scrollX < -6 * facultyName.length()) scrollX = SCREEN_WIDTH;
    display.setCursor(0, 20);
    display.print("Count: " + String(studentCount));
    display.display();
  }

  // RFID scan logic
  if (isPaired && mfrc522.PICC_IsNewCardPresent() && mfrc522.PICC_ReadCardSerial()) {
    Serial.println("🎯 RFID card detected");

    MFRC522::MIFARE_Key key;
    for (byte i = 0; i < 6; i++) key.keyByte[i] = 0xFF;

    if (mfrc522.PCD_Authenticate(MFRC522::PICC_CMD_MF_AUTH_KEY_A, 1, &key, &(mfrc522.uid)) != MFRC522::STATUS_OK) {
      Serial.println("❌ Authentication failed");
      return;
    }

    byte buffer[18];
    byte size = sizeof(buffer);
    MFRC522::StatusCode status = mfrc522.MIFARE_Read(1, buffer, &size);

    if (status == MFRC522::STATUS_OK) {
      String rollno = "";
      for (int i = 0; i < 16; i++) {
        if (buffer[i] == 0) break;
        rollno += (char)buffer[i];
      }

      if (alreadyScanned(rollno)) {
        displayMessage("Already Scanned", rollno);
        Serial.println("⚠️ Duplicate scan ignored: " + rollno);
      } else {
        scannedRolls[studentCount++] = rollno;
        String msg = "{\"event\":\"RFID_SCAN\",\"device_id\":\"" + deviceId + "\",\"rollNo\":\"" + rollno + "\"}";
        Serial.println("📡 Scanned & sent: " + msg);
        displayMessage("Roll: " + rollno, "Count: " + String(studentCount));
        webSocket.sendTXT(msg);
      }

      delay(2000);
    } else {
      Serial.println("⚠️ Failed to read RFID block");
    }

    mfrc522.PICC_HaltA();
    mfrc522.PCD_StopCrypto1();
  }
}

// Check for duplicates
bool alreadyScanned(String rollNo) {
  for (int i = 0; i < studentCount; i++) {
    if (scannedRolls[i] == rollNo) return true;
  }
  return false;
}

// OLED Utility
void displayMessage(String line1, String line2) {
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(WHITE);
  display.setCursor(0, 10); display.println(line1);
  display.setCursor(0, 30); display.println(line2);
  display.display();
  Serial.println("📺 OLED Updated => " + line1 + " | " + line2);
}

// WebSocket Event Handler
void webSocketEvent(WStype_t type, uint8_t *payload, size_t length) {
  switch (type) {
    case WStype_CONNECTED:
      Serial.println("✅ WebSocket connected.");
      break;
    case WStype_DISCONNECTED:
      Serial.println("❌ WebSocket disconnected.");
      break;
    case WStype_TEXT: {
      String message = String((char*)payload);
      Serial.println("🔄 Message from server: " + message);
      if (message.indexOf("PAIRED") >= 0) {
        isPaired = true;
        displayMessage("Device", "Paired!");
        Serial.println("✅ Device marked as paired.");
      }
      break;
    }
    default:
      break;
  }
}

