import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  loginStatusChanged: EventEmitter<boolean> = new EventEmitter();

  constructor() {}

  // Call this method when the login is successful
  notifyLoginStatusChanged(isLoggedIn: boolean): void {
    this.loginStatusChanged.emit(isLoggedIn);
  }
}
