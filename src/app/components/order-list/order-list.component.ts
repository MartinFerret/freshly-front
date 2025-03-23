import {Component, inject, OnDestroy} from '@angular/core';
import {OrderService} from '../../shared/services/order/order.service';
import {Button} from 'primeng/button';
import {CurrencyPipe, DatePipe, TitleCasePipe} from '@angular/common';
import {Order} from '../../shared/models/order.model';
import {Subscription} from 'rxjs';
import {PollingService} from '../../shared/services/polling/polling.service';

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
export class OrderListComponent implements OnDestroy{
  private readonly orderService = inject(OrderService);
  private readonly pollingService = inject(PollingService);
  protected orders: Order[] = [];
  private readonly subscriptions: Subscription[] = [];

  constructor() {
    this.subscriptions.push(this.orderService.getOrders().subscribe((orders) => {
      this.orders = orders;
    }))
    this.pollingOrders();
  }

  protected changeStatus(order: Order): void {
    if (order.state === 'paid') {
      order.state = 'delivered';
    } else {
      order.state = 'paid';
    }
  this.subscriptions.push(    this.orderService.updateOrderStatus(order.id, order.state).subscribe(
    (updatedOrder) => {
      const index = this.orders.findIndex(o => o.id === updatedOrder.id);
      if (index !== -1) {
        this.orders[index] = updatedOrder;

        if (updatedOrder.state === 'paid') {
          this.orders.unshift(this.orders.splice(index, 1)[0]);
        }
      }
    }
  ));
  }

  private pollingOrders() {
    this.pollingService.startPolling();
    this.subscriptions.push( this.pollingService.getOrders().subscribe((orders) => {
      this.orders = orders;
    }));
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    this.pollingService.stopPolling();
  }
}
