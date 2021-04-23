import { Component, OnInit } from '@angular/core';

import { BotService } from '@services/bot.service';
import { Log } from "@app/models";
import { Observable } from "rxjs";
import { map, pairwise } from "rxjs/operators";

@Component({
  selector: 'app-actions-log',
  templateUrl: './actions-log.component.html',
  styleUrls: ['./actions-log.component.scss']
})
export class ActionsLogComponent implements OnInit {

  public logState: Observable<Log>;
  public newItemsCount = 0;

  constructor(public botService: BotService) { }

  public ngOnInit(): void {
    this.logState = this.botService.logState
      .pipe(
        pairwise(),
        map(([prev, curr]) => {
          if (prev) {
            for (let i = 0; i < curr.length; i++) {
              if (!prev[0]) {
                break;
              }
              if (curr[i].date === prev[0].date) {
                this.newItemsCount = i;
                break;
              }
            }
          }
          return curr;
        }),
      )
  }
}
