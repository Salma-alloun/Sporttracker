"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateActivityDto = void 0;
// src/activity/dto/create-activity.dto.ts
var class_validator_1 = require("class-validator");
var class_transformer_1 = require("class-transformer");
var CreateActivityDto = function () {
    var _a;
    var _userId_decorators;
    var _userId_initializers = [];
    var _userId_extraInitializers = [];
    var _sport_decorators;
    var _sport_initializers = [];
    var _sport_extraInitializers = [];
    var _duration_decorators;
    var _duration_initializers = [];
    var _duration_extraInitializers = [];
    var _distance_decorators;
    var _distance_initializers = [];
    var _distance_extraInitializers = [];
    var _averageSpeed_decorators;
    var _averageSpeed_initializers = [];
    var _averageSpeed_extraInitializers = [];
    var _calories_decorators;
    var _calories_initializers = [];
    var _calories_extraInitializers = [];
    var _isCompleted_decorators;
    var _isCompleted_initializers = [];
    var _isCompleted_extraInitializers = [];
    var _route_decorators;
    var _route_initializers = [];
    var _route_extraInitializers = [];
    var _startTime_decorators;
    var _startTime_initializers = [];
    var _startTime_extraInitializers = [];
    var _endTime_decorators;
    var _endTime_initializers = [];
    var _endTime_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateActivityDto() {
                this.userId = __runInitializers(this, _userId_initializers, void 0);
                this.sport = (__runInitializers(this, _userId_extraInitializers), __runInitializers(this, _sport_initializers, void 0));
                this.duration = (__runInitializers(this, _sport_extraInitializers), __runInitializers(this, _duration_initializers, void 0));
                this.distance = (__runInitializers(this, _duration_extraInitializers), __runInitializers(this, _distance_initializers, void 0));
                this.averageSpeed = (__runInitializers(this, _distance_extraInitializers), __runInitializers(this, _averageSpeed_initializers, void 0));
                this.calories = (__runInitializers(this, _averageSpeed_extraInitializers), __runInitializers(this, _calories_initializers, void 0));
                this.isCompleted = (__runInitializers(this, _calories_extraInitializers), __runInitializers(this, _isCompleted_initializers, void 0));
                this.route = (__runInitializers(this, _isCompleted_extraInitializers), __runInitializers(this, _route_initializers, void 0));
                this.startTime = (__runInitializers(this, _route_extraInitializers), __runInitializers(this, _startTime_initializers, void 0));
                this.endTime = (__runInitializers(this, _startTime_extraInitializers), __runInitializers(this, _endTime_initializers, void 0));
                __runInitializers(this, _endTime_extraInitializers);
            }
            return CreateActivityDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _userId_decorators = [(0, class_validator_1.IsNumber)()];
            _sport_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.MinLength)(2)];
            _duration_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _distance_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _averageSpeed_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _calories_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _isCompleted_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            _route_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsObject)({ each: true })];
            _startTime_decorators = [(0, class_validator_1.IsOptional)(), (0, class_transformer_1.Type)(function () { return Date; })];
            _endTime_decorators = [(0, class_validator_1.IsOptional)(), (0, class_transformer_1.Type)(function () { return Date; })];
            __esDecorate(null, null, _userId_decorators, { kind: "field", name: "userId", static: false, private: false, access: { has: function (obj) { return "userId" in obj; }, get: function (obj) { return obj.userId; }, set: function (obj, value) { obj.userId = value; } }, metadata: _metadata }, _userId_initializers, _userId_extraInitializers);
            __esDecorate(null, null, _sport_decorators, { kind: "field", name: "sport", static: false, private: false, access: { has: function (obj) { return "sport" in obj; }, get: function (obj) { return obj.sport; }, set: function (obj, value) { obj.sport = value; } }, metadata: _metadata }, _sport_initializers, _sport_extraInitializers);
            __esDecorate(null, null, _duration_decorators, { kind: "field", name: "duration", static: false, private: false, access: { has: function (obj) { return "duration" in obj; }, get: function (obj) { return obj.duration; }, set: function (obj, value) { obj.duration = value; } }, metadata: _metadata }, _duration_initializers, _duration_extraInitializers);
            __esDecorate(null, null, _distance_decorators, { kind: "field", name: "distance", static: false, private: false, access: { has: function (obj) { return "distance" in obj; }, get: function (obj) { return obj.distance; }, set: function (obj, value) { obj.distance = value; } }, metadata: _metadata }, _distance_initializers, _distance_extraInitializers);
            __esDecorate(null, null, _averageSpeed_decorators, { kind: "field", name: "averageSpeed", static: false, private: false, access: { has: function (obj) { return "averageSpeed" in obj; }, get: function (obj) { return obj.averageSpeed; }, set: function (obj, value) { obj.averageSpeed = value; } }, metadata: _metadata }, _averageSpeed_initializers, _averageSpeed_extraInitializers);
            __esDecorate(null, null, _calories_decorators, { kind: "field", name: "calories", static: false, private: false, access: { has: function (obj) { return "calories" in obj; }, get: function (obj) { return obj.calories; }, set: function (obj, value) { obj.calories = value; } }, metadata: _metadata }, _calories_initializers, _calories_extraInitializers);
            __esDecorate(null, null, _isCompleted_decorators, { kind: "field", name: "isCompleted", static: false, private: false, access: { has: function (obj) { return "isCompleted" in obj; }, get: function (obj) { return obj.isCompleted; }, set: function (obj, value) { obj.isCompleted = value; } }, metadata: _metadata }, _isCompleted_initializers, _isCompleted_extraInitializers);
            __esDecorate(null, null, _route_decorators, { kind: "field", name: "route", static: false, private: false, access: { has: function (obj) { return "route" in obj; }, get: function (obj) { return obj.route; }, set: function (obj, value) { obj.route = value; } }, metadata: _metadata }, _route_initializers, _route_extraInitializers);
            __esDecorate(null, null, _startTime_decorators, { kind: "field", name: "startTime", static: false, private: false, access: { has: function (obj) { return "startTime" in obj; }, get: function (obj) { return obj.startTime; }, set: function (obj, value) { obj.startTime = value; } }, metadata: _metadata }, _startTime_initializers, _startTime_extraInitializers);
            __esDecorate(null, null, _endTime_decorators, { kind: "field", name: "endTime", static: false, private: false, access: { has: function (obj) { return "endTime" in obj; }, get: function (obj) { return obj.endTime; }, set: function (obj, value) { obj.endTime = value; } }, metadata: _metadata }, _endTime_initializers, _endTime_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateActivityDto = CreateActivityDto;
