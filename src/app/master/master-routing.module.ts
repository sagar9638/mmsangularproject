import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from '../master/login/login.component'
import { BlogsMasterComponent } from './blogs-master/blogs-master.component';
import { BlogsComponent } from './blogs/blogs.component';
import { CategoryMasterComponent } from './category-master/category-master.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DesignationMasterComponent } from './designation-master/designation-master.component';
import { EventsMasterComponent } from './events-master/events-master.component';
import { EventsComponent } from './events/events.component';
import { GalleryMasterComponent } from './gallery-master/gallery-master.component';
import { GalleryComponent } from './gallery/gallery.component';
import { HomeComponent } from './home/home.component';
import { LeadUserComponent } from './lead-user/lead-user.component';
import { MenuMasterComponent } from './menu-master/menu-master.component';
import { MenuRightsMasterComponent } from './menu-rights-master/menu-rights-master.component';
import { NewsMasterComponent } from './news-master/news-master.component';
import { NewsComponent } from './news/news.component';
import { PackageMasterComponent } from './package-master/package-master.component';
import { PackageComponent } from './package/package.component';
import { RaceComponent } from './race/race.component';
import { RegisterComponent } from './register/register.component';
import { UserMasterComponent } from './Report/user-master/user-master.component';
import { TeamManagemantComponent } from './team-managemant/team-managemant.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { UserProfileComponent } from './user-profile/user-profile.component';

const routes: Routes = [
  
  {
    path: 'Package',
    component: PackageComponent,
  },
  {
    path: 'PackageMaster',
    component: PackageMasterComponent,
  },
  {
    path: 'Register',
    component: RegisterComponent,
  },
  { path: 'Register/:RefId',
    component: RegisterComponent 
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'Home',
    component: HomeComponent,
  },
  {
    path: 'Race',
    component: RaceComponent,
  },
  {
    path: 'Event',
    component: EventsComponent,
  },
  {
    path: 'TeamManagemant',
    component: TeamManagemantComponent,
  },
  {
    path: 'News',
    component: NewsComponent,
  },
  {
    path: 'NewsMaster',
    component: NewsMasterComponent,
  },
  {
    path: 'Blogs',
    component: BlogsComponent,
  },
  {
    path: 'BlogsMaster',
    component: BlogsMasterComponent,
  },
  {
    path: 'Gallery',
    component: GalleryComponent,
  },
  {
    path: 'UserProfile',
    component: UserProfileComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'userDetail',
    component: UserMasterComponent,
  },
  {
    path: 'MembersHierarchy',
    component: UserDetailComponent,
  },
  {
    path: 'MenuMaster',
    component: MenuMasterComponent,
  },
  {
    path: 'DesignationMaster',
    component: DesignationMasterComponent,
  },
  {
    path: 'Leads',
    component: LeadUserComponent,
  },
  {
    path: 'MenuRightsMaster',
    component: MenuRightsMasterComponent,
  },
  {
    path: 'GalleryMaster',
    component: GalleryMasterComponent,
  },
  {
    path: 'EventsMaster',
    component: EventsMasterComponent
  },
  {
    path: 'CategoryMaster',
    component: CategoryMasterComponent
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterRoutingModule { }
