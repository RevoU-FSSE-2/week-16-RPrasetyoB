export interface UserInterface {
    loginUser(userInfo: { username: string; password: string }): Promise<any>;
    registerUser(userInfo: { username: string; password: string }): Promise<any>;
  }