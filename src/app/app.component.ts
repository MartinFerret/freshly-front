import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {OrderListComponent} from './components/order-list/order-list.component';
import {Toast} from 'primeng/toast';
import {ConfirmationService, MessageService} from 'primeng/api';
import {ConfirmDialog} from 'primeng/confirmdialog';
import {ConfirmService} from './shared/services/confirm.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, OrderListComponent, Toast, ConfirmDialog],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [MessageService, ConfirmationService, ConfirmService]
})
export class AppComponent {
  title = 'freshly-front';
}
