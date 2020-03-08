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
        temperatures.style.height = (contentWidth * 0.24) + "px";
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
        LivewindGauges.createWindDirectionGauge();
        LivewindGauges.createWindSpeedGauge();
        LivewindGauges.createWindSpeedGustsGauge();
        LivewindGauges.createAirTemperatureGauge();
        LivewindGauges.createWindchillTemperatureGauge();
        LivewindGauges.createWaterTemperatureGauge();
        LivewindGauges.createDailyRainGauge();
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
}