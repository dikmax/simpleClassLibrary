!function () {
    /**
     * Implementation of __super__ method for regular object methods
     * @param {...*} args
     * @return {*}
     */
    var regularSuper = function () {
        // We looking for caller method name in object prototype.
        // Then we take method with the same name deeper in hierarchy.

        if (!this.constructor) {
            throw new Error("No constructor property found");
        }
        if (typeof this.constructor !== "function") {
            throw new Error("Constructor is not a function");
        }
        var proto = this.constructor.prototype;
        var method;
        var caller = arguments.callee.caller; // Get previous function from call stack.
        // Look for this function in object prototype
        for (var i in proto) {
            if (proto[i] === caller) {
                method = i;
                break;
            }
        }

        if (method) {
            // if method found, call it.
            if (!proto.superclass || proto.superclass.prototype[method] === undefined) {
                throw new Error("No inherited method found");
            }
            return proto.superclass.prototype[method].apply(this, arguments);
        } else {
            throw new Error("No method found");
        }
    };

    /**
     * Implementation of __super__ method for static object methods
     * @param {...*} args
     * @return {*}
     */
    var staticSuper = function () {
        // We looking for caller method name in calling context.
        // Then we take method with the same name deeper in hierarchy.

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
        } else {
            throw new Error("No method found");
        }

    };

    /**
     * @param {Function} parentCtor
     */
    Function.prototype.__extends__ = function (parentCtor) {
        var tempCtor = function () {};
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

