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

@NgModule({
  declarations: [
    RegisterComponent,
    DashboardComponent,
    LoginComponent,
    UserMasterComponent, UserDetailComponent, HomeComponent, RaceComponent, EventsComponent, TeamManagemantComponent, NewsComponent, GalleryComponent, UserProfileComponent],
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
    NgxSpinnerModule
  ],
  providers: [
    GlobalService,
  ],
})
export class MasterModule { }
