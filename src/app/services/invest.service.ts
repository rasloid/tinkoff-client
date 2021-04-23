import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { MarketInstrumentList, Orderbook } from "@tinkoff/invest-openapi-js-sdk/build/domain";
import { Observable } from "rxjs";

import { environment } from "@env/environment";
import { BuyOpts } from '@models/invest';

@Injectable({
  providedIn: 'root'
})
export class InvestService {

  constructor(private http: HttpClient) {}

  public searchInstrument(ticker: string): Observable<MarketInstrumentList> {
    return this.http.get<MarketInstrumentList>(`${environment.apiUrl}/api/operations/search/${ticker}`);
  }

  public getInstrumentOrderbook(figi: string): Observable<Orderbook> {
    return this.http.get<Orderbook>(`${environment.apiUrl}/api/operations/orderbook/${figi}`);
  }

  public buyInstrumentLots(opts: BuyOpts): Observable<any> {
    return this.http.post(`${environment.apiUrl}/api/operations/buy`, opts);
  }
}
