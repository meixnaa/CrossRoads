let KInitialized = 0
let KLedState = 0
let KFunkAktiv = 0

enum KMotor {
    links,
    rechts,
    beide
}

enum KStop {
    //% block="auslaufend"
    Frei,
    //% block="bremsend"
    Bremsen
}

enum KnServo {
    //% block="Nr.1"
    Servo1,
    //% block="Nr.2"
    Servo2
}

enum KSensor {
    links,
    rechts
}

enum KSensorStatus {
    hell,
    dunkel
}

enum KFunk {
    an,
    aus
}

enum KEinheit {
    cm,
    mm
}

enum KRgbLed {
    //% block="links vorne"
    LV,
    //% block="rechts vorne"
    RV,
    //% block="links hinten"
    LH,
    //% block="rechts hinten"
    RH,
    //% block="alle"
    All
}

enum KRgbColor {
    rot,
    grün,
    blau,
    gelb,
    violett,
    türkis,
    weiß
}

enum KDir {
    vorwärts = 0,
    rückwärts = 1
}

enum KState {
    aus,
    an
}

enum KSensorWait {
    //% block="Entfernung (cm)"
    distanceCm,
    //% block="Entfernung (mm)"
    distance,
    //% block="Helligkeit"
    brightness,
    //% block="Temperatur"
    temperature,
    //% block="Beschleunigung X"
    accellX,
    //% block="Beschleunigung Y"
    accellY,
    //% block="Beschleunigung Z"
    accellZ
}

enum KCheck {
    //% block="="
    equal,
    //% block="<"
    lessThan,
    //% block=">"
    greaterThan
}

//% color="#FF0000" icon="\uf013" block="CrossRoads"
namespace callibot {

    function KInit() {
        if (KInitialized != 1) {
            KInitialized = 1;
            setLed(KMotor.links, KState.aus);
            setLed(KMotor.rechts, KState.aus);
            motorStop(KMotor.beide, KStop.Bremsen);
            setRgbLed(KRgbLed.All, KRgbColor.rot, 0);
        }
    }

    function writeMotor(nr: KMotor, direction: KDir, speed: number) {
        let buffer = pins.createBuffer(3)
        KInit()
        buffer[1] = direction;
        buffer[2] = speed;
        switch (nr) {
            case KMotor.links:
                buffer[0] = 0x00;
                pins.i2cWriteBuffer(0x20, buffer);
                break;
            case KMotor.beide:
                buffer[0] = 0x00;
                pins.i2cWriteBuffer(0x20, buffer);
            case KMotor.rechts:
                buffer[0] = 0x02;
                pins.i2cWriteBuffer(0x20, buffer);
                break;
        }
    }

    //% speed.min=5 speed.max=100
    //% blockId=K_motor block="Schalte Motor |%KMotor| |%KDir| mit |%number| %"
    export function motor(nr: KMotor, direction: KDir, speed: number) {
        if (speed > 100) {
            speed = 100
        }
        if (speed < 0) {
            speed = 0
        }
        speed = speed * 255 / 100
        writeMotor(nr, direction, speed);
    }

    //="Stoppe Motor $nr"
    //% blockId=K_motorStop block="Stoppe Motor |%nr| |%mode"
    export function motorStop(nr: KMotor, mode: KStop) {
        if (mode == KStop.Frei) {
            writeMotor(nr, 0, 1);
        }
        else {
            writeMotor(nr, 0, 0);
        }
    }

    //% pos.min=0 pos.max=180
    //% blockId=K_Servo block="Bewege Servo |%nr| auf |%pos|°"
    export function servo(nr: KnServo, pos: number) {
        let buffer = pins.createBuffer(2)
        if (pos < 0) {
            pos = 0
        }
        if (pos > 180) {
            pos = 180
        }
        switch (nr) {
            case KnServo.Servo1:
                buffer[0] = 0x14;
                break;
            case KnServo.Servo2:
                buffer[0] = 0x15;
                break;
        }
        buffer[1] = pos
        pins.i2cWriteBuffer(0x20, buffer)
    }

    //% blockId=K_SetLed block="Schalte LED |%KSensor| |%KState"
    export function setLed(led: KMotor, state: KState) {
        let buffer = pins.createBuffer(2)
        KInit()
        buffer[0] = 0;      // SubAddress of LEDs
        //buffer[1]  Bit 0/1 = state of LEDs
        switch (led) {
            case KMotor.links:
                if (state == KState.an) {
                    KLedState |= 0x01
                }
                else {
                    KLedState &= 0xFE
                }
                break;
            case KMotor.rechts:
                if (state == KState.an) {
                    KLedState |= 0x02
                }
                else {
                    KLedState &= 0xFD
                }
                break;
            case KMotor.beide:
                if (state == KState.an) {
                    KLedState |= 0x03
                }
                else {
                    KLedState &= 0xFC
                }
                break;
        }
        buffer[1] = KLedState;
        pins.i2cWriteBuffer(0x21, buffer);
    }

