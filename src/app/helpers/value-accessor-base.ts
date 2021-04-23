import { HostBinding, Injectable } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';

@Injectable()
export class ValueAccessorBase<T> implements ControlValueAccessor {
  @HostBinding('class.disabled')
  @HostBinding('attr.aria-disabled')
  public disabled = false;

  // tslint:disable-next-line:variable-name
  private _value: T;
  private changed = new Array<(value: T) => void>();
  private touched = new Array<() => void>();

  public get value(): T {
    return this._value;
  }

  public set value(value: T) {
    if (this.valueChanged(this._value, value)) {
      this._value = value;
      this.changed.forEach(f => f(value));
    }
  }

  public valueChanged(next: T, prev: T): boolean {
    return next !== prev;
  }

  public touch(): void {
    this.touched.forEach(f => f());
  }

  public writeValue(value: T): void {
    this._value = value;
  }

  public registerOnChange(fn: (value: T) => void): void {
    this.changed.push(fn);
  }

  public registerOnTouched(fn: () => void): void {
    this.touched.push(fn);
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
