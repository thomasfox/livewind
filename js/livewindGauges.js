/**
 * Functions related to the gauges on the html page.
 */
class LivewindGauges {

    /**
     * Creates and stores the gauge for the wind direction.
     */
    static createWindDirectionGauge() {
        var gauge = new RadialGauge(this.createWindDirectionOptions('windDirectionCanvas'));
        LivewindStore.storeGauge('windDirection', gauge);
        gauge.draw();
    }

    /**
     * Creates and stores the gauge for the wind speed.
     */
    static createWindSpeedGauge() {
        var gauge = new RadialGauge(this.createWindSpeedOptions('windSpeedCanvas'));
        LivewindStore.storeGauge('windSpeed', gauge);
        gauge.draw();
    }

    /**
     * Creates and stores the gauge for the wind speed gusts.
     */
    static createWindSpeedGustsGauge() {
        var gauge = new RadialGauge(this.createWindSpeedOptions('windSpeedGustsCanvas'));
        LivewindStore.storeGauge('windSpeedGusts', gauge);
        gauge.draw();
    }

    static createWindDirectionOptions(canvasId) {
        var directionOptions = {
            renderTo: canvasId,
            minValue: 0,
            maxValue: 360,
            majorTicks: ["N", "NE", "E", "SE", "S", "SW", "W", "NW", "N"],
            minorTicks: 9,
            ticksAngle: 360,
            startAngle: 180
        }
        Object.assign(directionOptions, this.createWindGaugeBasicOptions());
        return directionOptions;
    }

    static createWindSpeedOptions(canvasId) {
        var directionOptions = {
            renderTo: canvasId,
            minValue: 0,
            maxValue: 20,
            majorTicks: ["0", "5", "10", "15", "20"],
            minorTicks: 5,
            ticksAngle: 280,
            startAngle: 40
        }
        Object.assign(directionOptions, this.createWindGaugeBasicOptions());
        return directionOptions;
    }

    static createWindGaugeBasicOptions() {
        var basicOptions = {
            strokeTicks: false,
            fontNumbersSize: 30,
            highlights: false,
            colorPlate: "#C9E1F3",
            colorNeedle: "#000",
            colorNeedleEnd: "#000",
            needleStart: 0,
            needleEnd: 97,
            needleWidth: 5,
            needleShadow: false,
            valueBox: false,
            borders: false
        }
        return basicOptions;
    }
}