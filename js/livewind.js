function livewind_init()
{
  document.getElementById('headline').innerHTML = headline;
  var bodyWidth = document.body.clientWidth;
  if (bodyWidth > 1200) {
    bodyWidth = 1200;
  }
  var bodyFontSize = bodyWidth / 70;
  document.body.style.fontSize = bodyFontSize + "px";
  var windGauges = document.getElementById('windGauges');
  windGauges.style.height = (windGauges.clientWidth * 0.22) + "px";
}

function updateData()
{
  var now;
  var xmlHttpClientraw = new XMLHttpRequest();
  xmlHttpClientraw.open("GET", clientrawUrl, true); 
  xmlHttpClientraw.send();
  xmlHttpClientraw.onreadystatechange = function() {
    if (this.readyState == this.DONE) 
    {
      var values = xmlHttpClientraw.responseText.split(" ");
        
      var id = values[0];
      if (id != clientrawId) 
      {
        return;
      }
        
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
      var month = values[36];
      var year = values[141];
      now = new Date (year, month, day, hour, minute, seconds);
      document.getElementById("now").innerHTML = now.toLocaleString("de-DE");
      document.getElementById("readIndicator").classList.toggle("lw_readIndicator_fade");
    }
  }
  var xmlHttpClientrawhour = new XMLHttpRequest();
  xmlHttpClientrawhour.open("GET", clientrawhourUrl, true); 
  xmlHttpClientrawhour.send();
  xmlHttpClientrawhour.onreadystatechange = function() {
    if (this.readyState == this.DONE) 
    {
      var values = xmlHttpClientrawhour.responseText.split(" ");
      
      var id = values[0];
      if (id != clientrawId) 
      {
        return;
      }
      updateChart("wind","speedHourly", values, 1, now);
      updateChart("wind","directionHourly", values, 121, now);
    }
  }
}

function updateChart(groupId, chartId, values, startIndex, now)
{
  var chartConfig = window[groupId + "_" + chartId].config;
  chartConfig.data.datasets[0].data = [];
  for (var i = startIndex; i < 60 + startIndex; i++) 
  {
    var time = new Date(now);
    time.setMinutes(now.getMinutes() - 60 - startIndex + i);
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
        angle: -0.5,
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

function getSpeedGaugeOpts()
{
  var gaugeOpts = getGaugeOpts();
  gaugeOpts.staticLabels = {
      font: "17px sans-serif",
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