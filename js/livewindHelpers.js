class LivewindHelpers {

    static getContentWidth() {
        var windGaugesDiv = document.getElementById('windGauges');
        var windGaugesWidth = windGaugesDiv.getBoundingClientRect().width;
        return windGaugesWidth;
    }

}