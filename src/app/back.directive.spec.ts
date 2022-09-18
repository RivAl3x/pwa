import { BackDirective } from './back.directive';

describe('BackDirective', () => {
  it('should create an instance', () => {
    const directive = new BackDirective();
    expect(directive).toBeTruthy();
  });
});


import { Directive, HostListener } from '@angular/core';
import { Location } from '@angular/common';

@Directive({
    selector: '[backButton]'
})
export class BackButtonDirective {
    constructor(private location: Location) { }

    @HostListener('click')
    onClick() {
        this.location.back();
    }
}
