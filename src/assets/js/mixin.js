import da from 'element-ui/src/locale/lang/da';

let mixin = {
    methods: {
        parseTime(time, pattern) {
            if (arguments.length === 0 || !time) {
                return null;
            }
            const format = pattern || '{y}-{m}-{d} {h}:{i}:{s}';
            let date;
            if (typeof time === 'object') {
                date = time;
            } else {
                if (typeof time === 'string' && /^[0-9]+$/.test(time)) {
                    time = parseInt(time);
                }
                if (typeof time === 'number' && time.toString().length === 10) {
                    time = time * 1000;
                }
                date = new Date(time);
            }
            const formatObj = {
                y: date.getFullYear(),
                m: date.getMonth() + 1,
                d: date.getDate(),
                h: date.getHours(),
                i: date.getMinutes(),
                s: date.getSeconds(),
                a: date.getDay(),
            };
            const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
                let value = formatObj[key];
                // Note: getDay() returns 0 on Sunday
                if (key === 'a') {
                    return ['日', '一', '二', '三', '四', '五', '六'][value];
                }
                if (result.length > 0 && value < 10) {
                    value = '0' + value;
                }
                return value || 0;
            });
            return time_str;
        },
        getFloorNumAndComplemented(value, precision) {
            if (
                String(value).indexOf('.') > 0 &&
                String(value).split('.')[1].length > precision
            ) {
                value =
                    Math.floor(value * Math.pow(10, precision)) / Math.pow(10, precision);
            } else if (
                String(value).indexOf('.') > 0 &&
                String(value).split('.')[1].length < precision
            ) {
                let z_amount = precision - String(value).split('.')[1].length;
                let z_str = '';
                while (z_amount > 0) {
                    z_str = z_str + '0';
                    z_amount--;
                }
                value = value + z_str;
            } else if (String(value).indexOf('.') <= 0) {
                let z_amount = precision;
                let z_str = '.';
                while (z_amount > 0) {
                    z_str = z_str + '0';
                    z_amount--;
                }
                value = value + z_str;
            }
            return value;
        },
        addressNumFilter(wallet) {
            let str =
                wallet.substr(0, 6) + '...' + wallet.substr(wallet.length - 6);
            return str;
        },
        counDown(startTime, endTime, cb) {
            const now = new Date(startTime).getTime();
            const end = new Date(endTime).getTime();
            const leftTime = end - now;
            let d, h, m, s;
            if (leftTime >= 0) {
                d = this.addTagTime(Math.floor(leftTime / 1000 / 60 / 60 / 24));
                h = this.addTagTime(Math.floor(leftTime / 1000 / 60 / 60 % 24));
                m = this.addTagTime(Math.floor(leftTime / 1000 / 60 % 60));
                s = this.addTagTime(Math.floor(leftTime / 1000 % 60));
                return {
                    down: true,
                    d, h, m, s
                };
            } else {
                cb();
                return {
                    down: false,
                    d: this.addTagTime(0),
                    h: this.addTagTime(0),
                    m: this.addTagTime(0),
                    s: this.addTagTime(0),
                }
            }
        },

        addTagTime(data) {
            if (data < 10) {
                return '0' + data
            } else {
                return data
            }
        }
    },
};
export default mixin;
