function livewind_init()
{
  document.getElementById('headline').innerHTML = headline;
  var bodyWidth = document.body.clientWidth;
  if (bodyWidth > 1600) {
    bodyWidth = 1600;
  }
  var bodyFontSize = bodyWidth / 100;
  document.body.style.fontSize = bodyFontSize + "px";
  var windGauges = document.getElementById('windGauges');
  windGauges.style.height = (windGauges.clientWidth * 0.17) + "px";
  var temperatures = document.getElementById('temperatures');
  temperatures.style.height = (windGauges.clientWidth * 0.19) + "px";
  
  var recordDiv = document.getElementById("recordsDiv");
  var recordsButton = document.getElementById("recordsButton");
  var recordsClose = document.getElementById("recordsClose");

  recordsButton.onclick = function() {
    recordDiv.style.display = "block";
  }

  recordsClose.onclick = function() {
    recordDiv.style.display = "none";
  }

  window.onclick = function(event) {
    if (event.target == recordDiv) {
      recordDiv.style.display = "none";
    }
  } 
}

function changeRecordSelector(value)
{
  var otherRecords = ['Month','Year','AllTime'];
  for (var toHide of otherRecords)
  {
    document.getElementById('records' + toHide + 'Table').style.display ='none';
    document.getElementById('records' + toHide + 'Headline').style.display ='none';
  }
  document.getElementById('records' + value + 'Table').style.display ='table';
  document.getElementById('records' + value + 'Headline').style.display ='table';
}

// TODO remove global now variable
var now = new Date();

function updateData()
{
  if (debug)
  {
    console.debug("updating data...");
  }
  retrieveAndParse(clientrawUrl, parseClientraw);
  retrieveAndParse(clientrawhourUrl, parseClientrawhour);
  retrieveAndParse(clientrawextraUrl, parseClientrawextra);
}

function retrieveAndParse(url, parseFunction)
{
  var request = new XMLHttpRequest();
  request.open("GET", url, true); 
  request.send();
  request.onreadystatechange = function() {
    if (this.readyState == this.DONE) 
    {
      parseFunction(url, request);
    }
  }
}

function parseClientraw(url, request)
{
  var values = parseValues(url, request);

  var windSpeed = values[1];
  windSpeedGauge.set(windSpeed);
  var windSpeedBeaufort = getBeaufort(windSpeed);
  document.getElementById("windSpeedValue").innerHTML = windSpeed + ' kt (' + windSpeedBeaufort + ' Bft)';

  var windSpeedGusts = values[2];
  windSpeedGustsGauge.set(windSpeedGusts);
  var windSpeedGustsBeaufort = getBeaufort(windSpeedGusts);
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
  if (debug)
  {
    console.debug("set now to " + now);
  }

  document.getElementById("now").innerHTML = now.toLocaleString("de-DE");
  document.getElementById("readIndicator").classList.toggle("lw_readIndicator_fade");
  if (debug)
  {
    console.debug("finished parsing " + url);
  }
}

function parseClientrawhour(url, request)
{
  var values = parseValues(url, request);
  if (values == null)
  {
    return;
  }
  updateMinutelyChart("wind", "speedMinutely", values, 1);
  updateMinutelyChart("wind", "directionMinutely", values, 121);

  if (debug)
  {
    console.debug("finished parsing " + url);
  }
}

