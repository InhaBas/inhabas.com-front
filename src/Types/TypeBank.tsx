// bank support
export interface supportListInterface {
    id: number;
    title: string;
    applicantId: number;
    applicantStudentId: number;
    applicantName: string;
    dateCreated: string;
    status: string;
}

export interface supportDetailInterface {
    id: number;
    dateUsed: string;
    dateCreated: string;
    dateUpdated?: string;
    title: string;
    details: string;
    outcome: number;
    account: string;
    applicantId: number;
    applicantStudentId: number;
    applicantName: string;
    memberIdInCharge?: null; // nullable
    memberStudentIdInCharge?: null; // nullable
    memberNameInCharge?: null; // nullable
    status: string;
    rejectReason?: null; // nullable
    receipts: [
        {
            name: string;
            url: string;
        }
    ];
}
