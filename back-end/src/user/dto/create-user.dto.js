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
exports.CreateUserDto = void 0;
var class_validator_1 = require("class-validator");
var class_transformer_1 = require("class-transformer"); // ← AJOUTE CETTE LIGNE
var user_entity_1 = require("../entities/user.entity");
var CreateUserDto = function () {
    var _a;
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _email_decorators;
    var _email_initializers = [];
    var _email_extraInitializers = [];
    var _password_decorators;
    var _password_initializers = [];
    var _password_extraInitializers = [];
    var _sport_decorators;
    var _sport_initializers = [];
    var _sport_extraInitializers = [];
    var _gender_decorators;
    var _gender_initializers = [];
    var _gender_extraInitializers = [];
    var _activityLevel_decorators;
    var _activityLevel_initializers = [];
    var _activityLevel_extraInitializers = [];
    var _age_decorators;
    var _age_initializers = [];
    var _age_extraInitializers = [];
    var _weight_decorators;
    var _weight_initializers = [];
    var _weight_extraInitializers = [];
    var _height_decorators;
    var _height_initializers = [];
    var _height_extraInitializers = [];
    var _birthDate_decorators;
    var _birthDate_initializers = [];
    var _birthDate_extraInitializers = [];
    var _goals_decorators;
    var _goals_initializers = [];
    var _goals_extraInitializers = [];
    var _medicalConditions_decorators;
    var _medicalConditions_initializers = [];
    var _medicalConditions_extraInitializers = [];
    var _isEmailVerified_decorators;
    var _isEmailVerified_initializers = [];
    var _isEmailVerified_extraInitializers = [];
    var _favoriteSports_decorators;
    var _favoriteSports_initializers = [];
    var _favoriteSports_extraInitializers = [];
    var _preferences_decorators;
    var _preferences_initializers = [];
    var _preferences_extraInitializers = [];
    var _expoPushToken_decorators;
    var _expoPushToken_initializers = [];
    var _expoPushToken_extraInitializers = [];
    var _role_decorators;
    var _role_initializers = [];
    var _role_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateUserDto() {
                this.name = __runInitializers(this, _name_initializers, void 0);
                this.email = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _email_initializers, void 0));
                this.password = (__runInitializers(this, _email_extraInitializers), __runInitializers(this, _password_initializers, void 0));
                this.sport = (__runInitializers(this, _password_extraInitializers), __runInitializers(this, _sport_initializers, void 0));
                this.gender = (__runInitializers(this, _sport_extraInitializers), __runInitializers(this, _gender_initializers, void 0));
                this.activityLevel = (__runInitializers(this, _gender_extraInitializers), __runInitializers(this, _activityLevel_initializers, void 0));
                this.age = (__runInitializers(this, _activityLevel_extraInitializers), __runInitializers(this, _age_initializers, void 0));
                this.weight = (__runInitializers(this, _age_extraInitializers), __runInitializers(this, _weight_initializers, void 0));
                this.height = (__runInitializers(this, _weight_extraInitializers), __runInitializers(this, _height_initializers, void 0));
                this.birthDate = (__runInitializers(this, _height_extraInitializers), __runInitializers(this, _birthDate_initializers, void 0));
                this.goals = (__runInitializers(this, _birthDate_extraInitializers), __runInitializers(this, _goals_initializers, void 0));
                this.medicalConditions = (__runInitializers(this, _goals_extraInitializers), __runInitializers(this, _medicalConditions_initializers, void 0));
                this.isEmailVerified = (__runInitializers(this, _medicalConditions_extraInitializers), __runInitializers(this, _isEmailVerified_initializers, void 0));
                this.favoriteSports = (__runInitializers(this, _isEmailVerified_extraInitializers), __runInitializers(this, _favoriteSports_initializers, void 0));
                this.preferences = (__runInitializers(this, _favoriteSports_extraInitializers), __runInitializers(this, _preferences_initializers, void 0));
                this.expoPushToken = (__runInitializers(this, _preferences_extraInitializers), __runInitializers(this, _expoPushToken_initializers, void 0));
                this.role = (__runInitializers(this, _expoPushToken_extraInitializers), __runInitializers(this, _role_initializers, void 0));
                __runInitializers(this, _role_extraInitializers);
            }
            return CreateUserDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _name_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _email_decorators = [(0, class_validator_1.IsEmail)(), (0, class_validator_1.IsNotEmpty)()];
            _password_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.MinLength)(6)];
            _sport_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _gender_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(['Homme', 'Femme', 'Autre'])];
            _activityLevel_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _age_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            _weight_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            _height_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            _birthDate_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(function () { return Date; })];
            _goals_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _medicalConditions_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _isEmailVerified_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            _favoriteSports_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)()];
            _preferences_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsObject)()];
            _expoPushToken_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _role_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(user_entity_1.UserRole)];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _email_decorators, { kind: "field", name: "email", static: false, private: false, access: { has: function (obj) { return "email" in obj; }, get: function (obj) { return obj.email; }, set: function (obj, value) { obj.email = value; } }, metadata: _metadata }, _email_initializers, _email_extraInitializers);
            __esDecorate(null, null, _password_decorators, { kind: "field", name: "password", static: false, private: false, access: { has: function (obj) { return "password" in obj; }, get: function (obj) { return obj.password; }, set: function (obj, value) { obj.password = value; } }, metadata: _metadata }, _password_initializers, _password_extraInitializers);
            __esDecorate(null, null, _sport_decorators, { kind: "field", name: "sport", static: false, private: false, access: { has: function (obj) { return "sport" in obj; }, get: function (obj) { return obj.sport; }, set: function (obj, value) { obj.sport = value; } }, metadata: _metadata }, _sport_initializers, _sport_extraInitializers);
            __esDecorate(null, null, _gender_decorators, { kind: "field", name: "gender", static: false, private: false, access: { has: function (obj) { return "gender" in obj; }, get: function (obj) { return obj.gender; }, set: function (obj, value) { obj.gender = value; } }, metadata: _metadata }, _gender_initializers, _gender_extraInitializers);
            __esDecorate(null, null, _activityLevel_decorators, { kind: "field", name: "activityLevel", static: false, private: false, access: { has: function (obj) { return "activityLevel" in obj; }, get: function (obj) { return obj.activityLevel; }, set: function (obj, value) { obj.activityLevel = value; } }, metadata: _metadata }, _activityLevel_initializers, _activityLevel_extraInitializers);
            __esDecorate(null, null, _age_decorators, { kind: "field", name: "age", static: false, private: false, access: { has: function (obj) { return "age" in obj; }, get: function (obj) { return obj.age; }, set: function (obj, value) { obj.age = value; } }, metadata: _metadata }, _age_initializers, _age_extraInitializers);
            __esDecorate(null, null, _weight_decorators, { kind: "field", name: "weight", static: false, private: false, access: { has: function (obj) { return "weight" in obj; }, get: function (obj) { return obj.weight; }, set: function (obj, value) { obj.weight = value; } }, metadata: _metadata }, _weight_initializers, _weight_extraInitializers);
            __esDecorate(null, null, _height_decorators, { kind: "field", name: "height", static: false, private: false, access: { has: function (obj) { return "height" in obj; }, get: function (obj) { return obj.height; }, set: function (obj, value) { obj.height = value; } }, metadata: _metadata }, _height_initializers, _height_extraInitializers);
            __esDecorate(null, null, _birthDate_decorators, { kind: "field", name: "birthDate", static: false, private: false, access: { has: function (obj) { return "birthDate" in obj; }, get: function (obj) { return obj.birthDate; }, set: function (obj, value) { obj.birthDate = value; } }, metadata: _metadata }, _birthDate_initializers, _birthDate_extraInitializers);
            __esDecorate(null, null, _goals_decorators, { kind: "field", name: "goals", static: false, private: false, access: { has: function (obj) { return "goals" in obj; }, get: function (obj) { return obj.goals; }, set: function (obj, value) { obj.goals = value; } }, metadata: _metadata }, _goals_initializers, _goals_extraInitializers);
            __esDecorate(null, null, _medicalConditions_decorators, { kind: "field", name: "medicalConditions", static: false, private: false, access: { has: function (obj) { return "medicalConditions" in obj; }, get: function (obj) { return obj.medicalConditions; }, set: function (obj, value) { obj.medicalConditions = value; } }, metadata: _metadata }, _medicalConditions_initializers, _medicalConditions_extraInitializers);
            __esDecorate(null, null, _isEmailVerified_decorators, { kind: "field", name: "isEmailVerified", static: false, private: false, access: { has: function (obj) { return "isEmailVerified" in obj; }, get: function (obj) { return obj.isEmailVerified; }, set: function (obj, value) { obj.isEmailVerified = value; } }, metadata: _metadata }, _isEmailVerified_initializers, _isEmailVerified_extraInitializers);
            __esDecorate(null, null, _favoriteSports_decorators, { kind: "field", name: "favoriteSports", static: false, private: false, access: { has: function (obj) { return "favoriteSports" in obj; }, get: function (obj) { return obj.favoriteSports; }, set: function (obj, value) { obj.favoriteSports = value; } }, metadata: _metadata }, _favoriteSports_initializers, _favoriteSports_extraInitializers);
            __esDecorate(null, null, _preferences_decorators, { kind: "field", name: "preferences", static: false, private: false, access: { has: function (obj) { return "preferences" in obj; }, get: function (obj) { return obj.preferences; }, set: function (obj, value) { obj.preferences = value; } }, metadata: _metadata }, _preferences_initializers, _preferences_extraInitializers);
            __esDecorate(null, null, _expoPushToken_decorators, { kind: "field", name: "expoPushToken", static: false, private: false, access: { has: function (obj) { return "expoPushToken" in obj; }, get: function (obj) { return obj.expoPushToken; }, set: function (obj, value) { obj.expoPushToken = value; } }, metadata: _metadata }, _expoPushToken_initializers, _expoPushToken_extraInitializers);
            __esDecorate(null, null, _role_decorators, { kind: "field", name: "role", static: false, private: false, access: { has: function (obj) { return "role" in obj; }, get: function (obj) { return obj.role; }, set: function (obj, value) { obj.role = value; } }, metadata: _metadata }, _role_initializers, _role_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateUserDto = CreateUserDto;
