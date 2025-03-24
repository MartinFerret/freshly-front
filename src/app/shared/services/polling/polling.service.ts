import {inject, Injectable} from '@angular/core';
import {BehaviorSubject, interval, Observable} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {Order} from '../../models/order.model';
import {OrderService} from '../order/order.service';

@Injectable({
  providedIn: 'root'
})
export class PollingService {
  private readonly pollingInterval = 1000;
  private ordersSubject = new BehaviorSubject<Order[]>([]);
  private orderService = inject(OrderService);


  startPolling(): void {
    interval(this.pollingInterval)
      .pipe(
        switchMap(() => this.getAllOrders())
      )
      .subscribe((orders) => {
        this.ordersSubject.next(orders);
      });
  }

  stopPolling(): void {
    this.ordersSubject.complete();
  }

  getAllOrders(): Observable<Order[]> {
    return this.orderService.getOrders();
  }

  getOrders(): Observable<Order[]> {
    return this.ordersSubject.asObservable();
  }
}
