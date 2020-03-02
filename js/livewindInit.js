class LivewindInit {

    static init() {
        document.getElementById('headline').innerHTML = headline;
        LivewindInit.initDimensions();
        LivewindInit.createRecordsCloseButtonHandler();
        LivewindInit.createRecordsDivClickHandler();
        LivewindInit.createGauges();
        LivewindInit.createChartsAndDatasets();
    }

    /**
     * Initializes font sizes and div dimensions in the html page
     */
    static initDimensions() {
        var contentWidth = LivewindHelpers.getContentWidth();
        var bodyFontSize = contentWidth / 100;
        document.body.style.fontSize = bodyFontSize + "px";
        var windGauges = document.getElementById('windGauges');
        windGauges.style.height = (contentWidth * 0.17) + "px";
        var temperatures = document.getElementById('temperatures');
        temperatures.style.height = (contentWidth * 0.19) + "px";
        LivewindInit.initTemperatureGaugesDimensions();
    }

    static initTemperatureGaugesDimensions() {
        var contentWidth = LivewindHelpers.getContentWidth();
        var temperatureCanvasWidth = contentWidth * 0.08;
        var temperatureCanvasHeight = contentWidth * 0.20;
        var airTemperatureCanvas = document.getElementById('airTemperatureCanvas');
        airTemperatureCanvas.setAttribute('data-width', temperatureCanvasWidth);
        airTemperatureCanvas.setAttribute('data-height', temperatureCanvasHeight);
        var windchillTemperatureCanvas = document.getElementById('windchillTemperatureCanvas');
        windchillTemperatureCanvas.setAttribute('data-width', temperatureCanvasWidth);
        windchillTemperatureCanvas.setAttribute('data-height', temperatureCanvasHeight);
        var waterTemperatureCanvas = document.getElementById('waterTemperatureCanvas');
        waterTemperatureCanvas.setAttribute('data-width', temperatureCanvasWidth);
        waterTemperatureCanvas.setAttribute('data-height', temperatureCanvasHeight);
        var dailyRainCanvas = document.getElementById('dailyRainCanvas');
        dailyRainCanvas.setAttribute('data-width', temperatureCanvasWidth);
        dailyRainCanvas.setAttribute('data-height', temperatureCanvasHeight);
    }

    /**
     * Creates a click handler on the "recordsClose" Button which closes the overlay records div.
     */
    static createRecordsCloseButtonHandler() {
        var recordsClose = document.getElementById("recordsClose");
        var recordDiv = document.getElementById("recordsDiv");
        recordsClose.onclick = function () {
            recordDiv.style.display = "none";
            if (debug) {
                console.debug("handled recordsClose button click");
            }
        };
    }

    /**
     * Creates a click handler on the outside of the overlay records div which closes the overlay records div.
     */
    static createRecordsDivClickHandler() {
        var recordDiv = document.getElementById("recordsDiv");
        window.onclick = function (event) {
            if (event.target == recordDiv) {
                recordDiv.style.display = "none";
                if (debug) {
                    console.debug("handled recordsClose click");
                }
            }
        };
    }

    static createGauges() {
        LivewindInit.createWindDirectionGauge();
        LivewindInit.createWindSpeedGauge();
        LivewindInit.createWindSpeedGustsGauge();
    }

    static createChartsAndDatasets() {
        LivewindCharts.createAndStoreChartAndDataset("wind_speed_minutely", 'Windgeschwindigkeit [kt]', 'minute', 10, 'minutelyTop');
        LivewindCharts.createAndStoreChartAndDataset("wind_direction_minutely", 'Windrichtung [°]', 'minute', 10, 'minutelyBottom');
        LivewindCharts.createAndStoreChartAndDataset("wind_speed_hourly", 'Windgeschwindigkeit [kt]', 'hour', 4, 'hourlyTop');
        LivewindCharts.createAndStoreChartAndDataset("wind_direction_hourly", 'Windrichtung [°]', 'hour', 4, 'hourlyBottom');
        LivewindCharts.createAndStoreDataset("temperature_minutely", 'Temperatur [°C]');
        LivewindCharts.createAndStoreDataset("humidity_minutely", 'Luftfeuchtigkeit [%]');
        LivewindCharts.createAndStoreDataset("pressure_minutely", 'Luftdruck [mBar]');
        LivewindCharts.createAndStoreDataset("temperature_hourly", 'Temperatur [°C]');
        LivewindCharts.createAndStoreDataset("rain_hourly", 'Regen [mm]');
        LivewindCharts.createAndStoreDataset("humidity_hourly", 'Luftfeuchtigkeit [%]');
        LivewindCharts.createAndStoreDataset("pressure_hourly", 'Luftdruck [mBar]');
    }

    /**
     * Creates and stores the gauge for the wind direction.
     */
    static createWindDirectionGauge() {
        var windDirectionCanvas = document.getElementById('windDirectionCanvas');
        windDirectionCanvas.height = windDirectionCanvas.width;
        document.getElementById('windDirectionGauge').height = windDirectionCanvas.width; // TODO necessary?
        var windDirectionGauge = new Gauge(windDirectionCanvas).setOptions(LivewindGauges.getDirectionGaugeOpts());
        LivewindStore.storeGauge('windDirection', windDirectionGauge);
        windDirectionGauge.maxValue = 360;
        windDirectionGauge.setMinValue(0);
        windDirectionGauge.animationSpeed = 16;
    }

    /**
     * Creates and stores the gauge for the wind speed.
     */
    static createWindSpeedGauge() {
        var windSpeedCanvas = document.getElementById('windSpeedCanvas');
        windSpeedCanvas.height = windSpeedCanvas.width;
        var windSpeedGauge = new Gauge(windSpeedCanvas).setOptions(LivewindGauges.getSpeedGaugeOpts(windSpeedCanvas.width / 15));
        LivewindStore.storeGauge('windSpeed', windSpeedGauge);
        windSpeedGauge.maxValue = 20;
        windSpeedGauge.setMinValue(0);
        windSpeedGauge.animationSpeed = 16;
    }

    /**
     * Creates and stores the gauge for the wind speed gusts.
     */
    static createWindSpeedGustsGauge() {
        var windSpeedGustsCanvas = document.getElementById('windSpeedGustsCanvas');
        windSpeedGustsCanvas.height = windSpeedGustsCanvas.width;
        var windSpeedGustsGauge = new Gauge(windSpeedGustsCanvas).setOptions(LivewindGauges.getSpeedGaugeOpts(windSpeedGustsCanvas.width / 15));
        LivewindStore.storeGauge('windSpeedGusts', windSpeedGustsGauge);
        windSpeedGustsGauge.maxValue = 20;
        windSpeedGustsGauge.setMinValue(0);
        windSpeedGustsGauge.animationSpeed = 16;
    }
}