!function () {

    var regularSuper = function () {
        var proto = this.constructor.prototype;
        var method;
        var caller = arguments.callee.caller;
        for (var i in proto) {
            //noinspection JSUnfilteredForInLoop
            if (proto[i] === caller) {
                method = i;
                break;
            }
        }
        if (method) {
            if (!proto.superclass || proto.superclass.prototype[method] === undefined) {
                throw "No inherited method found";
            }
            return proto.superclass.prototype[method].apply(this, arguments);
        }
    };

    var staticSuper = function () {
        var method;
        var caller = arguments.callee.caller;
        for (var i in this) {
            //noinspection JSUnfilteredForInLoop
            if (this[i] === caller) {
                method = i;
                break;
            }
        }
        if (method) {
            if (!this.superclass || this.superclass[method] === undefined) {
                throw "No inherited method found";
            }
            return this.superclass[method].apply(this, arguments);
        }

    };

    /**
     * @param {Function} parentCtor
     */
    Function.prototype.__extends__ = function (parentCtor) {
        var tempCtor = function () {
        };
        tempCtor.prototype = parentCtor.prototype;
        this.prototype = new tempCtor();
        this.prototype.constructor = this;
        this.prototype.superclass = parentCtor;
        this.prototype.__super__ = this.prototype.__super__ || regularSuper;

        tempCtor.prototype = parentCtor.static || {
            __super__: staticSuper
        };
        this.static = new tempCtor();
        this.static.superclass = parentCtor.static;
        this.prototype.static = this.static;
    };
}();

