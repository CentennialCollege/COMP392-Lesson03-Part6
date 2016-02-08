/// <reference path="../../typings/tsd.d.ts"/>
var objects;
(function (objects) {
    // CONTROL CLASS ++++++++++++++++++++++++++++++++++++++++++
    var Control = (function () {
        // CONSTRUCTOR ++++++++++++++++++++++++++++++++++++++++
        function Control(rotationSpeed, bouncingSpeed, hemisphere, groundColour, skyColour, intensity) {
            this.rotationSpeed = rotationSpeed;
            this.bouncingSpeed = bouncingSpeed;
            this.hemisphere = hemisphere;
            this.groundColour = groundColour;
            this.skyColour = skyColour;
            this.intensity = intensity;
        }
        return Control;
    })();
    objects.Control = Control;
})(objects || (objects = {}));
//# sourceMappingURL=control.js.map