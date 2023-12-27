import { Component } from '@angular/core';
import { Login } from '../login.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

    logged_in:boolean = false;
    email:string | null | undefined = "";

    constructor(private loginService:Login){}

    ngOnInit(){
        this.loginService.isLoggedIn().subscribe(isLoggedIn => {
            this.logged_in = isLoggedIn;
            if(isLoggedIn) this.loginService.currentUser().subscribe( u => {
                this.email = u?.email;
            })
        })
    }

    logout(){
        this.loginService.logout();
    }
}
