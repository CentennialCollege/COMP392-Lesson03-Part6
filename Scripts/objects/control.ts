/// <reference path="../../typings/tsd.d.ts"/>

module objects {
    // CONTROL CLASS ++++++++++++++++++++++++++++++++++++++++++
    export class Control { 
        //PUBLIC INSTANCE VARIABLES +++++++++++++++++++++++++++
        public rotationSpeed:number;
        public bouncingSpeed:number;
        public hemisphere:boolean;
        public groundColour:number;
        public skyColour:number;
        public intensity:number;
        // CONSTRUCTOR ++++++++++++++++++++++++++++++++++++++++
        constructor(rotationSpeed:number, bouncingSpeed:number, hemisphere:boolean,
                    groundColour:number, skyColour:number, intensity:number) {
            this.rotationSpeed = rotationSpeed;
            this.bouncingSpeed = bouncingSpeed;
            this.hemisphere = hemisphere;
            this.groundColour = groundColour;
            this.skyColour = skyColour;
            this.intensity = intensity;
        }
    }
}
