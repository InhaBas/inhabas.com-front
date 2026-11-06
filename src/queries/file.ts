import { mutationOptions } from '@tanstack/react-query';

import { uploadFile } from '../api/file';

export const fileMutations = {
  // 업로드한 파일은 제출할 때 id로만 쓰므로 무효화할 쿼리가 없다
  upload: () =>
    mutationOptions({
      mutationFn: ({ menuId, body }: { menuId: number; body: FormData }) =>
        uploadFile(menuId, body),
    }),
};
