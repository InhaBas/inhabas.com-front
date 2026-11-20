import type { RegisterOptions } from 'react-hook-form';

/*
  회원가입 검증 규칙. 서버가 거절하는 값을 제출 전에 같은 기준으로 막는다.
  RHF `register`의 두 번째 인자나 `Controller`의 `rules`로 그대로 넘긴다.
    register('name', signUpRules.name)
    <Controller name="major" rules={signUpRules.major} ... />

  기준: inhabas.com-api@0a30cb7d (main, 2026-11-10). 주석의 `파일:줄`은 이 커밋 기준이다.
  백엔드가 바뀌면 backend-contract 스킬로 다시 확인하고 커밋과 줄 번호를 함께 고친다.
  - SignUpDto        resource-server/src/main/java/com/inhabas/api/domain/signUp/dto/SignUpDto.java
  - SignUpServiceImpl resource-server/src/main/java/com/inhabas/api/domain/signUp/usecase/SignUpServiceImpl.java
  - AnswerServiceImpl resource-server/src/main/java/com/inhabas/api/domain/signUp/usecase/AnswerServiceImpl.java
  - Name, Phone, StudentId, Grade
                     module-auth/src/main/java/com/inhabas/api/auth/domain/oauth2/member/domain/valueObject/
  - Major            module-auth/src/main/java/com/inhabas/api/auth/domain/oauth2/majorInfo/domain/valueObject/Major.java

  글자 수는 Java String.length()와 JS string.length 모두 UTF-16 단위로 세므로 서버와 같다.
*/

const isBlank = (value: unknown) => typeof value !== 'string' || value.trim() === '';

// 학년 선택지. 서버는 1~5를 받지만(아래 grade 참고) 화면 선택지는 지금처럼 1~4로 둔다
export const GRADE_OPTIONS = [1, 2, 3, 4] as const;

// 2단계 글자 수 표시(n / 1000)와 검증이 같은 값을 쓴다
export const ANSWER_MAX_LENGTH = 1000;

const NAME_MAX_LENGTH = 49;
const STUDENT_ID_MAX_LENGTH = 29;
const MAJOR_MAX_LENGTH = 49;

