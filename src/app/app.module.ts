import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { FileUploadModule } from "ng2-file-upload";
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { RegisterComponent } from './register/register.component';
import { SharedModule, PageNotFoundComponent, QRCodeComponent, AuthService, AuthGuardService,QuizDisplayComponent } from './shared/shared.module';


const ROUTES = [
    { path: '', loadChildren: 'app/layout/layout.module#LayoutModule' }, 
    { path: 'login', component: LoginComponent},
    { path: 'register', component: RegisterComponent},
    { path: 'logout', component: LogoutComponent},
    { path: 'forgot-password', component: ForgotPasswordComponent},
    { path: 'qr-code', component: QRCodeComponent },
    { path: 'quiz/display', component: QuizDisplayComponent },
    { path: '**', component: PageNotFoundComponent },

];

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        ForgotPasswordComponent,
        LogoutComponent,
        RegisterComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        FileUploadModule,
        SharedModule,
        RouterModule.forRoot(ROUTES), // Add routes to the app
    ],
    providers: [
        { provide: LOCALE_ID, useValue: "vi-VN" },
        AuthService, AuthGuardService
    ],
    bootstrap: [AppComponent]
})

export class AppModule {}
