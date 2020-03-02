/**
 * Stores charts (regions in html which can display datasets), chart datasets and gauges.
 * They can be accessed by a String key.
 */
class LivewindStore {
    static getChart(chartId) {
        return window.livewindStore.chart[chartId];
    }

    static storeChart(chartId, chart) {
        LivewindStore.initLivewindStoreNamespace();
        if (window.livewindStore.chart == null) {
            window.livewindStore.chart = {};
        }
        window.livewindStore.chart[chartId] = chart;
    }

    static getDataset(datasetId) {
        return window.livewindStore.dataset[datasetId];
    }

    static storeDataset(datasetId, dataset) {
        LivewindStore.initLivewindStoreNamespace();
        if (window.livewindStore.dataset == null) {
            window.livewindStore.dataset = {};
        }
        window.livewindStore.dataset[datasetId] = dataset;
    }

    static getGauge(gaugeId) {
        return window.livewindStore.gauge[gaugeId];
    }

    static storeGauge(gaugeId, gauge) {
        LivewindStore.initLivewindStoreNamespace();
        if (window.livewindStore.gauge == null) {
            window.livewindStore.gauge = {};
        }
        window.livewindStore.gauge[gaugeId] = gauge;
    }

    static initLivewindStoreNamespace() {
        if (window.livewindStore == null) {
            window.livewindStore = {};
        }
    }
}
