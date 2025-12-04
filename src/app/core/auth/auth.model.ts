export interface ILoginRequest {
  login: string;
  password: string;
}

export interface IMe {
  name: string;
}

export interface IUser {
  id: number;
  name: string;
}

export interface ILoginResponse {
  accessToken: string;
  user: IUser;
}
