import { AttachmentsService } from "./attachments.service";
export declare class AttachmentsController {
    private attachmentsService;
    constructor(attachmentsService: AttachmentsService);
    findById(id: string): Promise<{
        id: string;
        createdAt: Date;
        projectId: string | null;
        taskId: string | null;
        invoiceId: string | null;
        entityType: string;
        entityId: string;
        timesheetId: string | null;
        expenseId: string | null;
        billId: string | null;
        fileName: string;
        fileSize: number;
        mimeType: string;
        s3Url: string;
        createdById: string;
    } | null>;
    create(body: any): Promise<{
        id: string;
        createdAt: Date;
        projectId: string | null;
        taskId: string | null;
        invoiceId: string | null;
        entityType: string;
        entityId: string;
        timesheetId: string | null;
        expenseId: string | null;
        billId: string | null;
        fileName: string;
        fileSize: number;
        mimeType: string;
        s3Url: string;
        createdById: string;
    }>;
}
//# sourceMappingURL=attachments.controller.d.ts.map