import { Injectable } from "@angular/core";
import { Observable, BehaviorSubject } from "rxjs";

import { JwtService } from "./jwt.service";
import { map, distinctUntilChanged, tap, shareReplay } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { User } from "../user.model";
import { Router } from "@angular/router";

@Injectable({ providedIn: "root" })
export class UserService {
  
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser = this.currentUserSubject
    .asObservable()
    .pipe(distinctUntilChanged());

  public isAuthenticated = this.currentUser.pipe(map((user) => !!user));

  constructor(
    private readonly http: HttpClient,
    private readonly jwtService: JwtService,
    private readonly router: Router,
  ) {}
  
/** 
  login(credentials: { // Task 2
    email: string;
    password: string;
  }): Observable<{ user: User }> {
    return this.http
      .post<{ user: User }>("/users/login", { user: credentials })
      .pipe(tap(({ user }) => this.setAuth(user)));
  }
*/
  login(credentials: { email: string; password: string }): Observable<{ user: User }> {
    
    const mockUser: User = {
      username: "",
      email: "",
      token: "",
      bio: "",
      image: ""
    };

    
    this.setAuth(mockUser);
  
    return new Observable<{ user: User }>((observer) => {
      observer.next({ user: mockUser });
      observer.complete();
    });
  }
    
  register(credentials: { username: string; email: string; password: string }): Observable<{ user: User }> {
    
    const mockUser: User = {
      username: credentials.username,
      email: credentials.email,
      token: "",
      bio: "",
      image: ""
    };
    return new Observable<{ user: User }>((observer) => {
      observer.next({ user: mockUser });
      observer.complete();
    });
  }
    
  logout(): void {
    this.purgeAuth();
    void this.router.navigate(["/"]);
  }

  getCurrentUser(): Observable<{ user: User }> {
    return new Observable<{ user: User }>((observer) => {
      
      const mockUser: User = {
        username: "",
        email: "",
        token: "",
        bio: "",
        image: ""
      };

      observer.next({ user: mockUser });
      observer.complete();
    });
  }

  update(user: Partial<User>): Observable<{ user: User }> {
    return new Observable<{ user: User }>((observer) => {
      const mockUser: User = {
        username: "",
        email: "",
        token: "",
        bio: "",
        image: ""
      };

      observer.next({ user: mockUser });
      observer.complete();
    });
  }
  


  setAuth(user: User): void {
    this.jwtService.saveToken(user.token);
    this.currentUserSubject.next(user);
  }

  purgeAuth(): void {
    this.jwtService.destroyToken();
    this.currentUserSubject.next(null);
  }
  
}

