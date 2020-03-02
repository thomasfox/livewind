
/**
 * Displays the overlay div containing the records.
 */
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
