import { Component, OnInit } from '@angular/core';
import { FormControl} from "@angular/forms";
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { OrderResponse, MarketInstrument, MarketInstrumentList, Orderbook} from '@tinkoff/invest-openapi-js-sdk/build/domain';
import { BehaviorSubject, combineLatest , of, Subscription } from 'rxjs';
import {
  catchError,
  debounceTime,
  delay,
  distinctUntilChanged,
  filter,
  map,
  repeat,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs/operators';

import { InvestService} from '@services/invest.service';
import { DisposableService } from '@helpers/disposable.service';

@Component({
  selector: 'app-buy-instrument',
  templateUrl: './buy-instrument.component.html',
  styleUrls: ['./buy-instrument.component.scss'],
  providers: [DisposableService],
})
export class BuyInstrumentComponent implements OnInit {

  public ticker = new FormControl(null);
  public moneyAmount = new FormControl(null);
  public instruments: Array<MarketInstrument>;
  public selectedInstrument = new BehaviorSubject<MarketInstrument>(null);
  public searchActive = false;
  public currentTopBid = new BehaviorSubject<OrderResponse>(null);
  public lotsAmount: number = null;
  private pollingSubscription: Subscription;
  public buyLoading = false;

  constructor(
    private investService: InvestService,
    private disposable: DisposableService,
  ) {}

  ngOnInit(): void {
    this.ticker.valueChanges
      .pipe(
        takeUntil(this.disposable.destroy$),
        debounceTime(700),
        map((value: string) => value.trim().toUpperCase()),
        distinctUntilChanged(),
        tap((value) => {
          if (value) {
            this.searchActive = true;
          } else {
            this.selectedInstrument.next(null);
          }
        }),
        filter((value: string) => Boolean(value)),
        switchMap((value: string) => this.investService.searchInstrument(value)),
        tap(() => {
          this.searchActive = false;
          this.selectedInstrument.next(null);
        }),
        map((res: MarketInstrumentList) => res.instruments),
      ).subscribe(
        (items: Array<MarketInstrument>) => {
          this.instruments = items;
        },
        (err) => {
          console.error(err);
          this.searchActive = false;
          this.instruments = [];
        },
      );

    this.selectedInstrument
      .pipe(
        takeUntil(this.disposable.destroy$),
        distinctUntilChanged(),
      ).subscribe((instr) => {
        if (instr) {
          this.startPollingBids(instr);
          return;
        }
        this.stopPollingBids();
      this.currentTopBid.next(null);
    });

    combineLatest([
      this.moneyAmount.valueChanges,
      this.currentTopBid,
    ])
      .pipe(
        takeUntil(this.disposable.destroy$),
      ).subscribe(([moneyAmount, bid]) => {
        if (!moneyAmount || !bid) {
          this.lotsAmount = null;
          return;
        }
        this.lotsAmount = Math.floor(moneyAmount / bid.price);
    })
  }

  public optionSelected(e: MatAutocompleteSelectedEvent): void {
    this.selectedInstrument.next(
      this.instruments.find((instr) => instr.ticker === e.option.value)
    );
  }


  private stopPollingBids(): void {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }
  }

  private startPollingBids(instr: MarketInstrument): void {
    this.stopPollingBids();
    this.pollingSubscription = this.investService.getInstrumentOrderbook(instr.figi)
      .pipe(
        catchError((err) => {
          console.error(err);
          return of(null);
        }),
        delay(2000),
        repeat(),
      ).subscribe((orderbook: Orderbook) => {
        if (orderbook) {
          this.currentTopBid.next(orderbook.bids[0]);
          return;
        }
        this.currentTopBid.next(null);
      });
  }

  public buy(): void {
    const lots = this.lotsAmount;
    const instr = this.selectedInstrument.getValue();
    const bid = this.currentTopBid.getValue();
    if (!lots || !instr) {
      return;
    }
    this.buyLoading = true;
    this.investService.buyInstrumentLots({
      figi: instr.figi,
      price: bid.price,
      lots,
    })
      .pipe(
        tap(() => {
          this.buyLoading = false;
        }),
      )
      .subscribe(
      (res) => {
        console.log(res);
      },
      (err) => {
        console.error(err);
      },
    );

  }

}
