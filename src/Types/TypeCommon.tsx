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
export interface commentListInterface {
    id: number;
    content: string;
    childrenComment?: Array<commentListInterface>;
    dateUpdated: Date;
    parentAuthor?: string;
    parentComment?: string;
    writer: {
        id: number;
        name: string;
        major: string;
        pictureUrl: string;
    };
}

export interface myCommentInterface {
    id: number;
    menuId: number;
    menuType: string;
    menuName: string;
    content: string;
    dateCreated: string;
}

export interface commentPropsInterface {
    boardId?: string;
    menuId?: number;
    boardType?: string;
    parentId?: number;
    token?: boolean;
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

// carousel
export interface carouselInterface {
    images: string[];
}
