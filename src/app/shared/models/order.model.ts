import {Product} from './product.model';

export interface Order {
  id: number;
  firstname: string;
  lastname: string;
  address: string;
  date: Date;
  createdAt: string;
  totalPrice: number;
  state: 'paid' | 'in progress' | 'pending' | 'cancelled' | 'delivered';
  product: Product[];
}
