import { Component, OnInit } from '@angular/core';

import { BotService } from '@services/bot.service';
import { GlobalLoadingService } from '@services/global-loading.service';
import { BehaviorSubject } from "rxjs";
import { filter, map, takeUntil } from 'rxjs/operators';
import { DisposableService} from "@helpers/disposable.service";


@Component({
  selector: 'app-bot-switcher',
  templateUrl: './bot-switcher.component.html',
  styleUrls: ['./bot-switcher.component.scss'],
  providers: [DisposableService],
})
export class BotSwitcherComponent implements OnInit {

  public checked = false;
  public get loading(): BehaviorSubject<boolean> {
    return this.loadingService.loading$;
  }

  constructor(
    private botService: BotService,
    private loadingService: GlobalLoadingService,
    private disposable: DisposableService,
  ) { }

  ngOnInit(): void {
    this.botService.state
      .pipe(
        takeUntil(this.disposable.destroy$),
        filter(state => Boolean(state)),
        map(state => state.enabled),
      )
      .subscribe(enabled => this.checked = enabled);
  }

  public onToggle(): void {
    this.loadingService.setState(true);
    this.botService.toggleEnabledState()
      .subscribe(() => {
        this.loadingService.setState(false);
      })
  }
}
