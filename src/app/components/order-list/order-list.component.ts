import {Component, inject} from '@angular/core';
import {OrderService} from '../../shared/services/order/order.service';
import {toSignal} from '@angular/core/rxjs-interop';
import {Button} from 'primeng/button';
import {CurrencyPipe, DatePipe, TitleCasePipe} from '@angular/common';

@Component({
  selector: 'app-order-list',
  imports: [
    Button,
    CurrencyPipe,
    DatePipe,
    TitleCasePipe
  ],
  standalone: true,
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.scss'
})
export class OrderListComponent {
  private readonly orderService = inject(OrderService);
  protected orders = toSignal(this.orderService.getOrders(), { initialValue: [] });
}
