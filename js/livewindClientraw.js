// TODO remove global now variable
var now = new Date();

/**
 * Retrieves and parses the data files containing the weather information
 * and writes the results to the targets in the html page.
 */
class Clientraw {

    static retrieveAndParse(url, parseFunction) {
        var request = new XMLHttpRequest();
        request.open("GET", url, true);
        request.send();
        request.onreadystatechange = function () {
            if (this.readyState == this.DONE) {
                parseFunction(url, request);
            }
        }
    }

    static parseClientraw(url, request) {
        var values = Clientraw.parseValues(url, request);

        var windSpeed = values[1];
        windSpeedGauge.set(windSpeed);
        var windSpeedBeaufort = LivewindHelpers.getBeaufort(windSpeed);
        document.getElementById("windSpeedValue").innerHTML = windSpeed + ' kt (' + windSpeedBeaufort + ' Bft)';

        var windSpeedGusts = values[2];
        windSpeedGustsGauge.set(windSpeedGusts);
        var windSpeedGustsBeaufort = LivewindHelpers.getBeaufort(windSpeedGusts);
        document.getElementById("windSpeedGustsValue").innerHTML = windSpeedGusts + ' kt (' + windSpeedGustsBeaufort + ' Bft)';

        var windDirection = values[3];
        var windDirectionGaugeValue = (parseInt(windDirection) + 180) % 360;
        windDirectionGauge.set(windDirectionGaugeValue);
        document.getElementById("windDirectionValue").innerHTML = windDirection + ' °';

        var airTemperature = values[4]
        document.getElementById("airTemperatureCanvas").setAttribute('data-value', airTemperature);
        document.getElementById("airTemperatureCanvas").setAttribute('data-value-text', airTemperature + " °C");

        var windchillTemperature = values[44]
        document.getElementById("windchillTemperatureCanvas").setAttribute('data-value', windchillTemperature);
        document.getElementById("windchillTemperatureCanvas").setAttribute('data-value-text', windchillTemperature + " °C");

        var waterTemperature = values[20]
        document.getElementById("waterTemperatureCanvas").setAttribute('data-value', waterTemperature);
        document.getElementById("waterTemperatureCanvas").setAttribute('data-value-text', waterTemperature + " °C");

        var dailyRain = values[7]
        document.getElementById("dailyRainCanvas").setAttribute('data-value', dailyRain);
        document.getElementById("dailyRainCanvas").setAttribute('data-value-text', dailyRain + " mm");

        var hour = values[29];
        var minute = values[30];
        var seconds = values[31];
        var day = values[35];
        var month = values[36] - 1;
        var year = values[141];
        now = new Date(year, month, day, hour, minute, seconds);
        if (debug) {
            console.debug("set now to " + now);
        }

        document.getElementById("now").innerHTML = now.toLocaleString("de-DE");
        document.getElementById("readIndicator").classList.toggle("lw_readIndicator_fade");
        if (debug) {
            console.debug("finished parsing " + url);
        }
    }

    static parseClientrawhour(url, request) {
        var values = Clientraw.parseValues(url, request);
        if (values == null) {
            return;
        }
        Clientraw.updateMinutelyChartData("wind_speed_minutely", values, 1);
        Clientraw.updateMinutelyChartData("wind_direction_minutely", values, 121);
        Clientraw.updateMinutelyChartData("temperature_minutely", values, 181);
        Clientraw.updateMinutelyChartData("humidity_minutely", values, 241);
        Clientraw.updateMinutelyChartData("pressure_minutely", values, 301);
        LivewindStore.getChart('minutelyTop').update();
        LivewindStore.getChart('minutelyBottom').update();

        if (debug) {
            console.debug("finished parsing " + url);
        }
    }

