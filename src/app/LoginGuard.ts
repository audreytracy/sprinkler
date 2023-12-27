import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Login } from './login.service';
import { Observable, map } from 'rxjs';

@Injectable()
export class LoginGuard implements CanActivate {

    constructor(private loginService: Login, private router: Router) { }

    canActivate(): Observable<boolean> {
        return this.loginService.isLoggedIn().pipe(
          map((isLoggedIn: boolean) => {
            if (!isLoggedIn) {
              this.router.navigate(['/login']);
              return false;
            }
            return true;
          })
        );

      }
}
