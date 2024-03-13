// board
export interface boardListInterface {
    id?: number;
    title: string;
    writerId?: number;
    writerName: string;
    datePinExpiration?: string;
    dateCreated: string;
    dateUpdated?: string;
    isPinned?: boolean;
}

export interface boardMenuInterface {
    menuName: string;
    count: string;
    // boardType?: string;
}
