import { Directive, ElementRef, OnInit, OnDestroy, Renderer2, Input } from '@angular/core';

@Directive({
  selector: '[appScrollFade]',
  standalone: true
})
export class ScrollFadeDirective implements OnInit, OnDestroy {
  @Input() delay: number = 0;
  @Input() threshold: number = 0.15;
  @Input() duration: number = 0.8;

  private observer: IntersectionObserver | null = null;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    // Initial state: hidden and slightly translated down
    this.renderer.setStyle(this.el.nativeElement, 'opacity', '0');
    this.renderer.setStyle(this.el.nativeElement, 'transform', 'translateY(30px)');
    this.renderer.setStyle(
      this.el.nativeElement, 
      'transition', 
      `opacity ${this.duration}s cubic-bezier(0.2, 0.8, 0.2, 1), transform ${this.duration}s cubic-bezier(0.2, 0.8, 0.2, 1)`
    );
    this.renderer.setStyle(this.el.nativeElement, 'transition-delay', `${this.delay}ms`);

    // Create observer
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.renderer.setStyle(this.el.nativeElement, 'opacity', '1');
          this.renderer.setStyle(this.el.nativeElement, 'transform', 'translateY(0)');
          // Option to unobserve after fading in once:
          this.observer?.unobserve(this.el.nativeElement);
        }
      });
    }, { 
      threshold: this.threshold,
      rootMargin: '0px 0px -50px 0px' // Trigger slightly before it hits the viewport properly
    });

    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
