/**
 * Stores charts (regions in html which can display datasets) and chart datasets.
 * Both can be accessed by a String key.
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

    static initLivewindStoreNamespace() {
        if (window.livewindStore == null) {
            window.livewindStore = {};
        }
    }
}
