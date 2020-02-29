/**
 * Creates Charts and Datasets and stores them in the store. 
 */
class LivewindCharts {

    static createAndStoreChartAndConfig(datasetId, label, timeUnit, timeStepSize, graphId) {
        var dataset = LivewindCharts.createAndStoreDataset(datasetId, label);
        var config = LivewindCharts.createChartConfig(timeUnit, timeStepSize, dataset);
        LivewindCharts.createAndStoreChart(config, graphId);
        if (debug) {
            console.debug("created chart " + graphId + " with datasetId " + datasetId);
        }
    }

    static createAndStoreDataset(datasetId, label) {
        var dataset = this.createDataset(label);
        LivewindStore.storeDataset(datasetId, dataset);
        return dataset;
    }

    static createDataset(label) {
        var pointRadius = LivewindHelpers.getContentWidth() / 450;
        var dataset = {
            label: label,
            borderColor: 'rgba(111, 173, 207)',
            backgroundColor: 'rgba(111, 173, 207)',
            borderWidth: 2,
            pointRadius: pointRadius,
            fill: false
        };
        return dataset;
    }

    static createChartConfig(timeUnit, timeStepSize, dataset) {
        var tickFontSize = LivewindHelpers.getContentWidth() / 100;
        var config = {
            type: 'line',
            data: {
                datasets: [dataset]
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
        return config;
    }

    static createAndStoreChart(config, graphId) {
        var ctx = document.getElementById(graphId + 'Canvas').getContext('2d');
        LivewindStore.storeChart(graphId, new Chart(ctx, config));
    }
}