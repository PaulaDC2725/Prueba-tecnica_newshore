import {Directive, ElementRef, HostListener, Input, Renderer2} from '@angular/core';
import {NgControl} from '@angular/forms';
import {DecimalPipe} from '@angular/common';

@Directive({
  selector: '[appOnly]'
})
export class OnlyDirective {

  @Input('appOnly') type: string
  @Input() option:  'Lower' | 'Upper';

  blank = new RegExp(/^[\ ]+|[\ ]{2,}?|[\ ]+$/g);
  lastword = new RegExp(/([a-zA-z]+$)/g);
  decimalPipe: DecimalPipe;

  constructor(private el: ElementRef, private render: Renderer2, private control: NgControl) {
    this.decimalPipe = new DecimalPipe('en-US');
  }

  @HostListener('input') oninput() {
    const abstractControl  = this.control.control;
    let value = this.el.nativeElement.value;
    let r;
    let result;
    if (this.type === 'Letters') { // no permite caracteres
      r = new RegExp(/[0-9_-]+/g);
      result = value.replace(r, '');
      r = new RegExp(/[\\#+\[\]@$~%'":*¿?<°(),.&/|¨´;>{}!¡=]/g);
      result = result.replace(r, '');
      this.render.setProperty(this.el.nativeElement, 'value', result);
      abstractControl?.setValue(result);
    }
  }


  setValueControl(abstractControl:any, value:any) {
    if (abstractControl) {
      abstractControl.setValue(value);
    }
  }

}
