export type LoginResponseType =
  | { success: false; message: string }
  | {
      success: true;
      token: string;
    };
