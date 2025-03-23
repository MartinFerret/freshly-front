import {Component, inject, OnDestroy} from '@angular/core';
import {OrderService} from '../../shared/services/order/order.service';
import {Button} from 'primeng/button';
import {CurrencyPipe, DatePipe, TitleCasePipe} from '@angular/common';
import {Order} from '../../shared/models/order.model';
import {Subscription} from 'rxjs';
import {PollingService} from '../../shared/services/polling/polling.service';
import {MessageService} from 'primeng/api';
import {ConfirmService} from '../../shared/services/confirm.service';
import {Dialog} from 'primeng/dialog';
import {Divider} from 'primeng/divider';
import {OrderDialogComponent} from '../../shared/components/order-dialog/order-dialog.component';

@Component({
  selector: 'app-order-list',
  imports: [
    Button,
    CurrencyPipe,
    DatePipe,
    TitleCasePipe,
    Dialog,
    Divider,
    OrderDialogComponent
  ],
  standalone: true,
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.scss'
})
export class OrderListComponent implements OnDestroy{
  private readonly orderService = inject(OrderService);
  private readonly pollingService = inject(PollingService);
  private readonly messageService = inject(MessageService);
  private readonly confirmService = inject(ConfirmService);
  protected orders: Order[] = [];
  private readonly subscriptions: Subscription[] = [];
  protected visible = false;
  protected selectedOrder: Order | null = null;

  constructor() {
    this.subscriptions.push(this.orderService.getOrders().subscribe((orders) => {
      this.orders = orders;
    }))
    this.pollingOrders();
  }

  protected showOrderDetails(order: Order) {
    this.visible = !this.visible;
    this.selectedOrder = order;
  }

  protected confirmUpdate(order: Order) {
    this.confirmService.openConfirm({
      message: 'Are you certain to update order #00' + order.id + "'s status ?",
      accept: () => this.changeStatus(order)
    })
  }

  protected deleteConfirm(orderId: number) {
    this.confirmService.openConfirm({
      message: 'Are you certain to delete order #00' + orderId + " ?",
      accept: () => this.deleteOrder(orderId)
    })
  }

  private deleteOrder(orderId: number) {
    this.subscriptions.push(this.orderService.deleteOrder(orderId).subscribe(() => {
      this.orders = this.orders.filter(order => order.id !== orderId);
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Order #00' + orderId + ' deleted' });
    }));
  }

  private changeStatus(order: Order): void {
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
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Status updated for Order #00' + order.id });
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