    static parseClientrawextra(url, request) {
        var values = Clientraw.parseValues(url, request);
        if (values == null) {
            return;
        }
        Clientraw.updateHourlyChartData("wind_speed_hourly", values, 1, 562);
        Clientraw.updateHourlyChartData("wind_direction_hourly", values, 536, 590);
        Clientraw.updateHourlyChartData("temperature_hourly", values, 21, 566);
        Clientraw.updateHourlyChartData("rain_hourly", values, 41, 570);
        Clientraw.updateHourlyChartData("humidity_hourly", values, 611, 631);
        Clientraw.updateHourlyChartData("pressure_hourly", values, 439, 574);
        LivewindStore.getChart('hourlyTop').update();
        LivewindStore.getChart('hourlyBottom').update();
        var recordIndexMap = Clientraw.getClientrawExtraRecordIndexMap();
        var recordsTableMap = new Map([
            ['month', document.getElementById('recordsMonthTable')],
            ['year', document.getElementById('recordsYearTable')],
            ['allTime', document.getElementById('recordsAllTimeTable')]
        ]);
        for (var [timespan, recordsTable] of recordsTableMap) {
            while (recordsTable.firstChild) {
                recordsTable.removeChild(recordsTable.firstChild);
            }
            var valueColumn;
            for (var [key, valueIndex] of recordIndexMap[timespan]) {
                var value = values[valueIndex];
                var unit = recordIndexMap.units.get(key);
                if (key == 'maxGustDirection' || key == 'maxWindDirection') {
                    var valueTextnode = document.createTextNode(' (' + value + unit + ')');
                    valueColumn.appendChild(valueTextnode);
                    continue;
                }
                var hour = values[valueIndex + 1];
                var minute = values[valueIndex + 2];
                var day = values[valueIndex + 3];
                var month = values[valueIndex + 4];
                var year = values[valueIndex + 5];
                var keyText = recordIndexMap.texts.get(key);
                var row = document.createElement("tr");
                var keyColumn = document.createElement("td");
                valueColumn = document.createElement("td");
                var timestampColumn = document.createElement("td");
                row.appendChild(keyColumn);
                row.appendChild(valueColumn);
                row.appendChild(timestampColumn);
                var keyTextnode = document.createTextNode(keyText);
                keyColumn.appendChild(keyTextnode);
                var valueTextnode = document.createTextNode(value + ' ' + unit);
                valueColumn.appendChild(valueTextnode);
                var timestampTextnode = document.createTextNode(
                    day + '.' + month + '.' + year + ' ' + hour + ':' + minute);
                timestampColumn.appendChild(timestampTextnode);
                recordsTable.appendChild(row);
            }
        }

        if (debug) {
            console.debug("finished parsing " + url);
        }
    }

    static parseValues(url, request) {
        if (debug) {
            console.debug("read " + url);
        }
        var values = request.responseText.split(" ");

        var id = values[0];
        if (id != clientrawId) {
            console.warn("could not read " + clientrawUrl + ", wrong id. Found: " + id + " expected: " + clientrawId);
            return null;
        }
        return values;
    }


    static updateMinutelyChartData(datasetId, values, startIndex) {
        if (now == null) {
            console.warn("not updating chart data " + datasetId + " because now is not set");
            return;
        }
        if (debug) {
            console.debug("updating chart data " + datasetId);
        }
        var chartDataset = LivewindStore.getDataset(datasetId);
        chartDataset.data = [];
        for (var i = startIndex; i < 60 + startIndex; i++) {
            var time = new Date(now);
            time.setMinutes(now.getMinutes() - 59 - startIndex + i);
            var datapoint = new Object();
            datapoint.x = time;
            datapoint.y = parseFloat(values[i]);
            chartDataset.data.push(datapoint);
        }
    }

    static updateHourlyChartData(datasetId, values, startIndex1, startIndex21) {
        if (now == null) {
            console.warn("not updating chart data " + datasetId + " because now is not set");
            return;
        }
        if (debug) {
            console.debug("updating chart data " + datasetId);
        }
        var chartDataset = LivewindStore.getDataset(datasetId);
        chartDataset.data = [];
        for (var i = startIndex1; i < 20 + startIndex1; i++) {
            var time = new Date(now);
            time.setHours(now.getHours() - 23 - startIndex1 + i);
            var datapoint = new Object();
            datapoint.x = time;
            datapoint.y = parseFloat(values[i]);
            chartDataset.data.push(datapoint);
        }
        for (var i = startIndex21; i < 4 + startIndex21; i++) {
            var time = new Date(now);
            time.setHours(now.getHours() - 3 - startIndex21 + i);
            var datapoint = new Object();
            datapoint.x = time;
            datapoint.y = parseFloat(values[i]);
            chartDataset.data.push(datapoint);
        }
    }

