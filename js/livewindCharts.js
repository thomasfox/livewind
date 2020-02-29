/**
 * Creates Charts and Datasets and stores them in the store. 
 */
class LivewindCharts {

    /**
     * Creates a chart which is connected to a newly created dataset.
     * Both are stored into the LivewindStore.
     * The chart is then connected to the canvas with id "${chartId}Canvas".
     * 
     * @param {String} datasetId the id under which the created dataset is stored into the LivewindStore.
     * @param {String} label the displayed label of the data set.
     * @param {String} timeUnit the time unit of the chart.
     * @param {number} timeStepSize  the time step size of the chart.
     * @param {String} chartId the id under which the chart is stored into the livewindStore.
     *                 Also determines the html id of the canvas to be used.
     */
    static createAndStoreChartAndDataset(datasetId, label, timeUnit, timeStepSize, chartId) {
        var dataset = LivewindCharts.createAndStoreDataset(datasetId, label);
        var config = LivewindCharts.createChartConfig(timeUnit, timeStepSize, dataset);
        LivewindCharts.createAndStoreChart(config, chartId);
        if (debug) {
            console.debug("created chart " + chartId + " with datasetId " + datasetId);
        }
    }

    /**
     * Creates a dataset and stores it into the LivewindStore for later usage.
     * 
     * @param {*} datasetId the id under which the created dataset is stored into the LivewindStore.
     * @param {*} label the displayed label of the data set.
     * 
     * @returns the newly created dataset
     */
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

    static createAndStoreChart(config, chartId) {
        var ctx = document.getElementById(chartId + 'Canvas').getContext('2d');
        LivewindStore.storeChart(chartId, new Chart(ctx, config));
    }
}