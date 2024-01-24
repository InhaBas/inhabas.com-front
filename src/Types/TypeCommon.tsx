// headerNav

export interface menuItem {
    menuId: number;
    priority: number;
    name: string;
    type: string;
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
