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

/**
 * Reads the value of the graphDisplaySelect dropdown 
 * and assigns the appropriate data sets to the charts in the html page.
 */
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

/**
 * Changes the datasets and labels for the charts in the html page to the given data.
 * 
 * @param {String} topChartDatasetIdPrefix The prefix for the datasets which should populate the charts in the top of the page.
 *                 Will be postfixed with '_minutely' and '_hourly' for the left and right chart, respectively.
 * @param {String} topHeadlinePrefix The prefix for the headline of the charts in the top of the page. 
 *                 Will be postfixed with 'letzte Stunde' und 'letzten Tag', respectively.
 * @param {String} topUnit the unit for the label of the charts in the top of the page. 
 * @param {String} bottomChartDatasetIdPrefix The prefix for the datasets which should populate the charts in the bottom of the page.
 *                 Will be postfixed with '_minutely' and '_hourly' for the left and right chart, respectively.
 * @param {String} bottomHeadlinePrefix The prefix for the headline of the charts in the bottom of the page.
 *                 Will be postfixed with 'letzte Stunde' und 'letzten Tag', respectively.
 * @param {String} bottomUnit the unit for the label of the charts in the bottom of the page. 
 */
function changeChartsTo(topChartDatasetIdPrefix, topHeadlinePrefix, topUnit, bottomChartDatasetIdPrefix, bottomHeadlinePrefix, bottomUnit)
{
  changeChartDataTo('minutelyTop', topChartDatasetIdPrefix + '_minutely', topHeadlinePrefix + ' letzte Stunde [' + topUnit + ']');
  changeChartDataTo('hourlyTop', topChartDatasetIdPrefix + '_hourly', topHeadlinePrefix + ' letzten Tag [' + topUnit +']');
  changeChartDataTo('minutelyBottom', bottomChartDatasetIdPrefix + '_minutely', bottomHeadlinePrefix + ' letzte Stunde [' + bottomUnit +']');
  changeChartDataTo('hourlyBottom', bottomChartDatasetIdPrefix + '_hourly', bottomHeadlinePrefix + ' letzten Tag [' + bottomUnit +']');
  if (debug)
  {
    console.debug("changed charts to " + topChartDatasetIdPrefix + " and " + bottomChartDatasetIdPrefix);
  }
}

/**
 * Changes the datatset and headline text of a chart in the html page.
 * 
 * @param {String} chartId the id of the chart to change.
 * @param {String} chartDatasetId the id of the dataset which should be assigned to the chart.
 * @param {String} headlineText the new headline text of the chart.
 */
function changeChartDataTo(chartId, chartDatasetId, headlineText)
{
  var chartDataset = LivewindStore.getDataset(chartDatasetId);
  var chart = LivewindStore.getChart(chartId)
  chart.config.data.datasets[0] = chartDataset;
  chart.update();
  var headline = document.getElementById(chartId + 'GraphHeadline');
  headline.innerHTML = headlineText;
  if (debug)
  {
    console.debug('changed graph ' + chartId + ' data to ' + chartDatasetId);
  }
}

function repaint() {
  var windDirectionCanvas = document.getElementById('windDirectionCanvas');
  windDirectionCanvas.height = windDirectionCanvas.width;
  document.getElementById('windDirectionGauge').height = windDirectionCanvas.width;
  windDirectionGauge = new Gauge(windDirectionCanvas).setOptions(LivewindGauges.getDirectionGaugeOpts()); 
  windDirectionGauge.maxValue = 360;
  windDirectionGauge.setMinValue(0); 
  windDirectionGauge.animationSpeed = 16; 

  var windSpeedCanvas = document.getElementById('windSpeedCanvas');
  windSpeedCanvas.height = windSpeedCanvas.width;
  windSpeedGauge = new Gauge(windSpeedCanvas).setOptions(LivewindGauges.getSpeedGaugeOpts(windDirectionCanvas.width/15)); 
  windSpeedGauge.maxValue = 20;
  windSpeedGauge.setMinValue(0); 
  windSpeedGauge.animationSpeed = 16; 

  var windSpeedGustsCanvas = document.getElementById('windSpeedGustsCanvas');
  windSpeedGustsCanvas.height = windSpeedGustsCanvas.width;
  windSpeedGustsGauge = new Gauge(windSpeedGustsCanvas).setOptions(LivewindGauges.getSpeedGaugeOpts(windDirectionCanvas.width/15)); 
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

/**
 * Retrieves the new weather data from the clientraw files 
 * and displays the new data on the html page. 
 */
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
