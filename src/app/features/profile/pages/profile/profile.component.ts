import { Component, DestroyRef, inject, OnInit } from "@angular/core";
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from "@angular/router";
import { catchError, switchMap } from "rxjs/operators";
import { combineLatest, of, throwError } from "rxjs";
import { UserService } from "../../../../core/auth/services/user.service";
import { Profile } from "../../models/profile.model";
import { ProfileService } from "../../services/profile.service";
import { AsyncPipe, NgIf } from "@angular/common";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FollowButtonComponent } from "../../components/follow-button.component";
import { mockUser } from "src/app/core/auth/mockUser.service";
import { NONE_TYPE } from "@angular/compiler";

@Component({
  selector: "app-profile-page",
  templateUrl: "./profile.component.html",
  imports: [
    FollowButtonComponent,
    NgIf,
    RouterLink,
    AsyncPipe,
    RouterLinkActive,
    RouterOutlet,
    FollowButtonComponent,
  ],
  standalone: true,
})
export class ProfileComponent implements OnInit {
  profile!: Profile;
  isUser: boolean = false;
  destroyRef = inject(DestroyRef);
  wrongUser: boolean | undefined;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly userService: UserService,
    private readonly profileService: ProfileService,
  ) {}

  ngOnInit() { // You need to modify this for Task 3
   /**  this.profileService
      .get(this.route.snapshot.params["username"])
      .pipe(
        // catchError((error) => {
        //   void this.router.navigate(["/"]);
        //   return throwError(() => error);
        // }),
        */
        const username = this.route.snapshot.params['username'];
        const mockUser: mockUser = {
          username: "",
          email: "",
          token: "",
          bio: "",
          image: "",
          following: false
        };
        const some: Profile = {
          username : "",
          bio: "",
          following:false,
          image:""
        };

        if (username === 'smth') {
          this.profile = mockUser; 
          this.wrongUser = false;
        } else {
          this.profile = some;
          this.wrongUser = true; 
        }

        this.profileService
      .get(username)
      .pipe(
        switchMap((profile) => {
          return combineLatest([of(profile), this.userService.currentUser]);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(([profile, user]) => {
        this.profile = profile;
        this.isUser = profile.username === user?.username;
      }); 
  }

  onToggleFollowing(profile: Profile) {
    this.profile = profile;
  }
}
