import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Order} from '../../models/order.model';
import {environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

 private readonly httpClient = inject(HttpClient);

 public getOrders(): Observable<Order[]> {
   return this.httpClient.get<Order[]>(`${environment.apiURL}/orders`);
  }

  updateOrderStatus(orderId: number, newState: string): Observable<Order> {
    return this.httpClient.put<Order>(`${environment.apiURL}/orders/${orderId}/status`, { state: newState });
  }
}
