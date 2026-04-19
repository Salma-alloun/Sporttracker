"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityResponseDto = void 0;
var ActivityResponseDto = /** @class */ (function () {
    function ActivityResponseDto(partial) {
        Object.assign(this, partial);
        // Formater la date
        if (this.startTime) {
            this.formattedDate = new Date(this.startTime).toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
            });
        }
        // Formater la durée
        if (this.duration) {
            var hours = Math.floor(this.duration / 3600);
            var minutes = Math.floor((this.duration % 3600) / 60);
            this.formattedDuration = hours > 0
                ? "".concat(hours, "h ").concat(minutes, "min")
                : "".concat(minutes, "min");
        }
        // Formater la distance
        if (this.distance) {
            this.formattedDistance = this.distance >= 1000
                ? "".concat((this.distance / 1000).toFixed(2), " km")
                : "".concat(Math.round(this.distance), " m");
        }
    }
    return ActivityResponseDto;
}());
exports.ActivityResponseDto = ActivityResponseDto;
