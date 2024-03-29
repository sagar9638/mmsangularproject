import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MasterRoutingModule } from './master-routing.module';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { UserMasterComponent } from './Report/user-master/user-master.component';
import { FormsModule as ngFormsModule } from '@angular/forms';
import { GlobalService } from '../Service/global.service';
import { HttpModule } from '@angular/http';
import {
  NbActionsModule,
  NbButtonModule,
  NbCardModule,
  NbCheckboxModule,
  NbDatepickerModule,
  NbIconModule,
  NbInputModule,
  NbRadioModule,
  NbSelectModule,
  NbUserModule,
  NbMenuModule,
  NbTabsetModule,
  NbListModule,
  NbDialogModule,
  NbPopoverModule,
  NbTooltipModule,
  NbWindowModule,
  NbTreeGridModule,
  NbRouteTabsetModule,
} from '@nebular/theme';
import { ThemeModule } from '../@theme/theme.module';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { NgxSpinnerModule } from "ngx-spinner";
import { HomeComponent } from './home/home.component';
import { RaceComponent } from './race/race.component';
import { EventsComponent } from './events/events.component';
import { TeamManagemantComponent } from './team-managemant/team-managemant.component';
import { NewsComponent } from './news/news.component';
import { GalleryComponent } from './gallery/gallery.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { MenuMasterComponent } from './menu-master/menu-master.component';
import { DesignationMasterComponent } from './designation-master/designation-master.component';
import { LeadUserComponent } from './lead-user/lead-user.component';
import { TablesRoutingModule } from '../pages/tables/tables-routing.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { DesignationDetailComponent } from './designation-detail/designation-detail.component';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireModule } from '@angular/fire';
import { GalleryMasterComponent } from './gallery-master/gallery-master.component';
import { MenuRightsMasterComponent } from './menu-rights-master/menu-rights-master.component';
import { LeadUserDetailComponent } from './lead-user-detail/lead-user-detail.component';
import { EventsMasterComponent } from './events-master/events-master.component';
import { IConfig, NgxMaskModule } from 'ngx-mask';
import { CategoryMasterComponent } from './category-master/category-master.component';
import { UserDetailPopupComponent } from './team-managemant/user-detail-popup/user-detail-popup.component';
import { GallaryPopupComponent } from './gallary-popup/gallary-popup.component';
import { UserEditProfilePopupComponent } from './user-profile/user-edit-profile-popup/user-edit-profile-popup.component';
import { PackageComponent } from './package/package.component';
import { PackageMasterComponent } from './package-master/package-master.component';
import { BlogsComponent } from './blogs/blogs.component';
import { BlogsMasterComponent } from './blogs-master/blogs-master.component';
import { NewsMasterComponent } from './news-master/news-master.component';

const maskConfig: Partial<IConfig> = {
  validation: false,
};


@NgModule({
  declarations: [
    RegisterComponent,
    DashboardComponent,
    LoginComponent,
    UserMasterComponent, UserDetailComponent, HomeComponent, RaceComponent, EventsComponent, TeamManagemantComponent, NewsComponent, GalleryComponent, UserProfileComponent, MenuMasterComponent, DesignationMasterComponent, LeadUserComponent, DesignationDetailComponent
    , GalleryMasterComponent
    , MenuRightsMasterComponent, LeadUserDetailComponent, EventsMasterComponent, CategoryMasterComponent, UserDetailPopupComponent, GallaryPopupComponent, UserEditProfilePopupComponent, PackageComponent, PackageMasterComponent, BlogsComponent, BlogsMasterComponent, NewsMasterComponent
  ],
  imports: [
    CommonModule,
    MasterRoutingModule,
    ngFormsModule,
    NbActionsModule,
    NbButtonModule,
    NbCardModule,
    NbCheckboxModule,
    NbDatepickerModule, NbIconModule,
    NbInputModule,
    NbRadioModule,
    NbSelectModule,
    NbUserModule,
    HttpModule,
    NbMenuModule,
    ThemeModule,
    NbTabsetModule,
    NbListModule,
    NbDialogModule,
    NbPopoverModule,
    NbTooltipModule,
    NbWindowModule,
    NgxSpinnerModule,

    NbTreeGridModule,
    TablesRoutingModule,
    Ng2SmartTableModule,

    AngularFireModule.initializeApp({
      apiKey: "AIzaSyCm_z7lliZ6MmnK5jUadlLFYMXeaol4pPU",
      authDomain: "webmmstemp.firebaseapp.com",
      projectId: "webmmstemp",
      storageBucket: "webmmstemp.appspot.com",
      messagingSenderId: "831347352282",
      appId: "1:831347352282:web:8f3720c02fad2754627be3",
      measurementId: "G-MEDXHSQ72W"
    }),
    AngularFireStorageModule,
    NbRouteTabsetModule,
    NgxMaskModule.forRoot(maskConfig)

  ],
  providers: [
    GlobalService,
  ],
})
export class MasterModule { }
