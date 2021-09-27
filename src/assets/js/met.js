import BigNumber from 'bignumber.js';
import ChainApi from '../../../static/sdk/ChainApi';

const $number = (val = 1) => {
    return new BigNumber(val);
};
const $shiftedBy = (data, acc) => {
    if(!data) return 0
    // acc = Number(acc)
    return $number(data).shiftedBy(acc);
};
const $getRate = (item) => {
    const pl = $number(item.totalBorrow).plus(item.totalSupply);
    const val = $number(item.totalBorrow).dividedBy(pl).multipliedBy(100);
    return val.toFixed(2);
};
const $toFixed = (data, acc) => {
    if(isNaN(data)) return '--'
    if(data == 0) return 0
    return $number(data).toFixed(acc);
};
const $sort = (dataArray, sortColumn, isDesc) => {
    return dataArray.sort((pre, next) => {
        return isDesc ? (next[sortColumn] - pre[sortColumn]) : (pre[sortColumn] - next[sortColumn]);
    });
};

const $numberAndDecimal = value => {
    // console.log('$numberAndDecimal-->',value)
    let v = value.replace('。', '.');
    v = v.replace(/[^\d.]/g, '');
    v = v[0]=='.' ? '0.' + v : v;

    let split = v.split(".");

    if(split.length && split.length > 2){
        let c = '';
        for(let i=0; i<split.length; i++){
            c += split[i];
            i == 0 ? c+='.' : '';
        }

        v = c;
    }
    return v
}

//  1:  x>y;    -1:	x<y;        0: x==y
const $comparedTo = (x, y) => {
    x = new BigNumber(x || 0);
    y = new BigNumber(y || 0);
    return x.comparedTo(y);

};

// input val filter
const $filterNumber = (e) => {
    function clearNoNum(val) {
        // 先把非数字的都替换掉，除了数字和.
        val = val.replace(/[^\d.]/g, '');

        // 保证只有出现一个.而没有多个.
        val = val.replace(/\.{2,}/g, '.');

        // 必须保证第一个为数字而不是.
        val = val.replace(/^\./g, '');

        // 保证.只出现一次，而不能出现两次以上
        val = val.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');

        return val
    }
    e.target.value = clearNoNum(e.target.value);
}

const $numFormat = (val, flag) => {
    if( !val || !flag) return val;
    let reg = /(\d)(?=(?:\d{3})+$)/g;
    const strAry = val.toString().split('.')
    return `${strAry[0].replace(reg, '$1,')}${strAry.length > 1 ? "."+strAry[1] : ''}`
}

const install = Vue => {
    if (install.installed) return;// 如果已经注册过了，就跳过
    install.installed = true;
    Object.defineProperties(Vue.prototype, {
        $number: {
            get() {
                return $number;
            }
        },
        $toFixed: {
            get() {
                return $toFixed;
            }
        },
        $numFormat: {
            get() {
                return $numFormat;
            }
        },
        $numberAndDecimal: {
            get() {
                return $numberAndDecimal;
            }
        },
        $shiftedBy: {
            get() {
                return $shiftedBy;
            }
        },
        $getRate: {
            get() {
                return $getRate;
            }
        },
        $api: {
            get() {
                return ChainApi;
            }
        },
        $sort: {
            get() {
                return $sort;
            }
        },
        $comparedTo: {
            get() {
                return $comparedTo;
            }
        },
        $filterNumber: {
            get() {
                return $filterNumber;
            }
        }
    });

};

export default install;