    static getClientrawExtraRecordIndexMap() {
        var result = {
            'month': new Map([
                ['maxGust', 73],
                ['maxGustDirection', 139],
                ['maxWind', 109],
                ['maxWindDirection', 145],
                ['maxTemp', 61],
                ['minTemp', 67],
                ['minWindchill', 133],
                ['maxAverageTempDay', 151],
                ['minAverageTempDay', 163],
                ['maxAverageTempNight', 169],
                ['minAverageTempNight', 157],
                ['minPressure', 85],
                ['maxPressure', 91],
                ['maxRainRate', 79],
                ['maxDailyRain', 97],
                ['maxHourlyRain', 103]
            ]),
            'year': new Map([
                ['maxGust', 199],
                ['maxGustDirection', 265],
                ['maxWind', 235],
                ['maxWindDirection', 271],
                ['maxTemp', 187],
                ['minTemp', 193],
                ['minWindchill', 259],
                ['maxAverageTempDay', 277],
                ['minAverageTempDay', 289],
                ['maxAverageTempNight', 295],
                ['minAverageTempNight', 283],
                ['minPressure', 211],
                ['maxPressure', 217],
                ['maxRainRate', 205],
                ['maxDailyRain', 223],
                ['maxHourlyRain', 229]
            ]),
            'allTime': new Map([
                ['maxGust', 325],
                ['maxGustDirection', 391],
                ['maxWind', 361],
                ['maxWindDirection', 397],
                ['maxTemp', 313],
                ['minTemp', 319],
                ['minWindchill', 385],
                ['maxAverageTempDay', 403],
                ['minAverageTempDay', 415],
                ['maxAverageTempNight', 421],
                ['minAverageTempNight', 409],
                ['minPressure', 337],
                ['maxPressure', 343],
                ['maxRainRate', 331],
                ['maxDailyRain', 349],
                ['maxHourlyRain', 355]
            ]),
            'texts': new Map([
                ['maxGust', 'Stärkste Böe'],
                ['maxGustDirection', 'Richtung der stärksten Böe'],
                ['maxWind', 'Höchste durchschnittliche Windgeschwindigkeit'],
                ['maxWindDirection', 'Richtung der höchsten durchschnittlichen Windgeschwindigkeit'],
                ['maxTemp', 'Höchste Temperatur'],
                ['minTemp', 'Tiefste Temperatur'],
                ['minWindchill', 'Tiefste gefühlte Temperatur'],
                ['maxAverageTempDay', 'Wärmster Tag (gemittelt über Tageslicht)'],
                ['minAverageTempDay', 'Kältester Tag (gemittelt über Tageslicht)'],
                ['maxAverageTempNight', 'Wärmste Nacht (gemittelt über Dunkelheit)'],
                ['minAverageTempNight', 'Kälteste Nacht (gemittelt über Dunkelheit)'],
                ['minPressure', 'Tiefster Luftdruck'],
                ['maxPressure', 'Höchster Luftdruck'],
                ['maxRainRate', 'höchste Regenrate'],
                ['maxDailyRain', 'Höchster Tagesniederschlag'],
                ['maxHourlyRain', 'Höchster stündlicher Niederschlag']
            ]),
            'units': new Map([
                ['maxGust', 'kt'],
                ['maxGustDirection', '°'],
                ['maxWind', 'kt'],
                ['maxWindDirection', '°'],
                ['maxTemp', '°C'],
                ['minTemp', '°C'],
                ['minWindchill', '°C'],
                ['maxAverageTempDay', '°C'],
                ['minAverageTempDay', '°C'],
                ['maxAverageTempNight', '°C'],
                ['minAverageTempNight', '°C'],
                ['minPressure', 'mBar'],
                ['maxPressure', 'mBar'],
                ['maxRainRate', 'mm/?'],
                ['maxDailyRain', 'mm'],
                ['maxHourlyRain', 'mm']
            ])
        }
        return result;
    }

}

