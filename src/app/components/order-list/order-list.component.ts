import {Component, inject, OnDestroy} from '@angular/core';
import {OrderService} from '../../shared/services/order/order.service';
import {Button} from 'primeng/button';
import {CurrencyPipe, DatePipe, NgIf} from '@angular/common';
import {Order} from '../../shared/models/order.model';
import {Subscription} from 'rxjs';
import {PollingService} from '../../shared/services/polling/polling.service';
import {MessageService} from 'primeng/api';
import {ConfirmService} from '../../shared/services/confirm/confirm.service';
import {Dialog} from 'primeng/dialog';
import {Divider} from 'primeng/divider';
import {DropdownModule} from 'primeng/dropdown';
import {OrderStatus} from '../../shared/models/order-status.models';
import {FormsModule} from '@angular/forms';
import {BadgeOrderComponent} from '../../shared/components/badge-order/badge-order.component';

@Component({
  selector: 'app-order-list',
  imports: [
    Button,
    CurrencyPipe,
    DatePipe,
    Dialog,
    Divider,
    DropdownModule,
    NgIf,
    FormsModule,
    BadgeOrderComponent
  ],
  standalone: true,
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.scss'
})
export class OrderListComponent implements OnDestroy {
  private readonly orderService = inject(OrderService);
  private readonly pollingService = inject(PollingService);
  private readonly messageService = inject(MessageService);
  private readonly confirmService = inject(ConfirmService);
  protected orders: Order[] = [];
  private readonly subscriptions: Subscription[] = [];
  protected visible = false;
  protected filteredOrders: Order[] = [];
  protected selectedState: string[] = [OrderStatus.IN_PROGRESS, OrderStatus.PAID];
  protected selectedCountry: string | null = null;
  protected countries: { label: string, value: string }[] = [];
  protected filterActive = false;
  protected selectedOrder: Order | null = null;
  protected orderStatus: OrderStatus[] = Object.values(OrderStatus);

  constructor() {
    this.subscriptions.push(this.orderService.getOrders().subscribe((orders) => {
      this.orders = orders;
      this.filteredOrders = orders;
      this.updateCountries();
      this.filterOrders();
    }));
    this.pollingOrders();
  }

  private updateCountries() {
    if (this.selectedState.length) {
      const countriesForState = new Set(
        this.orders
          .filter(order => this.selectedState.includes(order.state))
          .map(order => order.country)
      );
      this.countries = Array.from(countriesForState).map(country => ({ label: country, value: country }));
    } else {
      const allCountries = new Set(this.orders.map(order => order.country));
      this.countries = Array.from(allCountries).map(country => ({ label: country, value: country }));
    }
  }

  protected showOrderDetails(order: Order) {
    this.visible = !this.visible;
    this.selectedOrder = order;
  }

  protected confirmUpdate(order: Order) {
    this.confirmService.openConfirm({
      message: 'Are you certain to update order #00' + order.id + "'s status ?",
      accept: () => this.changeStatus(order)
    });
  }

  protected deleteConfirm(orderId: number) {
    this.confirmService.openConfirm({
      message: 'Are you certain to delete order #00' + orderId + ' ?',
      accept: () => this.deleteOrder(orderId)
    });
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
    this.subscriptions.push(this.orderService.updateOrderStatus(order.id, order.state).subscribe(
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

  protected toggleFilter() {
    this.filterActive = !this.filterActive;
    if (!this.filterActive) {
      this.filteredOrders = this.orders;
    }
  }

  protected filterOrders() {
    this.filteredOrders = this.orders.filter(order => {
      return (
        (!this.selectedState.length || this.selectedState.includes(order.state)) &&
        (!this.selectedCountry || order.country === this.selectedCountry)
      );
    });
  }

  private pollingOrders() {
    this.pollingService.startPolling();
    this.subscriptions.push(this.pollingService.getOrders().subscribe((orders) => {
      this.orders = orders;
      this.updateCountries();
      this.filterOrders();
    }));
  }

  protected resetFilter() {
    this.selectedState = [OrderStatus.IN_PROGRESS, OrderStatus.PAID];
    this.selectedCountry = null;

    this.updateCountries();
    this.filterOrders();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    this.pollingService.stopPolling();
  }
}
