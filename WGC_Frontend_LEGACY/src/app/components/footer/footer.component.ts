import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ScrollFadeDirective } from '../../directives/scroll-fade.directive';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, ScrollFadeDirective],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {

}
