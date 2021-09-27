class Config {
    constructor(key, subject, title) {
        this.key = key;
        this.subject = subject;
        this.title = title;
    }

    setInfo(minValue, maxValue, currentValue, span) {
        this.minValue = minValue;
        this.maxValue = maxValue;
        this.currentValue = currentValue;
        this.span = span;
    }
}

export default Config;