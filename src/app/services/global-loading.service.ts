import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, of } from "rxjs";
import { switchMap, delay } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class GlobalLoadingService {
  public loading$ = new BehaviorSubject<boolean>(true);
  private stateHandler$ = new Subject<boolean>();

  constructor() {
    this.stateHandler$
      .pipe(
        switchMap((state) => {
          if (state) {
            return of(state);
          }
          return of(state).pipe(delay(1500));
        }),
      ).subscribe((state) => {
        this.loading$.next(state);
    })
  }

  public setState(state: boolean): void {
    this.stateHandler$.next(state);
  }
 }
