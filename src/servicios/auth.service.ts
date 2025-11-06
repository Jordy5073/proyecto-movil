import { inject, Injectable } from "@angular/core";
import {
  Auth,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  User,
  authState
} from '@angular/fire/auth';
import { Observable } from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private auth: Auth = inject(Auth);
  


  readonly currentUser$: Observable<User | null>;


  constructor() {
    this.currentUser$ = authState(this.auth);
  }

  async login(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      return userCredential;
    } catch (error) {
      console.error('Error en login:', error);
      throw error; 
    }
  }

  async resetPassword(email: string) {
    try {
      return await sendPasswordResetEmail(this.auth, email);
    } catch (error) {
      console.error('Error en resetPassword:', error);
      throw error;
    }
  }
}