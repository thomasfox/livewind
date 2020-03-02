/**
 * Functions related to the gauges on the html page.
 */
class LivewindGauges {

    static getDirectionGaugeOpts() {
        var gaugeOpts = LivewindGauges.getGaugeOpts();
        gaugeOpts.angle = -0.5;
        return gaugeOpts;
    }

    static getSpeedGaugeOpts(fontSize) {
        var gaugeOpts = LivewindGauges.getGaugeOpts();
        gaugeOpts.staticLabels = {
            font: fontSize + "px sans-serif",
            labels: [0, 5, 10, 15, 20],
            color: "#000000",
            fractionDigits: 0
        };
        gaugeOpts.renderTicks.divisions = 4;
        gaugeOpts.renderTicks.subDivisions = 5;
        gaugeOpts.angle = -0.3;
        return gaugeOpts;
    }

    static getGaugeOpts() {
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
}