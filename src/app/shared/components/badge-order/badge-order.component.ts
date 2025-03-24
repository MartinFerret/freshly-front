import {Component, Input} from '@angular/core';
import {TitleCasePipe} from '@angular/common';
import {Order} from '../../models/order.model';
@Component({
  selector: 'app-badge-order',
  imports: [
    TitleCasePipe
  ],
  templateUrl: './badge-order.component.html',
  styleUrl: './badge-order.component.scss',
  standalone: true
})
export class BadgeOrderComponent {
  @Input() order: Order | null = null;
}
