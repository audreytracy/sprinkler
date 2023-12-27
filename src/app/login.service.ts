import { Injectable } from '@angular/core';
import { User } from '@firebase/auth-types';
import { UserCredential } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, map, of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class Login {
    constructor(private afAuth: AngularFireAuth) {
        // Initialize the authentication service
    }

    login(email: string, password: string): Promise<UserCredential> {
        return this.afAuth.signInWithEmailAndPassword(email, password) as any as Promise<UserCredential>; // Implement login method
    }

    logout(): Promise<void> {
        return this.afAuth.signOut(); // Implement logout method
    }

    currentUser(): Observable<User | null> {
        return this.afAuth.user;
    }

    isLoggedIn(): Observable<boolean> {
        return this.afAuth.authState.pipe(
            map(user => !!user) // true if there's a user and false if the user is null (not logged in)
        );
    }
}
