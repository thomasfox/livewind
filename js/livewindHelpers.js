class LivewindHelpers {

    static getContentWidth() {
        var bodyWidth = document.body.clientWidth;
        if (bodyWidth > 1600) {
          bodyWidth = 1600;
        }
        return bodyWidth;
    }

    static getBeaufort(windSpeedInKnots) {
        if (windSpeedInKnots < 1) {
            return 0;
        }
        if (windSpeedInKnots < 4) {
            return 1;
        }
        if (windSpeedInKnots < 7) {
            return 2;
        }
        if (windSpeedInKnots < 11) {
            return 3;
        }
        if (windSpeedInKnots < 16) {
            return 4;
        }
        if (windSpeedInKnots < 22) {
            return 5;
        }
        if (windSpeedInKnots < 28) {
            return 6;
        }
        if (windSpeedInKnots < 34) {
            return 7;
        }
        if (windSpeedInKnots < 41) {
            return 8;
        }
        if (windSpeedInKnots < 48) {
            return 9;
        }
        if (windSpeedInKnots < 56) {
            return 10;
        }
        if (windSpeedInKnots < 64) {
            return 11;
        }
        return 12;
    }

}