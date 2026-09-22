export type BankHistoryType = 'income' | 'outcome';

export interface BankHistoryMember {
  memberId?: string | number | null;
  studentId?: string | number | null;
  name?: string | null;
}

export interface BankHistoryFormValues {
  type: BankHistoryType;
  dateUsed: string;
  title: string;
  details: string;
  amount: string;
  member: BankHistoryMember;
  files: string[];
}

const AMOUNT_LABEL: Record<BankHistoryType, string> = {
  income: '수입액',
  outcome: '지출액',
};

// 사용자 PC의 시간대와 무관하게 KST 기준 오늘 날짜를 YYYY-MM-DD로 반환한다.
// (en-CA 로케일은 YYYY-MM-DD 형식으로 출력된다)
export const getTodayKST = (now: Date = new Date()): string =>
  new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Seoul' }).format(now);

// 서버에서 받은 사용일은 `YYYY-MM-DDTHH:mm:ss`, date input 값은 `YYYY-MM-DD`이므로 날짜 부분만 사용한다.
export const toDateOnly = (dateUsed: string | null | undefined): string =>
  (dateUsed ?? '').split('T')[0];

// 검증에 실패하면 사용자에게 보여줄 메시지를, 통과하면 null을 반환한다.
export const validateBankHistory = (form: BankHistoryFormValues, today: string = getTodayKST()) => {
  const dateUsed = toDateOnly(form.dateUsed);
  const amountLabel = AMOUNT_LABEL[form.type];

  if (dateUsed === '') return '사용일을 입력해주세요';
  // YYYY-MM-DD 문자열은 사전순 비교가 곧 날짜 비교다
  if (dateUsed > today) return '미래 날짜는 사용일로 입력할 수 없습니다';
  if (form.title.trim() === '') return '제목을 입력해주세요';
  if (form.type === 'outcome' && !form.member.name) return '회비 사용 부원을 입력해주세요';
  if (!/^\d+$/.test(form.amount.trim())) return `올바른 ${amountLabel}을 입력해주세요`;
  if (Number(form.amount) <= 0) return `1원 이상의 ${amountLabel}을 입력해주세요`;

  return null;
};

export const toBankHistoryPayload = (form: BankHistoryFormValues) => {
  const title = form.title.trim();
  const details = form.details.trim();
  const amount = Number(form.amount);
  const isOutcome = form.type === 'outcome';

  return {
    dateUsed: form.dateUsed.includes('T') ? form.dateUsed : `${form.dateUsed}T00:00:00`,
    title,
    // 내용을 입력하지 않으면 제목과 같도록 처리한다
    details: details === '' ? title : details,
    // 회비 사용 부원은 지출에만 지정한다
    memberIdReceived: (isOutcome && form.member.memberId) || null,
    memberStudentIdReceived: (isOutcome && form.member.studentId) || null,
    memberNameReceived: (isOutcome && form.member.name) || null,
    income: isOutcome ? 0 : amount,
    outcome: isOutcome ? amount : 0,
    files: form.files,
  };
};

export type BankHistoryPayload = ReturnType<typeof toBankHistoryPayload>;