    //% intensity.min=0 intensity.max=8
    //% blockId=K_RGB_LED block="Schalte Beleuchtung |%led| Farbe|%color| Helligkeit|%intensity|(0..8)"
    export function setRgbLed(led: KRgbLed, color: KRgbColor, intensity: number) {
        let tColor = 0;
        let index = 0;
        let len = 0;

        KInit()
        if (intensity < 0) {
            intensity = 0;
        }
        if (intensity > 8) {
            intensity = 8;
        }
        if (intensity > 0) {
            intensity = (intensity * 2 - 1) * 16;
        }

        switch (color) {
            case KRgbColor.rot:
                tColor = 0x02
                break;
            case KRgbColor.grün:
                tColor = 0x01
                break;
            case KRgbColor.blau:
                tColor = 0x04
                break;
            case KRgbColor.gelb:
                tColor = 0x03
                break;
            case KRgbColor.türkis:
                tColor = 0x05
                break;
            case KRgbColor.violett:
                tColor = 0x06
                break;
            case KRgbColor.weiß:
                tColor = 0x07
                break;
        }
        switch (led) {
            case KRgbLed.LH:
                index = 2;
                len = 2;
                break;
            case KRgbLed.RH:
                index = 3;
                len = 2;
                break;
            case KRgbLed.LV:
                index = 1;
                len = 2;
                break;
            case KRgbLed.RV:
                index = 4;
                len = 2;
                break;
            case KRgbLed.All:
                index = 1;
                len = 5;
                break;
        }
        let buffer = pins.createBuffer(len)
        buffer[0] = index;
        buffer[1] = intensity | tColor
        if (len == 5) {
            buffer[2] = buffer[1];
            buffer[3] = buffer[1];
            buffer[4] = buffer[1];
        }
        pins.i2cWriteBuffer(0x21, buffer);
        basic.pause(10);
    }

    //="Liniensensor $sensor"
    //% blockId K_readLineSensor color="#00C040" block="Liniensensor |%sensor| |%status"
    export function readLineSensor(sensor: KSensor, status: KSensorStatus): boolean {
        let result = false

        let buffer = pins.i2cReadBuffer(0x21, 1);
        KInit();
        if (sensor == KSensor.links) {
            buffer[0] &= 0x02
        }
        if (sensor == KSensor.rechts) {
            buffer[0] &= 0x01
        }
        switch (status) {
            case KSensorStatus.hell:
                if (buffer[0] != 0) {
                    result = true
                }
                else {
                    result = false
                }
                break
            case KSensorStatus.dunkel:
                if (buffer[0] == 0) {
                    result = true
                }
                else {
                    result = false
                }
                break
        }
        return result
    }

    //% blockId=K_entfernung color="#00C040" block="Entfernung |%modus" blockGap=8
    export function entfernung(modus: KEinheit): number {
        let buffer = pins.i2cReadBuffer(0x21, 3)
        KInit()
        if (modus == KEinheit.mm) {
            return 256 * buffer[1] + buffer[2]
        }
        else {
            return (256 * buffer[1] + buffer[2]) / 10
        }
    }

    //% blockId=K_warte color="#0082E6" block="Warte bis |%sensor| |%check| |%value"
    export function warte(sensor: KSensorWait, check: KCheck, value: number) {
        let abbruch = 0
        let sensorValue = 0
        while (abbruch == 0) {
            switch (sensor) {
                case KSensorWait.distance:
                    sensorValue = entfernung(KEinheit.mm)
                    break;
                case KSensorWait.distanceCm:
                    sensorValue = entfernung(KEinheit.cm)
                    break;
                case KSensorWait.accellX:
                    sensorValue = input.acceleration(Dimension.X)
                    break;
                case KSensorWait.accellY:
                    sensorValue = input.acceleration(Dimension.Y)
                    break;
                case KSensorWait.accellZ:
                    sensorValue = input.acceleration(Dimension.Z)
                    break;
                case KSensorWait.brightness:
                    sensorValue = input.lightLevel()
                    break;
                case KSensorWait.temperature:
                    sensorValue = input.temperature()
                    break;
            }
            switch (check) {
                case KCheck.equal:
                    if (sensorValue == value)
                        abbruch = 1
                    break;
                case KCheck.lessThan:
                    if (sensorValue < value)
                        abbruch = 1
                    break;
                case KCheck.greaterThan:
                    if (sensorValue > value)
                        abbruch = 1
                    break;
            }
        }
    }

    //% blockId=K_warte_LSensor color="#0082E6" block="Warte bis Liniensensor |%sensor| = |%status"
    export function warteLSensor(sensor: KSensor, status: KSensorStatus) {
        while (!(readLineSensor(sensor, status))) {
        }
    }
}
