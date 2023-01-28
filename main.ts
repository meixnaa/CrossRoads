// Erweiterung für die Steuerung der Ampelkreuzung "CrossRoads"
// Enthält Funktionen zum Auslesen der Fußgängertasten und Magnetsensoren

// Enumeration für die Fußgängertasten
enum PedestrianButton {
    BUTTON_1,
    BUTTON_2,
    BUTTON_3,
    BUTTON_4,
    BUTTON_5,
    BUTTON_6,
    BUTTON_7,
    BUTTON_8
}

// Enumeration für die Magnetsensoren
enum RoadSensor {
    SENSOR_1,
    SENSOR_2,
    SENSOR_3,
    SENSOR_4,
    SENSOR_5,
    SENSOR_6,
    SENSOR_7,
    SENSOR_8
}

// Funktion zum Auslesen des Zustands einer Fußgängertaste
// Gibt "true" zurück, wenn die Taste betätigt ist, ansonsten "false"
function readPedestrianButton(button: PedestrianButton): boolean {
    let input = pins.i2cReadNumber(0x42, NumberFormat.UInt8BE);
    let buttonState = input & (1 << button);
    return buttonState != 0;
}

// Funktion zum Auslesen des Zustands eines Magnetsensors
// Gibt "true" zurück, wenn ein Fahrzeug über dem Sensor ist, ansonsten "false"
function readRoadSensor(sensor: RoadSensor): boolean {
    let input = pins.i2cReadNumber(0x42, NumberFormat.UInt8BE);
    let sensorState = input & (1 << (sensor + 8));
    return sensorState != 0;
}

// Funktion zum Auslesen des Lichtsensors im Sonnensymbol
// Gibt einen analogen Wert im Bereich 0..1023 zurück
function readLightSensor(): number {
    return pins.analogReadPin(AnalogPin.P0);
}
