import { Directive, ElementRef, HostListener, inject, input, OnInit } from '@angular/core';

@Directive({
  selector: '[appOpenTab]',
})
export class OpenTabDirective implements OnInit {
  url = input.required<string>({ alias: 'appOpenTab' });

  private readonly element = inject(ElementRef).nativeElement as HTMLElement;

  ngOnInit(): void {
    this.element.style.cursor = 'alias';
  }

  @HostListener('click')
  openTab() {
    if (this.url) {
      window.open(this.url());
    }
  }

}
