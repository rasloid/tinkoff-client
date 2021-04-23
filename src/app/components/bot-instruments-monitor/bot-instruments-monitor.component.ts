import { Component, OnInit } from '@angular/core';

import { BotService } from '@services/bot.service';
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ActiveInstrument } from "@models/bot";

@Component({
  selector: 'app-bot-instruments-monitor',
  templateUrl: './bot-instruments-monitor.component.html',
  styleUrls: ['./bot-instruments-monitor.component.scss']
})
export class BotInstrumentsMonitorComponent implements OnInit {

  public activeInstruments: Observable<Array<ActiveInstrument>>;
  public displayedColumns = ['ticker', 'prevStopPrice', 'currPrice', 'status'];

  constructor(public botService: BotService) { }

  public ngOnInit(): void {
    this.activeInstruments = this.botService.state
      .pipe(
        map((botState) => botState?.activeItems || []),
      );
  }
}
