/// <reference path="typings/angular2/angular2.d.ts" />
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
define(["require", "exports", 'angular2/angular2'], function (require, exports, angular2_1) {
    // Annotation section
    var MyAppComponent = (function () {
        function MyAppComponent() {
            this.name = 'Alice';
        }
        MyAppComponent = __decorate([
            angular2_1.Component({
                selector: 'my-app'
            }),
            angular2_1.View({
                template: '<h1>Hello {{ name }}</h1>'
            })
        ], MyAppComponent);
        return MyAppComponent;
    })();
    angular2_1.bootstrap(MyAppComponent);
});
//# sourceMappingURL=app.js.map