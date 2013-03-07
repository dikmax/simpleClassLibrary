describe("Class Library", function () {
    var ParentClass, ChildClass, obj;
    var field = "field";
    var method = function () {
        return true;
    };

    describe("Class with empty constructor", function () {
        beforeEach(function () {
            ChildClass = function () {
            };
        });

        it('should allow extend Object', function () {
            ChildClass.__extends__(Object);
            obj = new ChildClass();
            expect(obj instanceof ChildClass).toBeTruthy();
            expect(obj instanceof Object).toBeTruthy();
            expect(obj instanceof Function).toBeFalsy();
        });

        it('should have constructor property', function () {
            ChildClass.__extends__(Object);
            obj = new ChildClass();
            expect(obj.constructor).toEqual(ChildClass);
        });
    });

    describe("Class hierarchy", function () {
        beforeEach(function () {
            ParentClass = function () {
            };
            ParentClass.__extends__(Object);
            ChildClass = function () {
            };
            ChildClass.__extends__(ParentClass);
            obj = new ChildClass();
        });

        it('should inherit class members', function () {
            ParentClass.prototype.field = field;
            ParentClass.prototype.method = method;

            expect(obj.field).toEqual(field);
            expect(obj.method).toEqual(method);

        });

        it('should have superclass property', function () {
            expect(obj.superclass).toEqual(ParentClass);
        });
    });

    describe('__super__ method', function () {
        it('should execute super method', function () {
            ParentClass = function () {};
            ParentClass.__extends__(Object);
            ParentClass.NAME = 'ParentClass';
            ParentClass.prototype.method = function () {
                this.prop = 1;
            };
            ChildClass = function () {};
            ChildClass.__extends__(ParentClass);
            ChildClass.NAME = 'ChildClass';
            ChildClass.prototype.method = function () {
                this.__super__();
            };
            obj = new ChildClass();
            expect(function () {
                obj.method();
            }).not.toThrow();

            expect(obj.prop).toEqual(1);
        });

        it('should execute super method from constructor', function () {
            ParentClass = function () {
                this.prop = 1;
            };
            ParentClass.__extends__(Object);
            ChildClass = function () {
                this.__super__();
            };
            ChildClass.__extends__(ParentClass);
            obj = new ChildClass();

            expect(obj.prop).toEqual(1);
        });

        it('should pass parameters', function () {
            ParentClass = function (prop, prop2) {
                this.prop = prop;
                this.prop2 = prop2;
            };
            ParentClass.__extends__(Object);
            ChildClass = function (prop, prop2) {
                this.__super__(prop, prop2);
            };
            ChildClass.__extends__(ParentClass);
            obj = new ChildClass(1, 2);

            expect(obj.prop).toEqual(1);
            expect(obj.prop2).toEqual(2);
        });

        // Checking exceptions
        it('should throw exception if no constructor property in object', function () {
            ChildClass = function () {};
            ChildClass.prototype.method = function () {
                this.__super__();
            };
            obj = new ChildClass();

            expect(function () {
                obj.method();
            }).toThrow();
        });

        it('should throw exception if constructor property is not function', function () {
            ChildClass = function () {};
            ChildClass.prototype.method = function () {
                this.__super__();
            };
            obj = new ChildClass();
            obj.contructor = obj;

            expect(function () {
                obj.method();
            }).toThrow();
        });


        it('should throw exception if no parent method found', function () {
            ParentClass = function () {};
            ParentClass.__extends__(Object);

            ChildClass = function () {};
            ChildClass.__extends__(ParentClass);
            ChildClass.prototype.method = function () {
                this.__super__();
            }
            obj = new ChildClass();

            expect(function () {
                obj.method();
            }).toThrow();
        });

        it('should throw exception if method not found in prototype', function () {
            ParentClass = function () {};
            ParentClass.__extends__(Object);
            ParentClass.prototype.method = function () {};

            ChildClass = function () {};
            ChildClass.__extends__(ParentClass);
            obj = new ChildClass();
            obj.method = function () {
                this.__super__();
            };

            expect(function () {
                obj.method();
            }).toThrow();
        });
    });

    describe('Static properties', function () {
        it('object should have access to static class members through static', function () {
            ParentClass = function () {};
            ParentClass.__extends__(Object);
            ParentClass.static.field = field;
            ParentClass.static.method = method;

            obj = new ParentClass();
            expect(obj.static).toBeDefined();
            expect(obj.static.field).toEqual(field);
            expect(obj.static.method).toEqual(method);
        });

        it('should inherit static class members', function () {
            ParentClass = function () {};
            ParentClass.__extends__(Object);
            ParentClass.static.field = field;
            ParentClass.static.method = method;

            ChildClass = function () {
            };
            ChildClass.__extends__(ParentClass);

            expect(ChildClass.static.field).toEqual(field);
            expect(ChildClass.static.method).toEqual(method);
        });

        it('should allow __super__ call for static methods', function () {
            ParentClass = function () {};
            ParentClass.__extends__(Object);
            ParentClass.static.method = function () {
                this.prop = 1;
            };
            ChildClass = function () {};
            ChildClass.__extends__(ParentClass);
            ChildClass.static.method = function () {
                this.__super__();
            };

            ChildClass.static.method();
            expect(ChildClass.static.prop).toEqual(1);
        });

        // Checking exceptions
        it('should throw exception if no parent method found', function () {
            ParentClass = function () {};
            ParentClass.__extends__(Object);
            ChildClass = function () {};
            ChildClass.__extends__(ParentClass);
            ChildClass.static.method = function () {
                this.__super__();
            };

            expect(function () {
                ChildClass.static.method();
            }).toThrow();
        });

        it('should throw exception if method not found in context object', function () {
            ParentClass = function () {};
            ParentClass.__extends__(Object);
            ChildClass = function () {};
            ChildClass.__extends__(ParentClass);
            ChildClass.static.method = function () {
                this.__super__.call({});
            };

            expect(function () {
                ChildClass.static.method();
            }).toThrow();
        });
    });
});