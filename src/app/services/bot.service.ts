import {Injectable, OnDestroy} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable, Subscription, of} from 'rxjs';
import {
  catchError,
  delay,
  filter,
  distinctUntilChanged,
  map,
  repeat,
  tap,
  concatMap
} from 'rxjs/operators';

import {BotConfig, BotLog, BotState, StocksFilter} from "@app/models/bot";
import { environment } from "@env/environment";

@Injectable({
  providedIn: 'root',
})
export class BotService implements OnDestroy {
  public readonly logState = new BehaviorSubject<BotLog>(null);
  public readonly state = new BehaviorSubject<BotState>(null);
  private logPollingSubscription: Subscription;
  private statePollingSubscription: Subscription;


  constructor(private http: HttpClient) {
    this.initMonitoring();
    this.getLog().subscribe(log => this.logState.next(log));
    this.getState().subscribe(state => this.state.next(state));
  }

  public ngOnDestroy(): void {
    this.stopPollingLog();
    this.stopPollingState();
  }

  public getBotConfig(): Observable<BotConfig> {
    return this.http.get<BotConfig>(`${environment.apiUrl}/api/bot/config`);
  }

  public patchBotConfig(config: Partial<BotConfig>): Observable<BotConfig> {
    return this.http.patch<BotConfig>(`${environment.apiUrl}/api/bot/config`, config);
  }

  public getStocksFilter(): Observable<StocksFilter> {
    return  this.http.get<StocksFilter>(`${environment.apiUrl}/api/bot/stocks-filter`);
  }

  public patchStocksFilter(filter: StocksFilter): Observable<StocksFilter> {
    return this.http.patch<StocksFilter>(`${environment.apiUrl}/api/bot/stocks-filter`, filter);
  }

  public getLog(): Observable<BotLog> {
    return this.http.get<BotLog>(`${environment.apiUrl}/api/bot/log`);
  }

  public getState(): Observable<BotState> {
    return this.http.get<BotState>(`${environment.apiUrl}/api/bot/state`);
  }

  public toggleEnabledState(): Observable<BotState> {
    return this.patchBotConfig({ enabled: !this.state.getValue().enabled })
      .pipe(
        concatMap(() => this.getState()),
        tap(state => this.state.next(state)),
      );
  }

  private initMonitoring(): void {
    this.state
      .pipe(
        filter(state => Boolean(state)),
        map(state => state.enabled),
        tap(() => this.getLog().subscribe(log => this.logState.next(log))),
        distinctUntilChanged(),
      ).subscribe((enabled) => {
        if (enabled) {
          this.startPollingState();
          return;
        }
        this.stopPollingLog();
        this.stopPollingState();
        this.getState().subscribe(state => this.state.next(state));
    });
  }

  public startPollingLog(): void {
    if (this.logPollingSubscription) {
      return;
    }
    this.logPollingSubscription = this.getLog()
      .pipe(
        catchError((err) => {
          console.error(err);
          return of(null);
        }),
        delay(5000),
        repeat(),
      ).subscribe((log) => {
        if (log) {
          this.logState.next(log);
        }
      });
  }

  public startPollingState(): void {
    if (this.statePollingSubscription) {
      return;
    }
    this.statePollingSubscription = this.getState()
      .pipe(
        catchError((err) => {
          console.error(err);
          return of(null);
        }),
        delay(2000),
        repeat(),
      ).subscribe((state) => {
        if (state) {
          this.state.next(state);
        }
      });
  }

  public stopPollingState(): void {
    if (this.statePollingSubscription) {
      this.statePollingSubscription.unsubscribe();
      this.statePollingSubscription = null;
    }
  }

  public stopPollingLog(): void {
    if (this.logPollingSubscription) {
      this.logPollingSubscription.unsubscribe();
      this.logPollingSubscription = null;
    }
  }
}

