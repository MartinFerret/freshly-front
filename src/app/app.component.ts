import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {OrderListComponent} from './components/order-list/order-list.component';
import {Toast} from 'primeng/toast';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, OrderListComponent, Toast],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [MessageService]
})
export class AppComponent {
  title = 'freshly-front';
}
