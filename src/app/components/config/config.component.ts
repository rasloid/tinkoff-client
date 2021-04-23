import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

import { BotService } from '@services/bot.service';
import { BotConfig, StocksFilterTypes } from "@app/models/bot";

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss']
})
export class ConfigComponent implements OnInit {

  public form: FormGroup;
  public loading = true;
  public changed: boolean;
  public readonly filterTypes = StocksFilterTypes;

  public get filterForm(): FormGroup {
    return this.form.controls.stocksFilter as FormGroup;
  }

  constructor(
    private fb: FormBuilder,
    private botService: BotService,
  ) { }

  public ngOnInit(): void {
    this.form = this.fb.group({
      defaultLotAmount: [null, [Validators.required, Validators.min(1), Validators.max(50)]],
      priceUpDelta: [null, [Validators.required, Validators.min(0.0001), Validators.max(0.1)]],
      priceDownDelta: [null, [Validators.required, Validators.min(0.0001), Validators.max(0.1)]],
      stocksFilter: this.fb.group({
        type: [this.filterTypes.exclude],
        include: [[]],
        exclude: [[]],
      }),
    });
    this.form.disable();

    this.botService.getBotConfig()
      .subscribe((config: BotConfig) => {
        this.form.patchValue(config, { emitEvent: false });
        this.form.enable();
        this.loading = false;
        this.changed = false;
      });

    this.form.valueChanges.subscribe(() => {
      this.changed = true;
    });
  }

  public saveChanges(): void {
    if (!this.form.valid) {
      return;
    }
    this.loading = true;
    this.botService.patchBotConfig(this.form.value)
      .subscribe((config) => {
        this.form.patchValue(config, { emitEvent: false });
        this.form.enable();
        this.loading = false;
        this.changed = false;
      });
  }

}
