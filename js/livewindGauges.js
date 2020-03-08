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

    /**
     * Creates and stores the gauge for the air temperature.
     */
    static createAirTemperatureGauge() {
        var gauge = new LinearGauge(this.createTemperatureGaugeOpts('airTemperatureCanvas'));
        LivewindStore.storeGauge('airTemperature', gauge);
        gauge.draw();
    }

    /**
     * Creates and stores the gauge for the windchill temperature.
     */
    static createWindchillTemperatureGauge() {
        var gauge = new LinearGauge(this.createTemperatureGaugeOpts('windchillTemperatureCanvas'));
        LivewindStore.storeGauge('windchillTemperature', gauge);
        gauge.draw();
    }

    /**
     * Creates and stores the gauge for the water temperature.
     */
    static createWaterTemperatureGauge() {
        var gauge = new LinearGauge(this.createTemperatureGaugeOpts('waterTemperatureCanvas'));
        LivewindStore.storeGauge('waterTemperature', gauge);
        gauge.draw();
    }

    /**
     * Creates and stores the gauge for the daily daily rain.
     */
    static createDailyRainGauge() {
        var gauge = new LinearGauge(this.createRainGaugeOpts('dailyRainCanvas'));
        LivewindStore.storeGauge('dailyRain', gauge);
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

    static createRainGaugeOpts(canvasId) {
        var rainOptions = {
            minValue: 0,
            maxValue: 20,
            majorTicks: ["0", "5", "10", "15", "20"],
            minorTicks: 5,
            barBeginCircle: 0
        };
        Object.assign(rainOptions, this.createTemperatureRainBasicGaugeOpts(canvasId));
        return rainOptions;
    }

    static createTemperatureGaugeOpts(canvasId) {
        var temperatureOptions = {
            minValue: -10,
            maxValue: 40,
            majorTicks: ["-10", "0", "10", "20", "30", "40"],
            minorTicks: 10,
            barBeginCircle: 20
        };
        Object.assign(temperatureOptions, this.createTemperatureRainBasicGaugeOpts(canvasId));
        return temperatureOptions;
    }


    static createTemperatureRainBasicGaugeOpts(canvasId) {
        var basicOptions = {
            renderTo: canvasId,
            borders: false,
            highlights: false,
            borderShadowWidth: 0,
            tickSide: "left",
            numberSide: "left",
            needleSide: "left",
            needleType: "line",
            needleWidth: 3,
            colorNeedle: "#222",
            colorNeedleEnd: "#222",
            colorPlate: "#E7F3FF",
            animationDuration: 1500,
            barWidth: 8,
            ticksWidth: 25,
            ticksWidthMinor: 10,
            colorBarProgress: "#6FADCF",
            colorValueBoxShadow: false,
            valueBoxStroke: 0,
            colorValueBoxBackground: false,
            valueInt: 1,
            valueDec: 1,
            fontValueSize: 22,
            fontNumbersSize: 25
        };
        return basicOptions;
    }
}