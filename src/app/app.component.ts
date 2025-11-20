import { Component } from '@angular/core';
import { PhotoListComponent } from './components/photo-list/photo-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
   imports: [PhotoListComponent],
  template: `<app-photo-list></app-photo-list>`
})
export class AppComponent {
  title = 'parcial-desarrollo-web';
}