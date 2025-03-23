import {Component, Input} from '@angular/core';
import {CurrencyPipe, DatePipe, TitleCasePipe} from "@angular/common";
import {Dialog} from "primeng/dialog";
import {Divider} from "primeng/divider";
import {Order} from '../../models/order.model';

@Component({
  selector: 'app-order-dialog',
    imports: [
        CurrencyPipe,
        DatePipe,
        Dialog,
        Divider,
        TitleCasePipe
    ],
  templateUrl: './order-dialog.component.html',
  standalone: true,
  styleUrl: './order-dialog.component.scss'
})
export class OrderDialogComponent {
  @Input() order: Order | null = null;
  @Input() visible = false;
}