export const signUpRules = {
  // 필수, 공백만은 안 됨, 49자 이하
  // inhabas.com-api@0a30cb7d SignUpDto.java:20-23 @NotBlank @Length(max = 50)
  // inhabas.com-api@0a30cb7d Name.java:31-32 isBlank면 거절, length < 50 → DTO보다 1자 좁다
  name: {
    required: '이름을 입력해 주세요',
    maxLength: {
      value: NAME_MAX_LENGTH,
      message: `이름은 ${NAME_MAX_LENGTH}자까지 쓸 수 있으니 줄여 주세요`,
    },
    validate: {
      notBlank: (value: unknown) => !isBlank(value) || '이름을 입력해 주세요',
    },
  },

  // 필수, 010-dddd-dddd
  // inhabas.com-api@0a30cb7d SignUpDto.java:30-32 @Pattern("^(010)-\\d{4}-\\d{4}$") (null은 DTO 통과)
  // inhabas.com-api@0a30cb7d Phone.java:20,30 같은 정규식, null이면 거절 → 필수
  phoneNumber: {
    required: '전화번호를 입력해 주세요',
    pattern: {
      value: /^010-\d{4}-\d{4}$/,
      message: '010으로 시작하는 휴대전화 번호 11자리를 입력해 주세요',
    },
  },

  // 학생의 학번. 필수, 숫자만, 29자 이하
  // inhabas.com-api@0a30cb7d SignUpDto.java:34-37 @NotNull @Pattern("\\d+") (빈 문자열도 거절)
  // inhabas.com-api@0a30cb7d StudentId.java:21,32 length < 30
  studentId: {
    required: '학번을 입력해 주세요',
    maxLength: {
      value: STUDENT_ID_MAX_LENGTH,
      message: `학번은 ${STUDENT_ID_MAX_LENGTH}자리까지 쓸 수 있으니 다시 확인해 주세요`,
    },
    pattern: {
      value: /^\d+$/,
      message: '학번에는 숫자만 쓸 수 있으니 숫자가 아닌 글자를 지워 주세요',
    },
  },

  // 교수의 교수번호. 서버에서는 학번과 같은 studentId 필드라 규칙이 같다
  // inhabas.com-api@0a30cb7d SignUpDto.java:34-37, StudentId.java:21,32 (studentId와 같음)
  professorId: {
    required: '교수번호를 입력해 주세요',
    maxLength: {
      value: STUDENT_ID_MAX_LENGTH,
      message: `교수번호는 ${STUDENT_ID_MAX_LENGTH}자리까지 쓸 수 있으니 다시 확인해 주세요`,
    },
    pattern: {
      value: /^\d+$/,
      message: '교수번호에는 숫자만 쓸 수 있으니 숫자가 아닌 글자를 지워 주세요',
    },
  },

  // 학생만 필수, 1~4. 교수는 이 칸을 렌더링하지 않아 등록되지 않는다
  // inhabas.com-api@0a30cb7d SignUpDto.java:45-47 @Positive (null은 DTO 통과)
  // inhabas.com-api@0a30cb7d Grade.java:30 0~5 허용
  // inhabas.com-api@0a30cb7d SignUpServiceImpl.java:52-63 grade가 null이면 교수 경로로 처리해
  //   질문지 없이 가입을 끝낸다 → 학생에게는 반드시 필수
  grade: {
    required: '학년을 1~4학년 중에서 골라 주세요',
    validate: {
      inRange: (value: unknown) =>
        GRADE_OPTIONS.some((grade) => grade === Number(value)) ||
        '학년을 1~4학년 중에서 골라 주세요',
    },
  },

  // 필수, 49자 이하. 직접 입력하지 않고 전공 모달에서 고른 값이다
  // inhabas.com-api@0a30cb7d SignUpDto.java:25-28 @NotBlank @Length(max = 50)
  // inhabas.com-api@0a30cb7d Major.java:31-32 isBlank면 거절, length < 50 → DTO보다 1자 좁다
  major: {
    required: '전공을 검색해서 골라 주세요',
    maxLength: {
      value: MAJOR_MAX_LENGTH,
      message: `전공 이름은 ${MAJOR_MAX_LENGTH}자까지 저장할 수 있으니 다른 전공을 골라 주세요`,
    },
    validate: {
      notBlank: (value: unknown) => !isBlank(value) || '전공을 검색해서 골라 주세요',
    },
  },

  // 필수. 프론트 전용 규칙이다. 서버 요청(SignUpDto)에는 약관 동의 필드가 없다
  // inhabas.com-api@0a30cb7d SignUpDto.java:16-47 약관 필드 없음
  terms: {
    required: '가입하려면 약관에 동의해 주세요',
  },

  // 질문 하나의 답변. 각각 필수, 1~1000자
  // inhabas.com-api@0a30cb7d SignUpServiceImpl.java:77-79,91-101 content가 null인 답변이 있으면
  //   가입 완료를 거절(NotWriteAnswersException)
  // inhabas.com-api@0a30cb7d AnswerServiceImpl.java:79 빈 문자열이나 1000자 초과면 거절
  //   (InvalidAnswerLengthException). 공백만 있는 답변은 서버가 받으므로 여기서도 막지 않는다
  answer: {
    required: '이 질문에 답변을 입력해 주세요',
    maxLength: {
      value: ANSWER_MAX_LENGTH,
      message: `답변은 ${ANSWER_MAX_LENGTH}자까지 쓸 수 있으니 줄여 주세요`,
    },
  },
} satisfies Record<string, RegisterOptions>;

/*
  전화번호 입력을 010-0000-0000 형식으로 다듬는다.
  숫자만 남기고 11자리에서 자른 뒤 3-4-4로 하이픈을 붙인다. 입력 중이면 끝의 하이픈은 뗀다.
  1단계 화면(Signup.tsx)의 autoHyphen과 같은 변환이다. 화면 연결은 1단계 화면 티켓에서 한다.
*/
export const formatPhoneNumber = (value: string): string =>
  value
    .replace(/[^0-9]/g, '')
    .slice(0, 11)
    .replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/, '$1-$2-$3')
    .replace(/(-{1,2})$/, '');
