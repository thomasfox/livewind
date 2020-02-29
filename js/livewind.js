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
  var recordsClose = document.getElementById("recordsClose");

  recordsClose.onclick = function() {
    recordDiv.style.display = "none";
    if (debug)
    {
      console.debug("handled recordsClose button click")
    }
  }

  window.onclick = function(event) {
    if (event.target == recordDiv) {
      recordDiv.style.display = "none";
      if (debug)
      {
        console.debug("handled recordsClose click")
      }
    }
  }
}

function handleRecordsButtonClick() {
  handleRecordSelectorChange();
  var recordDiv = document.getElementById("recordsDiv");
  recordDiv.style.display = "table-cell";
  if (debug)
  {
    console.debug("handled records button click")
  }
}

function handleGraphDisplayChange() {
  var graphDisplaySelect = document.getElementById("graphDisplaySelect");
  if (graphDisplaySelect.value == 'wind_speed:wind_direction')
  {
    changeChartsTo('wind_speed', 'Wind', 'kt', 'wind_direction', 'Windrichtung', '°');
  }
  else
  {
    changeChartsTo('temperature', 'Temperatur', '°C', 'pressure', 'Luftdruck', 'mBar');
  }
  if (debug)
  {
    console.debug("handled graphDisplay change to " + graphDisplaySelect.value)
  }
}

function changeChartsTo(topChartDatasetId, topLabel, topUnit, bottomChartDatasetId, bottomLabel, bottomUnit)
{
  changeChartDataTo('minutelyTop', topChartDatasetId + '_minutely', topLabel + ' letzte Stunde [' + topUnit + ']');
  changeChartDataTo('hourlyTop', topChartDatasetId + '_hourly', topLabel + ' letzten Tag [' + topUnit +']');
  changeChartDataTo('minutelyBottom', bottomChartDatasetId + '_minutely', bottomLabel + ' letzte Stunde [' + bottomUnit +']');
  changeChartDataTo('hourlyBottom', bottomChartDatasetId + '_hourly', bottomLabel + ' letzten Tag [' + bottomUnit +']');
  if (debug)
  {
    console.debug("changed charts to " + topChartDatasetId + " and " + bottomChartDatasetId);
  }
}

function changeChartDataTo(graphId, chartDatasetId, headlineText)
{
  var chartDataset = LivewindStore.getDataset(chartDatasetId);
  var chart = LivewindStore.getChart(graphId)
  chart.config.data.datasets[0] = chartDataset;
  chart.update();
  var headline = document.getElementById(graphId + 'GraphHeadline');
  headline.innerHTML = headlineText;
  if (debug)
  {
    console.debug('changed graph ' + graphId + ' data to ' + chartDatasetId);
  }
}

function repaint() {
  var windDirectionCanvas = document.getElementById('windDirectionCanvas');
  windDirectionCanvas.height = windDirectionCanvas.width;
  document.getElementById('windDirectionGauge').height = windDirectionCanvas.width;
  windDirectionGauge = new Gauge(windDirectionCanvas).setOptions(getDirectionGaugeOpts()); 
  windDirectionGauge.maxValue = 360;
  windDirectionGauge.setMinValue(0); 
  windDirectionGauge.animationSpeed = 16; 

  var windSpeedCanvas = document.getElementById('windSpeedCanvas');
  windSpeedCanvas.height = windSpeedCanvas.width;
  windSpeedGauge = new Gauge(windSpeedCanvas).setOptions(getSpeedGaugeOpts(windDirectionCanvas.width/15)); 
  windSpeedGauge.maxValue = 20;
  windSpeedGauge.setMinValue(0); 
  windSpeedGauge.animationSpeed = 16; 

  var windSpeedGustsCanvas = document.getElementById('windSpeedGustsCanvas');
  windSpeedGustsCanvas.height = windSpeedGustsCanvas.width;
  windSpeedGustsGauge = new Gauge(windSpeedGustsCanvas).setOptions(getSpeedGaugeOpts(windDirectionCanvas.width/15)); 
  windSpeedGustsGauge.maxValue = 20;
  windSpeedGustsGauge.setMinValue(0); 
  windSpeedGustsGauge.animationSpeed = 16; 

  var temperaturesDiv = document.getElementById('temperatures');
  var temperaturesDivWidth=temperaturesDiv.getBoundingClientRect().width;
  var temperatureCanvasWidth = temperaturesDivWidth * 0.08;
  var temperatureCanvasHeight = temperaturesDivWidth * 0.20;

  var airTemperatureCanvas = document.getElementById('airTemperatureCanvas');
  airTemperatureCanvas.setAttribute('data-width', temperatureCanvasWidth)
  airTemperatureCanvas.setAttribute('data-height', temperatureCanvasHeight)
  
  var windchillTemperatureCanvas = document.getElementById('windchillTemperatureCanvas');
  windchillTemperatureCanvas.setAttribute('data-width', temperatureCanvasWidth)
  windchillTemperatureCanvas.setAttribute('data-height', temperatureCanvasHeight)

  var waterTemperatureCanvas = document.getElementById('waterTemperatureCanvas');
  waterTemperatureCanvas.setAttribute('data-width', temperatureCanvasWidth)
  waterTemperatureCanvas.setAttribute('data-height', temperatureCanvasHeight)

  var dailyRainCanvas = document.getElementById('dailyRainCanvas');
  dailyRainCanvas.setAttribute('data-width', temperatureCanvasWidth)
  dailyRainCanvas.setAttribute('data-height', temperatureCanvasHeight)

  updateData();
  setInterval(function(){ updateData(); }, 5000);
}

function handleRecordSelectorChange()
{
  var value = document.getElementById('recordSelector').value;
  var otherRecords = ['Month','Year','AllTime'];
  for (var toHide of otherRecords)
  {
    document.getElementById('records' + toHide + 'Table').style.display ='none';
    document.getElementById('records' + toHide + 'Headline').style.display ='none';
  }
  document.getElementById('records' + value + 'Table').style.display ='table';
  document.getElementById('records' + value + 'Headline').style.display ='table';
}

function updateData()
{
  if (debug)
  {
    console.debug("updating data...");
  }
  Clientraw.retrieveAndParse(clientrawUrl, Clientraw.parseClientraw);
  Clientraw.retrieveAndParse(clientrawhourUrl, Clientraw.parseClientrawhour);
  Clientraw.retrieveAndParse(clientrawextraUrl, Clientraw.parseClientrawextra);
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