import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import {
  MatDialog,
} from '@angular/material/dialog';
import { DialogEditUserComponent } from '../dialog-edit-user/dialog-edit-user.component';
import { SearchService } from 'src/app/services/search.service';
import { GlobalService } from 'src/app/services/global.service';
import { UserTemplate } from 'src/app/models/usertemplate.class';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  public searchText: string;
  public icon = 'menu_open';

  constructor(
    public authService: AuthService,
    private router: Router,
    public usersService: UsersService,
    public firestore: FirestoreService,
    public dialog: MatDialog,
    public searchService: SearchService,
    private globalService: GlobalService,
  ) {}

  currentUserDisplayName: any;
  currentUser = new UserTemplate(); 

  async ngOnInit () {
    this.startSearchEvent();
  }

  toggleSidebar() {
    this.globalService.toggleSidebar();
    this.icon = this.icon === 'menu_open' ? 'menu' : 'menu_open';
}
  
  get authUser$() {
    return this.authService.getAuthCredentials();
  }
  get currentUserId$() {
    return this.usersService.currentUserId$;
  }
  get currentUserPhoto() {
    return this.usersService.currentUserPhoto;
  }
  get currentUserName$() {
    return this.usersService.currentUserName$;
  }

  logOut() {
    this.authService.logOut();
    this.router.navigate(['']);
  }


  logFirebaseAuthCredentials() {
    this.authService.getAuthCredentials();
  }


  openDialog() {
    this.dialog.open(DialogEditUserComponent, {
      panelClass: 'dialog-panel', // Aad a custom panel class
      data: {
        emailVerified: this.authUser$.emailVerified,
      },
    });
  }


  /**
   * start search event after 1 second (to prevent errors)
   */
  startSearchEvent() {
    setTimeout(() => {
      const searchbar = document.getElementById('searchbar');
      searchbar.addEventListener('keyup', () => {
        this.searchingComponents(this.searchText);
      });
    }, 1000);
  }

  /**
   * search function for channel and chat
   * @param searchText - the search text from input field
   */
  searchingComponents(searchText: string) {
    this.searchService.searchingFunction(searchText);
  }
}
