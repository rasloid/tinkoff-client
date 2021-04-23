import {Component, HostBinding, OnInit, Input} from '@angular/core';

interface LabelColors {
  bcg: string;
  text: string;
}

const ColorsMap = new Map<string, LabelColors>();
ColorsMap.set('general', { bcg: 'rgb(65, 105, 194)', text: '#FFFFFF'});
ColorsMap.set('error', { bcg: 'rgb(203, 46, 72)', text: '#FFFFFF'});


@Component({
  selector: 'app-label',
  templateUrl: './label.component.html',
  styleUrls: ['./label.component.scss']
})
export class LabelComponent implements OnInit {
  @Input() public title: string;
  @HostBinding('style.background') private bcgColor: string;
  @HostBinding('style.color') private textColor: string;

  constructor() { }

  ngOnInit(): void {
    if (this.title) {
      let colors = ColorsMap.get(this.title);
      if (colors) {
        this.bcgColor = colors.bcg;
        this.textColor = colors.text;
        return;
      }
      const r = Math.floor(Math.random() * 255);
      const g = Math.floor(Math.random() * 255);
      const b = Math.floor(Math.random() * 255);
      this.bcgColor = `rgb(${r},${g}, ${b})`;
      this.textColor = (r * 0.299 + g * 0.587 + b * 0.114) > 186 ? '#000000' : '#FFFFFF';
      ColorsMap.set(this.title, {
        bcg: this.bcgColor,
        text: this.textColor,
      });

    }
  }

}