function parseClientrawextra(url, request)
{
  var values = parseValues(url, request);
  if (values == null)
  {
    return;
  }
  updateHourlyChart("wind", "speedHourly", values, 1, 562);
  updateHourlyChart("wind", "directionHourly", values, 536, 590);
  var recordIndexMap = getClientrawExtraRecordIndexMap();
  var recordsTableMap = new Map([
    ['month',document.getElementById('recordsMonthTable')],
    ['year',document.getElementById('recordsYearTable')],
    ['allTime', document.getElementById('recordsAllTimeTable')]
  ]);
  for (var [timespan, recordsTable] of recordsTableMap)
  {
    while (recordsTable.firstChild) 
    {
      recordsTable.removeChild(recordsTable.firstChild);
    }
    var valueColumn;
    for (var [key, valueIndex] of recordIndexMap[timespan])
    {
      var value = values[valueIndex];
      var unit = recordIndexMap.units.get(key);
      if (key == 'maxGustDirection' || key == 'maxWindDirection')
      {
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

  if (debug)
  {
    console.debug("finished parsing " + url);
  }
}

function parseValues(url, request)
{
  if (debug)
  {
    console.debug("read " + url);
  }
  var values = request.responseText.split(" ");
    
  var id = values[0];
  if (id != clientrawId) 
  {
    console.warn("could not read " + clientrawUrl + ", wrong id. Found: " + id + " expected: " + clientrawId);
    return null;
  }
  return values;
}

function updateMinutelyChart(groupId, chartId, values, startIndex)
{
  if (now == null)
  {
    console.warn("not updating chart " + groupId + "_" + chartId + " because now is not set");
    return;
  }
  if (debug)
  {
    console.debug("updating chart " + groupId + "_" + chartId);
  }
  var chartConfig = window[groupId + "_" + chartId].config;
  chartConfig.data.datasets[0].data = [];
  for (var i = startIndex; i < 60 + startIndex; i++) 
  {
    var time = new Date(now);
    time.setMinutes(now.getMinutes() - 59 - startIndex + i);
    var datapoint = new Object();
    datapoint.x = time;
    datapoint.y = parseFloat(values[i]);
    chartConfig.data.datasets[0].data.push(datapoint);
  }
  window[groupId + "_" + chartId].update();
}

function updateHourlyChart(groupId, chartId, values, startIndex1, startIndex21)
{
  if (now == null)
  {
    console.warn("not updating chart " + groupId + "_" + chartId + " because now is not set");
    return;
  }
  if (debug)
  {
    console.debug("updating chart " + groupId + "_" + chartId);
  }
  var chartConfig = window[groupId + "_" + chartId].config;
  chartConfig.data.datasets[0].data = [];
  for (var i = startIndex1; i < 20 + startIndex1; i++) 
  {
    var time = new Date(now);
    time.setHours(now.getHours() - 23 - startIndex1 + i);
    var datapoint = new Object();
    datapoint.x = time;
    datapoint.y = parseFloat(values[i]);
    chartConfig.data.datasets[0].data.push(datapoint);
  }
  for (var i = startIndex21; i < 4 + startIndex21; i++) 
  {
    var time = new Date(now);
    time.setHours(now.getHours() - 3 - startIndex21 + i);
    var datapoint = new Object();
    datapoint.x = time;
    datapoint.y = parseFloat(values[i]);
    chartConfig.data.datasets[0].data.push(datapoint);
  }
  window[groupId + "_" + chartId].update();
}


function getGaugeOpts()
{
  var gaugeOpts = {
        lineWidth: 0.10,
        radiusScale: 0.9,
        pointer: {
          length: 0.45,
          strokeWidth: 0.040,
          color: '#000000'
        },
        limitMax: true,
        limitMin: true,
        colorStart: '#6FADCF',
        colorStop: '#6FADCF',
        strokeColor: '#6FADCF',
        generateGradient: false,
        highDpiSupport: true, 
        renderTicks: {
          divisions: 8,
          divWidth: 1.1,
          divLength: 0.7,
          divColor: '#333333',
          subDivisions: 2,
          subLength: 0.5,
          subWidth: 0.6,
          subColor: '#666666'
        }
      };
  return gaugeOpts;
}

function getDirectionGaugeOpts()
{
  var gaugeOpts = getGaugeOpts();
  gaugeOpts.angle=-0.5;
  return gaugeOpts;
}

function getSpeedGaugeOpts(fontSize)
{
  var gaugeOpts = getGaugeOpts();
  gaugeOpts.staticLabels = {
      font: fontSize + "px sans-serif",
      labels: [0, 5, 10, 15, 20],
      color: "#000000",
      fractionDigits: 0
  };
  gaugeOpts.renderTicks.divisions=4;
  gaugeOpts.renderTicks.subDivisions= 5;
  gaugeOpts.angle = -0.3;
  return gaugeOpts;
}

function getBeaufort(windSpeedInKnots) {
  if (windSpeedInKnots < 1) 
  {
    return 0;
  }
  if (windSpeedInKnots < 4) 
  {
    return 1;
  }
  if (windSpeedInKnots < 7) 
  {
    return 2;
  }
  if (windSpeedInKnots < 11) 
  {
    return 3;
  }
  if (windSpeedInKnots < 16) 
  {
    return 4;
  }
  if (windSpeedInKnots < 22) 
  {
    return 5;
  }
  if (windSpeedInKnots < 28) 
  {
    return 6;
  }
  if (windSpeedInKnots < 34) 
  {
    return 7;
  }
  if (windSpeedInKnots < 41) 
  {
    return 8;
  }
  if (windSpeedInKnots < 48) 
  {
    return 9;
  }
  if (windSpeedInKnots < 56) 
  {
    return 10;
  }
  if (windSpeedInKnots < 64) 
  {
    return 11;
  }
  return 12;
}

function createChart(groupId, chartId, label, canvasId, timeUnit, timeStepSize) {
  var windGaugesDiv = document.getElementById('windGauges');
  var windGaugesWidth = windGaugesDiv.getBoundingClientRect().width;
  var pointRadius = windGaugesWidth/450;
  var tickFontSize = windGaugesWidth/100;
  var color = Chart.helpers.color;
  var config = {
    type: 'line',
    data: {
      datasets: [{
        label: label,
        borderColor: 'rgba(111, 173, 207)',
        backgroundColor: 'rgba(111, 173, 207)',
        borderWidth: 2,
        pointRadius: pointRadius,
        fill: false
      }]
    },
    options: {
      responsive: true,
      aspectRatio: 1.3,
      title: {
        display: false,
      },
      legend: {
        display: false,
      },
      scales: {
        xAxes: [{
          type: 'time',
          display: true,
          scaleLabel: {
            display: false
          },
          ticks: {
            fontSize: tickFontSize
          },
          time: {
            unit: timeUnit,
            stepSize: timeStepSize,
            displayFormats: {
              minute: 'hh:mm',
              hour: 'hh:mm'
            }
          }
        }],
        yAxes: [{
          display: true,
          scaleLabel: {
            display: false
          },
          ticks: {
            fontSize: 12
          }
        }]
      }
    }
  };

  var ctx = document.getElementById(canvasId).getContext('2d'); 
  window[groupId + "_" + chartId] = new Chart(ctx, config);
  if (debug)
  {
    console.debug("created chart " + groupId + "_" + chartId);
  }
}
function getClientrawExtraRecordIndexMap()
{
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
      ['minWindchill', 'Tiefste gefühlte Temeperatur'],
      ['maxAverageTempDay', 'Wärmster Tag (gemittelt über Tageslicht)'],
      ['minAverageTempDay', 'Kältester Tag (gemittelt über Tageslicht)'],
      ['maxAverageTempNight', 'Wärmste Nacht (gemittelt über Dunkelheit)'],
      ['minAverageTempNight', 'Kälteste Nacht (gemittelt über Dunkelheit)'],
      ['minPressure', 'Tiefster Luftdruck'],
      ['maxPressure', 'Höchster Luftdruck'],
      ['maxRainRate', 'höchste Regenrate'],
      ['maxDailyRain', 'Höchster Tagensniederschlag'],
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
