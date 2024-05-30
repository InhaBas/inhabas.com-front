// introduce
export interface staffInterface {
    name: string;
    memberId?: number;
    studentId: string;
    role: string;
    generation?: number;
    major: string;
    picture: string;
}

export interface historyInterface {
    id: number;
    title: string;
    content?: string;
    writerId?: number;
    dateHistory: string;
    year?: string;
}

// scholarship
export interface scholarshipHistoryInterface {
    year: number | null;
    data: {
        id: number;
        title: string;
        dateHistory: string;
    }[];
}

export interface scholarshipDetailListInterface {
    contents: {
        date: string;
        content: string;
        id: string;
    }[];
    mainUrl: string;
}

// honor
export interface honorDataInterface {
    name: string;
    memberId: number;
    studentId: string;
    generation: number;
    major: string;
    picture: string;
    intro: string;
    email: string;
    phoneNumber: string;
}

// activity

export interface ActivityInterface {
    id: number;
    title: string;
    writerName: string;
    dateCreated: string;
    dateUpdated: string;
    thumbnail: {
        id: string;
        name: string;
        url: string;
        size: number;
        type: string;
    } | null;
}

export interface ActivityDetailInterface {
    id: string;
    title: string;
    content: string;
    writerId: string;
    writerName: string;
    dateCreated: string;
    dateUpdated: string;
    images: {
            id: string;
            name: string;
            url: string;
            size: number;
            type: string;
    }[];
    otherFiles: {
            id: string;
            name: string;
            url: string;
            size: number;
            type: string;
    }[];
}