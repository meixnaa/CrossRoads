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

enum LedState {
    // Enum for LED states
    OFF,
    RED,
    YELLOW,
    GREEN
}

// Define arrays to store the state of each LED
let mainStreetLights = [LedState.OFF, LedState.OFF, LedState.OFF, LedState.OFF];
let sideStreetLights = [LedState.OFF, LedState.OFF, LedState.OFF, LedState.OFF];
let pedestrianLights = [LedState.OFF, LedState.OFF, LedState.OFF, LedState.OFF, LedState.OFF, LedState.OFF, LedState.OFF, LedState.OFF];
let radarLed = LedState.OFF;
let streetLamp = LedState.OFF;

// Function to set the state of a specific LED
function setLedState(led: number, state: LedState): void {
    if (led < 0 || led > 29) return; // Check for invalid LED number
    if (led < 4) {
        mainStreetLights[led] = state;
    } else if (led < 12) {
        sideStreetLights[led - 4] = state;
    } else if (led < 20) {
        pedestrianLights[led - 12] = state;
    } else if (led === 20) {
        radarLed = state;
    } else if (led === 21) {
        streetLamp = state;
    }
}

// Function to update the state of all LEDs
function updateLeds(): void {
    let mainStreetByte = 0;
    let sideStreetByte = 0;
    let pedestrianByte1 = 0;
    let pedestrianByte2 = 0;

    // Loop through each LED and update the corresponding byte
    for (let i = 0; i < 4; i++) {
        if (mainStreetLights[i] === LedState.RED) {
            mainStreetByte += 1 << (3 - i);
        }
        if (sideStreetLights[i] === LedState.RED) {
            sideStreetByte += 1 << (3 - i);
        }
    }

    for (let i = 0; i < 8; i++) {
        if (pedestrianLights[i] === LedState.RED) {
            if (i < 4) {
                pedestrianByte1 += 1 << (7 - i);
            } else {
                pedestrianByte2 += 1 << (7 - (i - 4));
            }
        }
    }

    if (radarLed === LedState.RED) {
        sideStreetByte += 1 << 4;
    }
    if (streetLamp === LedState.RED) {
        sideStreetByte += 1 << 5;
    }

    // Send the bytes to the micro:bit
    serial.writeBuffer(pins.createBuffer(4));
}


//% color="#AA278D"
namespace CrossRoad {

    //% block
    export function Fußgängertasten(choice: PedestrianButton) {

    }

    //% block
    export function Magnetsensoren(choice: RoadSensor) {

    }
    
    //% block
    export function Ampeln(choice: LedState) {

    }
}



