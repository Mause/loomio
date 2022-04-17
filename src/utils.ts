import { AxiosError } from "axios";

export function isAxiosError(e: unknown): e is AxiosError {
  return (e as { isAxiosError: boolean }).isAxiosError;
}

export async function catchError<T>(func: () => Promise<T>): Promise<T> {
  try {
    return await func();
  } catch (e) {
    console.log("what went wrong");
    if (isAxiosError(e)) {
      console.log(e.response?.data);
    } else {
      console.error(e);
    }
    throw e;
  }
}
