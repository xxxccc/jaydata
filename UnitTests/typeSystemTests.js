﻿$(document).ready(function () {
    module("typeSystemTests");
    test("Class framework initialization", 2, function () {
        equal("$data" in window, true, "$data is defined");
        equal("Class" in $data, true, "Class is defined");

    });

    //define class
    var dataClass = $data.Class.define('dataClass', null, null, {
        constructor: function (param) {
            this.testProp = 5;
            this.param = param;
            this.testFunc2 = function () { return 'testfunc2'; };
        },
        testFunc: function () { return 'testfunc'; },
        getParam: function () { return this.param; },
        testProperty: {}
    }, null);

    test("Type definition", 8, function () {
        equal(dataClass.__class, true, "dataClass __class");
        equal(dataClass.name, "dataClass", "dataClass name");
        equal(dataClass, dataClass.prototype.constructor, "dataClass equal with ctor");
        equal(dataClass.inheritsFrom.name, "Base", "dataClass inherits from Base");
        equal(dataClass.memberDefinitions instanceof $data.MemberDefinitionCollection, true, "dataClass memberDefinitions exists");
        var defs = dataClass.memberDefinitions.asArray();
        equal(defs.length, 8, "dataClass memberDefinitions count");

        equal(defs[0].kind, "method", "dataClass memberDefinitions[0] type");
        equal(defs[3].kind, "property", "dataClass memberDefinitions[3] type");
    });

    test("Type definition - type alias", 17, function () {

        var typeAlias = $data.Class.define('typeAlias', null, null, {
            prop1: { dataType: "integer", key: true },
            prop2: { type: "string" },
            prop3: { type: "$data.String" },
            prop4: {},
            prop5: { type: $data.String },
            prop6: { type: "date" }
        }, null);

        var memDef = typeAlias.getMemberDefinition('prop1');
        ok(memDef.dataType === "integer", 'type equal failed');
        ok(memDef.type === "integer", 'type equal failed');
        ok(Container.resolveType(memDef.dataType) === $data.Integer, 'type equal failed');

        var memDef = typeAlias.getMemberDefinition('prop2');
        ok(memDef.dataType === "string", 'type equal failed');
        ok(memDef.type === "string", 'type equal failed');
        ok(Container.resolveType(memDef.dataType) === $data.String, 'type equal failed');


        var memDef = typeAlias.getMemberDefinition('prop3');
        ok(memDef.dataType === "$data.String", 'type equal failed');
        ok(memDef.type === "$data.String", 'type equal failed');
        ok(Container.resolveType(memDef.dataType) === $data.String, 'type equal failed');

        var memDef = typeAlias.getMemberDefinition('prop4');
        ok(memDef.dataType === undefined, 'type equal failed');
        ok(memDef.type === undefined, 'type equal failed');

        var memDef = typeAlias.getMemberDefinition('prop5');
        ok(memDef.dataType === $data.String, 'type equal failed');
        ok(memDef.type === $data.String, 'type equal failed');
        ok(Container.resolveType(memDef.dataType) === $data.String, 'type equal failed');

        var memDef = typeAlias.getMemberDefinition('prop6');
        ok(memDef.dataType === "date", 'type equal failed');
        ok(memDef.type === "date", 'type equal failed');
        ok(Container.resolveType(memDef.dataType) === $data.Date, 'type equal failed');
    });

    test("Type instance", 7, function () {
        var testClass = new dataClass('testParam');

        equal(testClass instanceof dataClass, true, "testClass is dataClass");
        equal(testClass.constructor.memberDefinitions instanceof $data.MemberDefinitionCollection, true, "testClass is $data.MemberDefinitionCollection");
        equal(testClass.testFunc(), "testfunc", "testClass invoke func");
        equal(testClass.testFunc2(), "testfunc2", "testClass invoke func2");
        equal(testClass.param, "testParam", "testClass invoke property");
        equal(testClass.testProp, 5, "testClass invoke property2");

        equal(testClass.constructor.memberDefinitions.getPublicMappedProperties().length, 1, "getPublicMappedProperties length");

    });

    var nsClass = $data.Class.define('$namespace5.hello.world.nsClass', null, null, {}, null);

    test("Type definition - name with namespace ", 3, function () {
        var myNsClass = new nsClass();

        notEqual(nsClass, undefined, "nsClass is defined");
        notEqual($namespace5.hello.world.nsClass, undefined, "$namespace5.hello.world.nsClass is defined");
        equal(nsClass.name, "nsClass", "$namespace5.hello.world.nsClass name is nsClass");
    });

    //define class with inheritence
    var classBase = $data.Class.define('classBase', dataClass, null, {
        constructor: function (param) {
            this.param2 = param;
        },
        classProp: {},
        classFunc: function (value) { return value; }
    }, null);

    test("Type definition - Inheritance", 9, function () {
        equal(classBase.__class, true, "classBase __class");
        equal(classBase.name, "classBase", "classBase name");
        equal(classBase, classBase.prototype.constructor, "classBase equal with ctor");
        equal(classBase.inheritsFrom.name, "dataClass", "classBase inherits from dataClass");
        equal(classBase.memberDefinitions instanceof $data.MemberDefinitionCollection, true, "dataClass memberDefinitions exists");

        var defs = classBase.memberDefinitions.asArray();
        equal(defs.length, 10, "classBase memberDefinitions count");

        equal(defs[0].kind, "method", "classBase memberDefinitions[0] - constructor type");
        equal(defs[4].kind, "method", "classBase memberDefinitions[4] type");
        equal(defs[5].kind, "property", "classBase memberDefinitions[5] type");
    });

    test("Type instance - Inheritance", 10, function () {
        var class2 = new classBase('class2Param');

        equal(class2 instanceof classBase, true, "class2 is classBase");
        equal(class2 instanceof dataClass, true, "class2 is dataClass");
        equal(class2.constructor.memberDefinitions instanceof $data.MemberDefinitionCollection, true, "class2 is $data.MemberDefinitionCollection");
        equal(class2.constructor.memberDefinitions.getPublicMappedProperties().length, 2, "getPublicMappedProperties length");

        equal(class2.testFunc(), "testfunc", "class2 invoke base func");
        equal(class2.testFunc2(), "testfunc2", "class2 invoke base func2");
        equal(class2.param, "class2Param", "class2 invoke base property");
        equal(class2.testProp, 5, "class2 invoke base property2");

        equal(class2 instanceof dataClass, true, "class2 is dataClass");
        equal(class2.param, class2.param2, "testClass invoke property2");

    });

    test("Type instance - getType()", 7, function () {
        var testClass = new dataClass('testParam');
        notEqual(testClass.getType(), undefined, "testClass getType");
        equal(testClass.getType().name, dataClass.name, "testClass getType name equal type name");
        equal(testClass.getType().name, testClass.constructor.name, "testClass getType name equal ctor name");

        var class2 = new classBase('class2Param');
        equal(class2.getType().name, classBase.name, "class2 getType name equal type name");
        equal(class2.getType().name, class2.constructor.name, "class2 getType name equal ctor name");

        class2.constructor = function () { return {}; };
        notEqual(class2.getType().name, class2.constructor.name, "class2 getType name notequal ctor name");
        equal(class2.getType().name, classBase.name, "class2 getType name equal type name");
    });

    var propertyDataClass = $data.Class.define('propertyDataClass', $data.Entity, null, {
        prop1: { dataType: "integer", value: 5, enumerable: true },
        prop2: { dataType: "string", value: "hello world" },
        prop3: { dataType: "string", enumerable: true },
        prop4: { dataType: "integer", value: 5, enumerable: false },
        prop5: { dataType: "string", enumerable: false },
        prop5_1: { dataType: "string" },
        prop6: 10,
        prop7: "hello world",
    }, null);

    test("Type instance - properties", 10, function () {
        var myPropClass = new propertyDataClass('testParam');

        equal(myPropClass.prop1, 5, "prop1 is 5");
        equal(myPropClass.prop2, "hello world", "prop1 is 'hello world'");
        equal(myPropClass.prop3, undefined, "prop1 is undefined");

        equal(Object.keys(myPropClass).some(function (s) { return s == 'prop1'; }), propertyDataClass.__copyPropertiesToInstance, 'prop1 is enumberable');
        equal(Object.keys(myPropClass).some(function (s) { return s == 'prop3'; }), propertyDataClass.__copyPropertiesToInstance, 'prop3 is enumberable');
        equal(Object.keys(myPropClass).some(function (s) { return s == 'prop4'; }), false, 'prop4 is not enumberable');
        equal(Object.keys(myPropClass).some(function (s) { return s == 'prop5'; }), false, 'prop5 is not enumberable');
        equal(Object.keys(myPropClass).some(function (s) { return s == 'prop5_1'; }), propertyDataClass.__copyPropertiesToInstance, 'prop5_1 is enumberable');

        equal(myPropClass.prop6, 10, "prop6 is 5");
        equal(myPropClass.prop7, "hello world", "prop6 is 'hello world'");
    });

    test("Type instance - property events", 10, function () {
        var myPropClass = new propertyDataClass();

        equal(myPropClass._propertyChanging, undefined, 'event store property undefined');
        equal(myPropClass.propertyChanging.getType().name, "Event", 'event property defined');
        notEqual(myPropClass._propertyChanging, undefined, 'event store property not undefined');

        equal(myPropClass._propertyChanged, undefined, 'event store property undefined');
        equal(myPropClass.propertyChanged.getType().name, "Event", 'event property defined');
        notEqual(myPropClass._propertyChanged, undefined, 'event store property not undefined');

        myPropClass.prop3 = 5;
        stop(1);
        myPropClass.propertyChanged.attach(function (sender, eventData) {
            start(1);
            equal(myPropClass, sender, "event sender");
            equal(eventData.propertyName, 'prop3', "changed property name");
            equal(eventData.oldValue, 5, "old property value");
            equal(eventData.newValue, 7, "new property value");
        });

        myPropClass.prop3 = 7;

    });

    //defineEx class with inheritence
    var classEx = $data.Class.define('classEx', dataClass, null, {
        constructor: function (param) {
            this.param2 = param;
        },
        classProp: {},
        classFunc: function (value) { return value; }
    }, null);

    test("Type definition - Inheritance", 9, function () {
        equal(classEx.__class, true, "classEx __class");
        equal(classEx.name, "classEx", "classEx name");
        equal(classEx, classEx.prototype.constructor, "classEx equal with ctor");
        equal(classEx.inheritsFrom.name, "dataClass", "classEx inherits from dataClass");
        equal(classEx.memberDefinitions instanceof $data.MemberDefinitionCollection, true, "classEx memberDefinitions exists");
        equal(classEx.memberDefinitions.asArray().length, 10, "classEx memberDefinitions count");

        equal(classBase.memberDefinitions.asArray()[0].kind, "method", "classEx memberDefinitions[0] type");
        equal(classBase.memberDefinitions.asArray()[4].kind, "method", "classEx memberDefinitions[4] type");
        equal(classBase.memberDefinitions.asArray()[5].kind, "property", "classEx memberDefinitions[5] type");
    });

    test("Type instance extended - Inheritance", 9, function () {
        var class2 = new classBase('class2Param');

        equal(class2 instanceof classBase, true, "class2 is classBase");
        equal(class2 instanceof dataClass, true, "class2 is dataClass");
        equal(class2.constructor.memberDefinitions instanceof $data.MemberDefinitionCollection, true, "class2 has members");
        equal(class2.testFunc(), "testfunc", "class2 invoke func");
        equal(class2.testFunc2(), "testfunc2", "class2 invoke func2");
        equal(class2.param, "class2Param", "class2 invoke property");
        equal(class2.testProp, 5, "class2 invoke property2");

        equal(class2 instanceof dataClass, true, "class2 is dataClass");
        equal(class2.param, class2.param2, "testClass invoke property2");

    });

    var simpleClass = $data.Class.define('simpleClass', null, null, {
        constructor: function () {
            this.simpleProp = 5;
            this.ctorArguments = arguments;
            this.array = [];
        },
        simpleProp: {},
        simpleFunc: function (input) { return input + this.simpleProp; },
        reverse: function (input) { return input.reverse(); },
        reverse2: function (input) { return input.reverse(); }
    }, null);

    test("Type instance calculated val", 9, function () {
        var class3 = new simpleClass();

        equal(class3.simpleProp, 5, "class3 property");
        equal(class3.simpleFunc(3), 8, "class3 calculated val func");
        class3.simpleProp += 2;
        equal(class3.simpleProp, 7, "class3 property");
        equal(class3.simpleFunc(3), 10, "class3 calculated val func");

        var class3_1 = new simpleClass();


        equal(class3.array.length, 0, "inst1 array length must be 0");
        equal(class3_1.array.length, 0, "inst2 array length must be 0");
        class3.array.push('j');
        equal(class3.array.length, 1, "inst1 array length must be 1");
        equal(class3_1.array.length, 0, "inst2 array length must be 0");
        ok(class3.hasOwnProperty("array"), "array is defined on instace");
    });

    var simpleClass2 = $data.Class.define('simpleClass2', null, null, {
        constructor: function () {
            this.ctorArguments = arguments;
        }
    }, null);

    var mixClass2 = $data.Class.defineEx('mixClass2', [
        { type: dataClass, params: [new ConstructorParameter(0), 'hello2', 1337] },
        { type: simpleClass, propagateTo: 'simpleClass' },
        { type: simpleClass2, params: [new ConstructorParameter(1), 8080], propagateTo: 'simpleClass2' }
    ], null, {
        constructor: function () {
            this.ctorArguments = arguments;
        },
        reverse2: function (input) { return input; },
        simpleClass: {},
        simpleClass2: {}
    }, null);

    test("Type instance - propagation - ctor parameters", 21, function () {
        var class4 = new mixClass2('param0', 'world', 1, 2, 3, 4, 5);

        equal(class4 instanceof dataClass, true, "class4 is dataClass");
        equal(class4 instanceof simpleClass, false, "class4 is simpleClass");
        equal(class4 instanceof simpleClass2, false, "class4 is simpleClass2");

        ok(class4.simpleClass, 'mixin exists');
        ok(class4.simpleClass2, 'mixin exists');

        equal(class4.ctorArguments.length, 7, 'class4 constructor parameters count');
        equal(class4.ctorArguments[0], 'param0', 'class4 constructor parameter');
        equal(class4.ctorArguments[1], 'world', 'class4 constructor parameter');
        equal(class4.ctorArguments[2], 1, 'class4 constructor parameter');

        equal(class4.simpleClass.ctorArguments.length, 7, "class4 simpleClass's constructor parameter count");

        equal(class4.simpleClass2.ctorArguments.length, 2, "class4 simpleClass2's constructor parameter count");
        equal(class4.simpleClass2.ctorArguments[0], 'world', "class4 simpleClass2's constructor parameter");
        equal(class4.simpleClass2.ctorArguments[1], 8080, "class4 simpleClass2's constructor parameter");

        var class5 = new mixClass2('hello', 'world');

        equal(class5.ctorArguments.length, 2, 'class5 constructor parameters count');
        equal(class5.ctorArguments[0], 'hello', 'class5 constructor parameter');
        equal(class5.ctorArguments[1], 'world', 'class5 constructor parameter');
        equal(class5.ctorArguments[2], undefined, 'class5 constructor parameter');

        equal(class5.simpleClass.ctorArguments.length, 2, "class5 simpleClass's constructor parameter count");

        equal(class5.simpleClass2.ctorArguments.length, 2, "class5 simpleClass2's constructor parameter count");
        equal(class5.simpleClass2.ctorArguments[0], 'world', "class5 simpleClass2's constructor parameter");
        equal(class5.simpleClass2.ctorArguments[1], 8080, "class5 simpleClass2's constructor parameter");

    });

    var simpleClass3 = $data.Class.define('simpleClass3', null, null, {
        constructor: function () {
            this.ctorArguments = arguments;
        },
    }, null);

    var mixClass3 = $data.Class.defineEx('mixClass3', [
        { type: dataClass, params: [new ConstructorParameter(0), 'almafa', 1337] },
        { type: simpleClass, propagateTo: 'simpleClass' },
        { type: simpleClass3, params: [function () { return this; }, function () { return this.simpleClass; }, new ConstructorParameter(1), 8080], propagateTo: 'simpleClass3' }
    ], null, {
        constructor: function () {
            this.ctorArguments = arguments;
        },
        reverse2: function (input) { return input; },
        simpleClass: {},
        simpleClass3: {}
    }, null);

    test("Type instance - propagation - ctor parameters", 4, function () {
        var class4 = new mixClass3('param0');

        equal(class4.simpleClass3.ctorArguments.length, 4, "class4 constructor parameters count");
        equal(class4.simpleClass3.ctorArguments[2], undefined, "class4 not defined parameter");
        equal(class4.simpleClass3.ctorArguments[0].constructor.name, mixClass3.name, "class4 first function parameter");
        equal(class4.simpleClass3.ctorArguments[1].constructor.name, simpleClass.name, "class4 second funtion parameter");

    });

    var propClass = $data.Class.define('propClass', null, null, {
        constructor: function () {
            this.prop1 = 1;
            this.prop2 = 2;
            this.prop3 = 3;
            this.prop4 = 4;
        },
        prop1: {},
        prop2: {},
        prop3: {},
        prop4: {}
    }, null);

    var mixinClass = $data.Class.defineEx('mixinClass', [
        { type: null },
        { type: propClass }
    ], null, {
        constructor: function () {
            this.prop2 = 12;
            this.prop5 = 5;
        },
        prop2: {},
        prop5: {},
        testFunc: function (input) { return input; }
    }, null);

    test("Type definition - mixin", 8, function () {
        equal(mixinClass.__class, true, "mixinClass __class");
        equal(mixinClass.name, "mixinClass", "mixinClass name");
        equal(mixinClass, mixinClass.prototype.constructor, "mixinClass equal with ctor");
        equal(mixinClass.inheritsFrom.name, "Base", "mixinClass inherits from Base");
        equal(mixinClass.memberDefinitions instanceof $data.MemberDefinitionCollection, true, "mixinClass memberDefinitions exists");
        equal(mixinClass.memberDefinitions.asArray().length, 11, "mixinClass memberDefinitions count");

        equal(mixinClass.mixins.length, 1, "mixinClass mixins count");
        equal(mixinClass.mixins[0].type, propClass, "mixinClass mixin - simpleClass");

    });

    test("Type instance - mixin", 5, function () {
        var class4 = new mixinClass();

        equal(class4.constructor.memberDefinitions instanceof $data.MemberDefinitionCollection, true, "class4 has members");
        equal(class4.constructor.memberDefinitions.asArray().length, 11, "class4 member count");

        equal(class4.prop1, 1, "class4 mixin's prop value");
        equal(class4.prop2, 12, "class4 prop value, mixin not override");
        equal(class4.prop5, 5, "class4 prop value");
    });

    var propClass2 = $data.Class.define('propClass2', null, null, {
        constructor: function () {
            this.prop11 = 11;
            this.prop12 = 12;
            this.prop13 = 13;
        },
        prop11: {},
        prop12: {},
        prop13: {},
        prop14: {}
    }, null);

    var mixinClass2 = $data.Class.defineEx('mixinClass', [
        { type: null },
        { type: propClass, kind: 'mixin' },
        { type: propClass2, kind: 'mixin' }
    ], null, {
        constructor: function () {
            this.prop2 = 12;
            this.prop12 = 5;
        },
        prop2: {},
        prop5: {},
        testFunc: function (input) { return input; }
    }, null);

    test("Type instance - mixin double", 6, function () {
        var class4 = new mixinClass2();

        equal(mixinClass2.mixins.length, 2, "mixinClass2 mixins count");
        equal(class4.constructor.memberDefinitions.asArray().length, 15, "class4 member count");

        equal(class4.prop5, undefined, "class4 prop value not set");

        equal(class4.prop11, 11, "class4 prop value");
        equal(class4.prop12, 5, "class4 mixin property set in constructor");
        equal(class4.prop14, undefined, "class4 mixin's prop value not set");
    });

    var mixinClass3 = $data.Class.defineEx('mixinClass', [
        { type: null },
        { type: propClass, propagateTo: 'propClass' },
        { type: propClass2 }
    ], null, {
        constructor: function () {
            //not inicialized exception
            //this.prop2 = 12;
            this.prop12 = 5;
        },
        prop5: {},
        propClass: {},
        testFunc: function (input) { return input; }
    }, null);

    test("Type instance - mixin & propagation", 11, function () {
        equal(mixinClass3.propagations.length, 1, "mixinClass2 propagations count");
        equal(mixinClass3.mixins.length, 1, "mixinClass2 mixins count");

        var class4 = new mixinClass3();

        equal(class4.prop1, 1, "class4 propagations's prop value");
        equal(class4.prop2, class4.propClass.prop2, "class4 propagations prop value override");
        notEqual(class4.prop2, 12, "class4 propagations prop value override");
        equal(class4.prop2, 2, "class4 propagations prop value override");

        equal(class4.prop3, 3, "class4 propagations prop value override");
        equal(class4.prop5, undefined, "class4 prop value not set");

        equal(class4.prop11, 11, "class4 prop value");
        equal(class4.prop12, 5, "class4 mixin property set in constructor");
        equal(class4.prop14, undefined, "class4 mixin's prop value not set");
    });

    test("Container - override", 2, function () {

        try {
            $data.Container.resolveType('$some.int');
        } catch (e) {
            equal(e.message, 'Unable to resolve type:$some.int', 'type override throw error failed');
        }

        $data.Container.registerType('$some.int', $data.Integer);
        console.log('int overrid - TEST! $data.Integer to $data.Integer');
        equal($data.Container.resolveType('$some.int'), $data.Integer, 'int override failed');

    });

    test("Type simple mixin", 3, function () {
        $data.Class.define("Types.A", null, null, {
        });

        $data.Class.define("Types.B", null, null, {
        });

        $data.Class.defineEx("Types.C", [Types.A, Types.B], null, {
        });

        equal(Types.C.mixins.length, 1, 'mixins count failed');
        equal(Types.C.mixins[0].type.fullName, 'Types.B', 'mixin failed');
        equal(Types.C.inheritsFrom.fullName, 'Types.A', 'mixin failed');

    });

    test('Type inhertitance ctor init', 9, function () {
        $data.Entity.extend("Types.AA", {
            Title: { type: 'string' }
        });

        Types.AA.extend("Types.BB", {
            Desc: {type: 'string'}
        });

        var item = new Types.AA({ Title: 'hello', Desc: 'world', Age: 23 });
        equal(item.Title, 'hello', 'AA.Title ctor init failed');
        notEqual(item.Desc, 'world', 'AA.Desc ctor init failed');
        equal(item.Desc, undefined, 'AA.Desc ctor init failed');
        notEqual(item.Age, 23, 'AA.Age ctor init failed');
        equal(item.Age, undefined, 'AA.Age ctor init failed');

        item = new Types.BB({ Title: 'hello', Desc: 'world', Age: 23 });
        equal(item.Title, 'hello', 'BB.Title ctor init failed');
        equal(item.Desc, 'world', 'BB.Desc ctor init failed');
        notEqual(item.Age, 23, 'BB.Age ctor init failed');
        equal(item.Age, undefined, 'BB.Age ctor init failed');

    });


    test("Extends fail", 1, function () {
        raises(function () {
            var target = "";
            var obj = { a: 1 };
            $data.typeSystem.extend(target, obj);
        }, "Exception thrown");
    });

    test("Extends noparam", 2, function () {
        var target = { a: 1 };
        $data.typeSystem.extend(target);
        equals(Object.keys(target).length, 1, "Key count");
        equals(target.a, 1, "Param value");
    });

    test("Extends multiple param", 4, function () {
        var target = { a: 1 };
        var obj1 = { b: 2 };
        var obj2 = { c: 3 };
        $data.typeSystem.extend(target, obj1, obj2);
        equals(Object.keys(target).length, 3, "Key count");
        equals(target.a, 1, "Param 'a'");
        equals(target.b, 2, "Param 'b'");
        equals(target.c, 3, "Param 'c'");
    });
    test("Extends overwrite", 2, function () {
        var target = { a: 1 };
        var obj = { a: 2 };
        $data.typeSystem.extend(target, obj);
        equals(Object.keys(target).length, 1, "Key count");
        equal(target.a, 2, "Param 'a'");
    });
    test("Extends multiple param overwrite", 2, function () {
        var target = { a: 1 };
        var obj1 = { a: 2 };
        var obj2 = { a: 3 };
        $data.typeSystem.extend(target, obj1, obj2);
        equals(Object.keys(target).length, 1, "Key count");
        equal(target.a, 3, "Param 'a'");
    });

    test("Trace tests", 4, function () {
        equal(typeof $data.TraceBase, 'function', '$data.TraceBase exists failed');

        notEqual(typeof $data.Trace, 'undefined', '$data.Trace exists failed');

        equal(typeof $data.Logger, 'function', '$data.Logger exists failed');

        try {
            $data.Trace.log('hello', 'console', 42, { prop: 24 }, [1, 2, 3]);
            $data.Trace = new $data.Logger();
            $data.Trace.log('hello', 'console', 42, { prop: 24 }, [1, 2, 3]);
            ok(true, '$data.Trace not throw exception');
        } catch (e) {
            ok(false, '$data.Trace failed: ' + e);
        }

    });


    test('Type add member', 26, function () {
        $data.Entity.extend("Types.AAExtended", {
            Title: { type: 'string' }
        });

        var item = new Types.AAExtended({ Title: 'hello', Desc: 'world', Age: 23 });
        equal(item.Title, 'hello', '1 Title ctor init failed');
        notEqual(item.Desc, 'world', '1 Desc ctor init failed');
        equal(item.Desc, undefined, '1 Desc ctor init failed');
        notEqual(item.Age, 23, '1 Age ctor init failed');
        equal(item.Age, undefined, '1 Age ctor init failed');

        var props = Types.AAExtended.memberDefinitions.getPublicMappedProperties().map(function (def) { return def.name; });
        deepEqual(props, ['Title'], '1 public members failed');

        Types.AAExtended.addMember('Desc', {
            type: 'string'
        });

        item = new Types.AAExtended({ Title: 'hello', Desc: 'world', Age: 23 });
        equal(item.Title, 'hello', '2 Title ctor init failed');
        equal(item.Desc, 'world', '2 Desc ctor init failed');
        notEqual(item.Age, 23, '2 Age ctor init failed');
        equal(item.Age, undefined, '2 Age ctor init failed');

        props = Types.AAExtended.memberDefinitions.getPublicMappedProperties().map(function (def) { return def.name; });
        deepEqual(props, ['Title', 'Desc'], '1 public members failed');


        Types.AAExtended.extend("Types.BBExtended", {
            Age: { type: 'int' }
        });

        item = new Types.AAExtended({ Title: 'hello', Desc: 'world', Age: 23 });
        equal(item.Title, 'hello', '3 Title ctor init failed');
        equal(item.Desc, 'world', '3 Desc ctor init failed');
        notEqual(item.Age, 23, '3 Age ctor init failed');
        equal(item.Age, undefined, '3 Age ctor init failed');

        props = Types.AAExtended.memberDefinitions.getPublicMappedProperties().map(function (def) { return def.name; });
        deepEqual(props, ['Title', 'Desc'], '1 public members failed');

        item = new Types.BBExtended({ Title: 'hello', Desc: 'world', Age: 23 });
        equal(item.Title, 'hello', '3 Title ctor init failed');
        equal(item.Desc, 'world', '3 Desc ctor init failed');
        equal(item.Age, 23, '3 Age ctor init failed');

        props = Types.BBExtended.memberDefinitions.getPublicMappedProperties().map(function (def) { return def.name; });
        deepEqual(props, ['Age', 'Title', 'Desc'], '1 public members failed');


        Types.AAExtended.addMember('memberFunc', function (param1) {
            return 'hello world' + param1;
        });

        equal(typeof item.memberFunc, 'function', 'function defined');
        equal(item.memberFunc('!!!'), 'hello world!!!', 'defined function call');
        props = Types.AAExtended.memberDefinitions.getPublicMappedProperties().map(function (def) { return def.name; });
        deepEqual(props, ['Title', 'Desc'], 'public members failed 2');
        var member = Types.AAExtended.memberDefinitions.getMember('memberFunc');
        equal(member instanceof $data.MemberDefinition, true, 'member type');
        equal(member.kind, 'method', 'member kind');
        equal(typeof member.method, 'function', 'member method');

    });

    test('Type add field', 22, function () {
        $data.Entity.extend("Types.AAAExtendedProperty", {
            Title: { type: 'string' }
        });

        Types.AAAExtendedProperty.addProperty('GetTitleComputed', function () { return this.Title + ' world'; });

        var item = new Types.AAAExtendedProperty({ Title: 'hello' });
        equal(item.Title, 'hello', 'Title value');
        equal('GetTitleComputed' in item, true, 'computed property on item');
        equal(item.GetTitleComputed, 'hello world', 'computed property value');

        equal('GetTitleComputed2' in item, false, 'computed property not on item 2');

        Types.AAAExtendedProperty.addProperty('GetTitleComputed2', function () { return this.Title + ' world2'; });
        equal('GetTitleComputed2' in item, true, 'computed property on item 3');
        equal(item.GetTitleComputed2, 'hello world2', 'computed property value 3');

        item.GetTitleComputed2 = 'not hello';
        equal(item.GetTitleComputed2, 'hello world2', 'computed property value after change');

        Types.AAAExtendedProperty.addProperty('GetTitleComputed3', function () { return this.Title + ' world3'; }, function (value) { this.Title = value; });
        item.GetTitleComputed3 = 'hi';
        equal(item.GetTitleComputed3, 'hi world3', 'computed property value after change 2');

        Types.AAAExtendedProperty.addProperty('GetTitleComputed4', 'string', function () { return this.Title + ' world4'; }, function (value) { this.Title = value; });
        equal(item.GetTitleComputed4, 'hi world4', 'computed property value after change 3');


        var comp = Types.AAAExtendedProperty.memberDefinitions.getMember('GetTitleComputed4');
        equal(comp instanceof $data.MemberDefinition, true, 'memDef type');
        ok(Container.resolveType(comp.type) === $data.String, 'memDef type');
        equal('get' in comp, true, 'memDef get');
        equal('set' in comp, true, 'memDef set');
        equal(comp.notMapped, true, 'memDef notMapped');
        equal(comp.storeOnObject, true, 'memDef storeOnObject');

        comp = Types.AAAExtendedProperty.memberDefinitions.getMember('GetTitleComputed2');
        equal(comp instanceof $data.MemberDefinition, true, 'memDef type');
        ok(!comp.type, 'memDef type not set');
        equal('get' in comp, true, 'memDef get');
        equal('set' in comp, true, 'memDef set');
        equal(comp.set.toString().replace(/[\n ]/g, ''), "function(){}", 'setter default value');
        equal(comp.notMapped, true, 'memDef notMapped');
        equal(comp.storeOnObject, true, 'memDef storeOnObject');
    });

    test('Type add field to $news.Types.Article', 2, function () {
        var propDef = $news.Types.Article.memberDefinitions.getMember('shortLead');
        ok(!propDef, 'shortLead not defined');

        $news.Types.Article.addProperty('shortLead', 'string', function () {
            return this.Lead && this.Lead.length > 20 ? (this.Lead.substring(0, 20) + '...') : this.Lead; 
        });

        var article = new $news.Types.Article({ Title: 'Important Article', Lead: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur nec lorem est, eu ultricies quam. Proin venenatis dolor porta justo sodales laoreet. Mauris turpis risus, facilisis ac consequat quis, mollis a elit. In iaculis rutrum massa. In consectetur aliquet bibendum. Quisque tincidunt aliquet ante, eu sodales felis facilisis vel. Phasellus lacus turpis, euismod eu hendrerit vitae, elementum sit amet neque. Fusce eget justo eget ligula iaculis mollis. Aenean vitae commodo nibh. Nullam ut neque nec ante viverra sollicitudin' });
        equal(article.shortLead, 'Lorem ipsum dolor si...', 'short Lead value');


    });

    test('Type add member override', 11, function () {
        $data.Entity.extend("Types.AAOverride", {
            Title: { type: 'string' },
            myFunc: function () {
                return 'orig Function';
            }
        });

        var item = new Types.AAOverride({ Title: 'apple' });
        equal(item.myFunc(), 'orig Function', 'orig myFunc');
        equal(typeof item.myFunc2, 'undefined', 'not defined myFunc');

        Types.AAOverride.addMember('myFunc', function () {
            return 'Function #2';
        });

        equal(item.myFunc(), 'Function #2', 'updated myFunc');
        equal(typeof item.myFunc2, 'undefined', 'not defined myFunc 2');

        Types.AAOverride.addMember('myFunc2', function () {
            return 'myFunc2 Function #2';
        });

        equal(typeof item.myFunc2, 'function', 'defined myFunc 2');
        equal(item.myFunc2(), 'myFunc2 Function #2', 'myFunc2');

        var item2 = new Types.AAOverride({ Title: 'world' });
        equal(typeof item2.myFunc2, 'function', 'defined myFunc 2');
        equal(item2.myFunc2(), 'myFunc2 Function #2', 'myFunc2');

        var func = function () {
            return 'Function #3';
        };
        Types.AAOverride.addMember('myFunc', func);

        equal(item.myFunc(), 'Function #3', 'updated myFunc 2');
        ok(Types.AAOverride.memberDefinitions.getMember('myFunc').method === func, 'definition has good pointer');
        var def = Types.AAOverride.memberDefinitions.asArray().filter(function (d) { return d.name === 'myFunc'; })[0]
        ok(def.method === func, 'definition has good pointer 2');
    });

    test('type create factory', 8, function () {

        var instance = dataClass.create();
        equal(instance instanceof dataClass, true, 'instanceof');
        equal(instance instanceof $data.Base, true, 'instanceof base');
        equal(instance instanceof $data.Entity, false, 'instanceof entity');

        var art = $news.Types.Article.create({ Lead: 'lead', Title: 'title' });
        equal(art instanceof $news.Types.Article, true, 'instanceof');
        equal(art instanceof $data.Base, true, 'instanceof base');
        equal(art instanceof $data.Entity, true, 'instanceof entity');
        equal(art.Lead, 'lead', 'art.Lead');
        equal(art.Title, 'title', 'art.Title');

    });
});