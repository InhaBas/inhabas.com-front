import { menuGroupInterface } from '../types/TypeCommon';

/**
 * 상단 네비게이션바 메뉴 데이터.
 *
 * 기존에는 `GET /menus` 응답을 받아 인덱스 순서에 의존해 url을 덧붙였지만,
 * 메뉴 구성은 배포 주기와 함께 바뀌는 정적인 값이므로 프론트에서 직접 관리한다.
 * 메뉴를 추가/변경하거나 노출 여부(visible)를 바꿀 때는 이 파일만 수정하면 된다.
 */
export const NAV_MENU_GROUPS: menuGroupInterface[] = [
  {
    id: 1,
    groupName: 'IBAS',
    visible: true,
    menuList: [
      {
        menuId: 1,
        priority: 1,
        name: '동아리 소개',
        type: 'INTRODUCE',
        description: '안녕하세요 인하대학교 빅데이터 학술동아리 IBAS입니다. 반갑습니다.',
        url: 'introduce',
        visible: true,
      },
      {
        menuId: 2,
        priority: 2,
        name: '동아리 활동',
        type: 'ALBUM',
        description: '동아리 수상 및 활동 내역에 대한 게시판입니다.',
        url: 'activity',
        visible: true,
      },
      {
        menuId: 3,
        priority: 3,
        name: '명예의 전당',
        type: 'HALL_OF_FAME',
        description:
          '졸업생 분들 중 정보공개에 동의하신 선배님들입니다. IBAS의 성장을 위해 함께해주셔서 감사합니다.',
        url: 'honor',
        visible: true,
      },
      {
        // 백엔드 /menu 테이블과 연결되지 않는 번호. 출시할 때 visible만 true로 바꾼다
        menuId: 23,
        priority: 4,
        name: '행사 캘린더',
        type: 'CALENDAR',
        description: 'IBAS 행사 일정을 확인하는 캘린더입니다.',
        url: 'calendar',
        visible: false,
      },
    ],
  },
  {
    id: 2,
    groupName: '게시판',
    visible: true,
    menuList: [
      {
        menuId: 4,
        priority: 1,
        name: '공지사항',
        type: 'NOTICE',
        description: '부원이 알아야 할 내용을 공지합니다.',
        url: 'board/notice',
        visible: true,
      },
      {
        menuId: 5,
        priority: 2,
        name: '자유게시판',
        type: 'FREE',
        description: '부원이라면 모두 사용할 수 있는 게시판입니다.',
        url: 'board/free',
        // 네비게이션에서만 숨김. 라우트와 직접 접근은 그대로 살아있다
        visible: false,
      },
      {
        menuId: 6,
        priority: 3,
        name: '질문게시판',
        type: 'QUESTION',
        description: '어떤 질문이든 부원에게 물어볼 수 있는 게시판입니다.',
        url: 'board/question',
        // 네비게이션에서만 숨김. 라우트와 직접 접근은 그대로 살아있다
        visible: false,
      },
      {
        menuId: 8,
        priority: 4,
        name: '공개 자료실',
        type: 'STORAGE',
        description: '자유롭게 열람 가능한 자료실입니다.',
        url: 'board/opensource',
        visible: true,
      },
      {
        menuId: 7,
        priority: 5,
        name: '건의사항',
        type: 'SUGGEST',
        description: '1:1 문의 게시판입니다. 동아리 관련 건의사항이 있다면 말씀해주세요.',
        url: 'board/suggest',
        // 네비게이션에서만 숨김. 라우트와 직접 접근은 그대로 살아있다
        visible: false,
      },
      {
        menuId: 9,
        priority: 6,
        name: '회장단 게시판',
        type: 'EXECUTIVE',
        description: '회장단 자료 공유 게시판입니다.',
        url: 'board/executive',
        // 회장단 전용. 원래 isAuthorizedOverSecretary 권한 분기 대상이었으나 현재는 전체 숨김
        visible: false,
      },
    ],
  },
  {
    id: 3,
    groupName: '모임',
    // 그룹 전체 숨김. 하위 메뉴는 그룹을 다시 열면 그대로 노출된다
    visible: false,
    menuList: [
      {
        menuId: 10,
        priority: 1,
        name: '강의',
        type: 'LECTURE',
        description: '한 명의 강의자가 다수의 수강생에게 지식을 전달하는 강의',
        url: 'lecture',
        visible: true,
      },
      {
        menuId: 11,
        priority: 2,
        name: '스터디',
        type: 'STUDY',
        description: '스터디에 참여한 인원이 공통적인 주제를 정해 함께 공부하는 모임',
        url: 'lecture',
        visible: true,
      },
      {
        menuId: 12,
        priority: 3,
        name: '취미모임',
        type: 'HOBBY',
        description: '모두가 재밌다! 같은 취미를 가진 사람들이 모여 활동하는 모임',
        url: 'lecture',
        visible: true,
      },
      {
        menuId: 13,
        priority: 4,
        name: '대기중인 강의 관리',
        type: 'LECTURE_PENDING',
        description: '개설 신청된 강의 목록입니다.',
        url: 'lecture',
        visible: true,
      },
    ],
  },
  {
    id: 4,
    groupName: '회계',
    visible: true,
    menuList: [
      {
        menuId: 14,
        priority: 1,
        name: '예산지원신청',
        type: 'BUDGET_SUPPORT',
        description: '예산 지원을 신청하는 게시판입니다.',
        url: 'bank/support',
        visible: true,
      },
      {
        menuId: 15,
        priority: 2,
        name: '회계내역',
        type: 'BUDGET_ACCOUNT',
        description: '회계 내역에 대한 게시판입니다.',
        url: 'bank',
        visible: true,
      },
    ],
  },
  {
    id: 5,
    groupName: '프로젝트',
    visible: true,
    menuList: [
      {
        menuId: 16,
        priority: 1,
        name: '알파테스터',
        type: 'ALPHA',
        description: 'IBAS 내부 컨테스트, 알파테스터 관련 게시판입니다.',
        url: 'board/alpha',
        visible: true,
      },
      {
        menuId: 17,
        priority: 2,
        name: '베타테스터',
        type: 'BETA',
        description: 'IBAS 내부 프로젝트, 베타테스터 관련 게시판입니다.',
        url: 'board/beta',
        visible: true,
      },
    ],
  },
  {
    id: 6,
    groupName: '공모전',
    // 그룹 전체 숨김. 하위 메뉴는 그룹을 다시 열면 그대로 노출된다
    visible: false,
    menuList: [
      {
        menuId: 18,
        priority: 1,
        name: '공모전 게시판',
        type: 'CONTEST',
        description: '공모전 정보를 알려주는 게시판',
        url: 'board/contest',
        visible: true,
      },
      {
        menuId: 19,
        priority: 2,
        name: '대외활동 게시판',
        type: 'ACTIVITY',
        description: '대외활동 정보를 알려주는 게시판',
        url: 'board/activity',
        visible: true,
      },
    ],
  },
  {
    id: 7,
    groupName: '장학회',
    visible: true,
    menuList: [
      {
        menuId: 20,
        priority: 1,
        name: '장학회 소개',
        type: 'SCHOLARSHIP',
        description: '장학회에 대하여',
        url: 'scholarship',
        visible: true,
      },
      {
        menuId: 21,
        priority: 2,
        name: '장학회 후원 내용',
        type: 'SPONSOR',
        description: '장학회 후원내용',
        url: 'board/sponsor',
        visible: true,
      },
      {
        menuId: 22,
        priority: 3,
        name: '장학회 사용 내역',
        type: 'USAGE',
        description: '장학회 사용 내역',
        url: 'board/usage',
        visible: true,
      },
    ],
  },
];
