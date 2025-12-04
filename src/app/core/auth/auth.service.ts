import {inject, Injectable, signal} from '@angular/core';
import {delay, of, tap} from 'rxjs';
import {Router} from '@angular/router';
import {ILoginRequest, ILoginResponse, IMe, UiNotificationsService} from '@app/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly _ACCESS_TOKEN_KEY = "ACCESS_TOKEN_KEY";
  private readonly _FAKE_TOKEN_KEY = "FAKE_TOKEN_KEY";
  private readonly _ME_KEY = "ME";

  private _router = inject(Router);
  private _notifications = inject(UiNotificationsService);

  private readonly _me = signal<IMe | null>(null);
  public me = this._me.asReadonly();

  constructor() {
    const meKey = sessionStorage.getItem(this._ME_KEY);
    if (meKey) {
      try {
        this._me.set(JSON.parse(meKey) as IMe);
      } catch {
        this._me.set(null);
      }
    }
  }

  private _setToken(token: string) {
    sessionStorage.setItem(this._ACCESS_TOKEN_KEY, token);
  }

  public getToken() {
    return sessionStorage.getItem(this._ACCESS_TOKEN_KEY) || "";
  }

  public login(body: ILoginRequest) {

    const response: ILoginResponse = {
      accessToken: this._FAKE_TOKEN_KEY,
      user: {
        id: 1, name: body.login
      }
    }

    return of(response).pipe(
      delay(500),
      tap(() => {
        this._setToken(this._FAKE_TOKEN_KEY);
        this._setMe(body.login);
        this._notifications.success('Успешный вход');
      })
    )
  }

  public logout() {
    sessionStorage.removeItem(this._ACCESS_TOKEN_KEY);
    sessionStorage.removeItem(this._ME_KEY);
    this._me.set(null);
    this._router.navigate(["/login"]);
  }

  public isLoggedIn() {
    return !!sessionStorage.getItem(this._ACCESS_TOKEN_KEY);
  }

  private _setMe(name: string) {
    this._me.set({ name });
    sessionStorage.setItem(this._ME_KEY, JSON.stringify(this._me()));
  }
}
