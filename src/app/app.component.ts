import {Component, inject, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {OrderListComponent} from './components/order-list/order-list.component';
import {Toast} from 'primeng/toast';
import {ConfirmationService, MessageService} from 'primeng/api';
import {ConfirmDialog} from 'primeng/confirmdialog';
import {ConfirmService} from './shared/services/confirm.service';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, OrderListComponent, Toast, ConfirmDialog],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [MessageService, ConfirmationService, ConfirmService, DatePipe]
})
export class AppComponent implements OnInit {
  protected currentDate: string  | null = '';
  private readonly datePipe = inject(DatePipe);

  ngOnInit(): void {
    this.updateDateTime();
  }

  protected updateDateTime() {
    setInterval(() => {
      const current = new Date();
      this.currentDate = this.datePipe.transform(current, 'dd/MM/yyyy HH:mm:ss');
    }, 1000);
  }
}
