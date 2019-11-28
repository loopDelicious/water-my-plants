#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266WebServer.h>
#include <ESP8266mDNS.h>

const char* ssid = "postman-demo";
const char* password = "...";

ESP8266WebServer server(80);

const int analogInPin = A0;

int sensorValue = 0;

void handleRoot() {
  sensorValue = analogRead(analogInPin);

  Serial.print("sensor = ");
  Serial.println(sensorValue);

  delay(1000);
  server.send(200, "text/plain", String(sensorValue, DEC));
}

void setup(void){
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  Serial.print("mac: ");
  Serial.println(WiFi.macAddress());
  Serial.println("");

  // Wait for connection
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("Connected to ");
  Serial.println(ssid);
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());

  if (MDNS.begin("esp8266")) {
    Serial.println("MDNS responder started");
  }

  server.on("/", handleRoot);

  server.begin();
  Serial.println("HTTP server started");
}

void loop(void){
  server.handleClient();
}
