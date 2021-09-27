import Vue from 'vue';
import BigNumber from 'bignumber.js';
import moment from 'moment';

const filter = {
    toFixed: (value, decimal = 0, shiftBy = false, fixed = 4) => {

        if (value === '' || value === undefined || isNaN(value)) {
            return '--';
        }
        let res = shiftBy
            ? new BigNumber(value).shiftedBy(-decimal).toFixed(fixed)
            : new BigNumber(value).toFixed(decimal, 1);
        let min = new BigNumber(1).shiftedBy(-fixed).toFixed();
        if (Number(value) > 0 && res < min) {
            res = '< ' + min;
        }
        return res;
    },

    toFormat: value => {
        const val = new BigNumber(value);
        return !val.isNaN() ? val.toFormat() : value;
    },

    numberFormat: (data, acc) => {
        if(isNaN(data)) return '--'
        if(data == 0) return 0

        return Number(new BigNumber(data).toFixed(acc));
    },

    exist: value => {
        if (value === '' || value === undefined || isNaN(value)) {
            return '--';
        }
        return value;
    },

    assert: (value, field) => {
        return value ? (field ? value[field] : value) : undefined;
    },

    pick: (value, field) => {
        if (value === '' || value === undefined || value === null) {
            return '';
        }
        return field ? value[field] : value;
    },

    hash: txHash => {
        if (!txHash) {
            return '--';
        }
        return (
            txHash.substring(0, 6) +
            '...' +
            txHash.substring(txHash.length - 6, txHash.length)
        );
    },

    moment: (value, formatString) => {
        formatString = formatString || 'YYYY-MM-DD HH:mm:ss';
        return moment(Number.parseInt(new Date(value).getTime())).format(
            formatString
        ); // 这是时间戳转时间
    },

    //  1:  x>y;    -1:	x<y;        0: x==y
    comparedTo: (x, y,) => {
        x = new BigNumber(x || 0);
        y = new BigNumber(y || 0);
        return x.comparedTo(y);
    },

    moreLessThan: (value, acc = 4) => {
        const val = new BigNumber(value);
        return !val.isZero() && val.isLessThan(0.0001)
            ? '< 0.0001'
            : val.isNaN()
                ? value
                : val.toFormat(acc);
    }
};

for (let key in filter) {
    Vue.filter(key, filter[key]);
}

export {filter};
