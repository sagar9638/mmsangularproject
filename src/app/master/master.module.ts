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

@NgModule({
  declarations: [
    RegisterComponent,
    DashboardComponent,
    LoginComponent,
    UserMasterComponent, UserDetailComponent, HomeComponent, RaceComponent, EventsComponent, TeamManagemantComponent, NewsComponent, GalleryComponent, UserProfileComponent, MenuMasterComponent, DesignationMasterComponent, LeadUserComponent, DesignationDetailComponent],
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
  ],
  providers: [
    GlobalService,
  ],
})
export class MasterModule { }
