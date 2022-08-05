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

enum KCheck {
    //% block="="
    equal,
    //% block="<"
    lessThan,
    //% block=">"
    greaterThan
}

enum KTrafficColor {
    aus = 0,
    rot = 1,
    gelb = 2,
    grün = 3,
}

enum KTrafficMain {
    Hauptstraße1,
    Hauptstraße2,
    Nebenstraße1,
    Nebenstraße2,    
}

enum KTrafficSide {
    Fußgängerampel1,
    Fußgängerampel2,
    Fußgängerampel3,
    Fußgängerampel4,
    Fußgängerampel5,
    Fußgängerampel6,
    Fußgängerampel7,
    Fußgängerampel8,
}

//% color="#4287f5" icon="\uf013" block="CrossRoads"
namespace crossroads {

    function KInit() {
        if (KInitialized != 1) {
            KInitialized = 1;
            setLed(KMotor.links, KState.aus);
            setLed(KMotor.rechts, KState.aus);
            motorStop(KMotor.beide, KStop.Bremsen);
            setRgbLed(KRgbLed.All, KRgbColor.rot, 0);
            setTraffic(KTrafficMain.All, KTrafficColor.aus);
        }
    }

    function writeTrafficMain(nr: KTrafficMain, color: KTrafficColor) {
        let buffer = pins.createBuffer(2)
        KInit()
        buffer[1] = color;
        switch (nr) {
            case KTrafficColor.rot:
                buffer[0] = 0x00;
                pins.i2cWriteBuffer(0x20, buffer);
                break;
            case KTrafficColor.gelb:
                buffer[0] = 0x00;
                pins.i2cWriteBuffer(0x20, buffer);
            case KTrafficColor.grün:
                buffer[0] = 0x02;
                pins.i2cWriteBuffer(0x20, buffer);
                break;
            case KTrafficColor.aus:
                buffer[0] = 0x00;
                pins.i2cWriteBuffer(0x20, buffer);
        }    
        
    }

    //="Schalte Ampel $nr"
    //% blockId=K_setTraffic block="Schalte Ampel |%nr| |%mode"
    export function setTraffic(nr: KTrafficMain, mode: KTrafficColor) {
        if (mode == KTrafficColor.rot) {
            writeTrafficMain(nr, 1);
        }
        if (mode == KTrafficColor.gelb) {
            writeTrafficMain(nr, 2);
        }
        if (mode == KTrafficColor.grün) {
            writeTrafficMain(nr, 3);
        }
        else {
            writeTrafficMain(nr, 0);
        }
    }


    //% blockId=K_SetLed block="Schalte Fußgänger Ampel |%nr| |%mode"
    export function setTraffic(nr: KTrafficSide, mode: KTrafficColor)) {
          if (mode == KTrafficColor.rot) {
            writeTrafficMain(nr, 1);
        }
        if (mode == KTrafficColor.gelb) {
            writeTrafficMain(nr, 2);
        }
        if (mode == KTrafficColor.grün) {
            writeTrafficMain(nr, 3);
        }
        else {
            writeTrafficMain(nr, 0);
        }
        
        
        
     /**
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
        pins.i2cWriteBuffer(0x21, buffer); */
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

}
