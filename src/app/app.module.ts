import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

import { ErrorInterceptor, SessionInterceptor } from './helpers';
import { AlertComponent } from './components/alert/alert.component';

import { UiModule } from '@app/modules/ui/ui.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConfigComponent } from './components/config/config.component';
import { ActionsLogComponent } from './components/actions-log/actions-log.component';
import { DatePipe } from './pipes/date.pipe';
import { TopPanelComponent } from './components/top-panel/top-panel.component';
import { BotSwitcherComponent } from './components/bot-switcher/bot-switcher.component';
import { BotInstrumentsMonitorComponent } from './components/bot-instruments-monitor/bot-instruments-monitor.component';
import { BuyInstrumentComponent } from './components/buy-instrument/buy-instrument.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    AlertComponent,
    ConfigComponent,
    ActionsLogComponent,
    DatePipe,
    TopPanelComponent,
    BotSwitcherComponent,
    BotInstrumentsMonitorComponent,
    BuyInstrumentComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    UiModule,
    BrowserAnimationsModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: SessionInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
