import { FieldErrors, FieldValues, get, Path, UseFormSetFocus } from 'react-hook-form';

/*
  제출에 실패하면 화면 순서(order)로 첫 오류 칸에 포커스를 옮긴다.
  RHF의 shouldFocusError는 등록 순서를 따르므로 false로 두고 handleSubmit의 onInvalid에서 부른다.
    handleSubmit(submit, (errors) => focusFirstError(FIELD_ORDER, errors, setFocus))
*/
export const focusFirstError = <T extends FieldValues>(
  order: readonly Path<T>[],
  errors: FieldErrors<T>,
  setFocus: UseFormSetFocus<T>,
) => {
  const first = order.find((name) => get(errors, name));
  if (first) setFocus(first);
};
