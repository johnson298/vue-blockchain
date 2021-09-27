var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var utils;
(function (utils) {
    /**
 * 输出语句
 * @author middear
 *
 */
    var T = (function () {
        function T() {
        }
        /**
         * 输出语句
         */
        T.trace = function (message) {
            var optionalParams = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                optionalParams[_i - 1] = arguments[_i];
            }
            if (this.log)
                // console.log.apply(console, [message].concat(optionalParams));
            if (this.woyaoAlert) {
                if (optionalParams) {
                    alert(message + JSON.stringify(optionalParams));
                }
                else {
                    alert(message + "");
                }
            }
            if (T.isoutput)
                egret.log.apply(egret, [message].concat(optionalParams));
        };
        /**
         * 弹出提示面板
         */
        T.output = function (value) {
            alert(value);
        };
        T.isoutput = false;
        T.woyaoAlert = false;
        T.log = true;
        T.isUpToWeb = false;
        T.isSendToNative = false;
        return T;
    }());
    utils.T = T;
    __reflect(T.prototype, "utils.T");
})(utils || (utils = {}));
//# sourceMappingURL=T.js.map