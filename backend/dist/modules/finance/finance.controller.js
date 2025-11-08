"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinanceController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_guard_1 = require("../../common/guards/jwt.guard");
const rbac_guard_1 = require("../../common/guards/rbac.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const finance_service_1 = require("./finance.service");
let FinanceController = class FinanceController {
    constructor(financeService) {
        this.financeService = financeService;
    }
    async getSalesOrders(query) {
        return this.financeService.getSalesOrders();
    }
    async createSalesOrder(body) {
        return this.financeService.createSalesOrder(body);
    }
    async getInvoices(projectId) {
        return this.financeService.getInvoices(projectId);
    }
    async createInvoiceFromTimesheets(body) {
        return this.financeService.createInvoiceFromTimesheets(body.project_id, body.timesheet_ids);
    }
};
exports.FinanceController = FinanceController;
__decorate([
    (0, common_1.Get)("sales-orders"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FinanceController.prototype, "getSalesOrders", null);
__decorate([
    (0, common_1.Post)('sales-orders'),
    (0, common_1.UseGuards)(rbac_guard_1.RbacGuard),
    (0, roles_decorator_1.Roles)('ADMIN', 'FINANCE'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FinanceController.prototype, "createSalesOrder", null);
__decorate([
    (0, common_1.Get)("invoices"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FinanceController.prototype, "getInvoices", null);
__decorate([
    (0, common_1.Post)('invoices/from-timesheets'),
    (0, common_1.UseGuards)(rbac_guard_1.RbacGuard),
    (0, roles_decorator_1.Roles)('ADMIN', 'FINANCE', 'PROJECT_MANAGER'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                project_id: { type: 'string' },
                timesheet_ids: { type: 'array', items: { type: 'string' } },
            },
            required: ['project_id', 'timesheet_ids'],
        },
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FinanceController.prototype, "createInvoiceFromTimesheets", null);
exports.FinanceController = FinanceController = __decorate([
    (0, swagger_1.ApiTags)("Finance"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Controller)("api/v1/finance"),
    __metadata("design:paramtypes", [finance_service_1.FinanceService])
], FinanceController);
//# sourceMappingURL=finance.controller.js.map