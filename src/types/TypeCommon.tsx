// headerNav & headerTitle
export interface menuInterface {
  menuId?: number;
  priority?: number;
  name: string;
  type?: string;
  description: string;
  url?: string;
}

export interface navMenuInterface extends menuInterface {
  url: string;
  /** 네비게이션바 노출 여부. false여도 라우트 자체는 살아있다 */
  visible: boolean;
}

export interface menuGroupInterface {
  id: number;
  groupName: string;
  /** 그룹 전체의 네비게이션바 노출 여부 */
  visible: boolean;
  menuList: navMenuInterface[];
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
// 백엔드 PagedResponseDto. pageNumber는 0부터 센다
export interface pageInfoInterface {
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
}

export interface pagedResponseInterface<T> {
  pageInfo: pageInfoInterface;
  data: T[];
}

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
  isDeleted?: boolean;
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
  isDeleted: boolean;
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
