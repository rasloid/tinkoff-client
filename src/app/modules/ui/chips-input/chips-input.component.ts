import { Component, OnInit, forwardRef, Input } from '@angular/core';
import {FormControl, NG_VALUE_ACCESSOR} from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';

import { ValueAccessorBase } from '@helpers/value-accessor-base';

let nextUniqueId = 0;

@Component({
  selector: 'app-chips-input',
  templateUrl: './chips-input.component.html',
  styleUrls: ['./chips-input.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ChipsInputComponent),
    multi: true,
  }],
})
export class ChipsInputComponent extends ValueAccessorBase<Array<string>> implements OnInit {
  @Input() public id = `app-chips-input-${nextUniqueId++}`;
  public separatorKeysCodes: number[] = [13, 188];
  public inputControl = new FormControl();

  constructor() {
    super();
  }

  public ngOnInit(): void {
  }


  public add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if (!this.value) {
      this.value = [];
    }

    if ((value || '').trim()) {
      const copy = [...this.value];
      copy.push(value.trim());
      this.value = copy;
    }
    if (input) {
      input.value = '';
    }
    this.inputControl.setValue(null);
  }

  public remove(item: string): void {
    const index = this.value.indexOf(item);
    if (index >= 0) {
      const copy = [...this.value];
      copy.splice(index, 1);
      this.value = copy;
    }
  }

}
