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

export interface boardDetailInterface {
    id: number;
    title: string;
    content: string;
    writerId?: 2;
    writerName: string;
    datePinExpiration?: string;
    dateCreated: string;
    dateUpdated: string;
    images?: [
        {
            name: string;
            url: string;
        }
    ];
    otherFiles?: [
        {
            name: string;
            url: string;
        }
    ];
    isPinned?: boolean;
    dateHistory?: string;
}
