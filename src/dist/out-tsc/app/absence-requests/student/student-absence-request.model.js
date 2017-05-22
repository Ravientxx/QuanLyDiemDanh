"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var StudentAbsenceRequest = (function () {
    function StudentAbsenceRequest(id, code, name, reason, from_to, days, submited_at, accepted_at, status) {
        this.id = id;
        this.code = code;
        this.name = name;
        this.reason = reason;
        this.from_to = from_to;
        this.days = days;
        this.submited_at = submited_at;
        this.accepted_at = accepted_at;
        this.status = status;
    }
    return StudentAbsenceRequest;
}());
exports.StudentAbsenceRequest = StudentAbsenceRequest;
//# sourceMappingURL=student-absence-request.model.js.map