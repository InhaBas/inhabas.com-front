// headerNav & headerTitle
export interface menuInterface {
    menuId?: number;
    priority?: number;
    name: string;
    type?: string;
    description: string;
    url?: string;
}

// bottom
export interface chiefInterface {
    name: string;
    email: string;
    phoneNumber: string;
}

// policy
export interface policyInterface {
    title: string;
    content: string;
}

// pagination
export interface paginationPropsInterface {
    totalPage: number;
    fetchUrl: string;
    search?: string;
    size?: number;
    token?: boolean;
    paginationFetch: any;
}

// comment
export interface commentInterface {
    id: number;
    content: string;
    childrenComment?: Array<commentInterface>;
    dateUpdated: Date;
    parentAuthor?: string;
    writer: {
        id: number;
        name: string;
        major: string;
        pictureUrl: string;
    };
}

export interface commentPropsInterface {
    boardId?: string;
    menuId?: number;
    boardType?: string;
    parentId?: number;
}

// modal
export interface modalInterface {
    type: string;
    content?: string;
}

// token payload
export interface tokenInterface {
    sub: string;
    memberId: number;
    provider: string;
    email: string;
    authorities: [string];
    iat: number;
    exp: number;
}
