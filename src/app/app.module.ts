import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { Ng2TableModule } from 'ng2-table/ng2-table';


import { AppComponent } from './app.component';
import { FooterComponent } from './footer/footer.component';
import { SideMenuComponent } from './side-menu/side-menu.component';
import { TopNavigationComponent } from './top-navigation/top-navigation.component';
import { StudentsComponent } from './students/students.component';
import { HomePageComponent } from './home-page/home-page.component';

const ROUTES = [
  {
    path: '',
    component: HomePageComponent
  },
  {
    path: 'students',
    component: StudentsComponent
  }
];

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    SideMenuComponent,
    TopNavigationComponent,
    StudentsComponent,
    HomePageComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    Ng2TableModule,
    RouterModule.forRoot(ROUTES) // Add routes to the app
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
