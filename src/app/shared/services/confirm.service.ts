import {Injectable} from '@angular/core';
import {Confirmation, ConfirmationService} from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class ConfirmService {

  constructor(
    private readonly confirmationService: ConfirmationService,
  ) {}

  openConfirm(confirm: Confirmation): void {
    confirm.header ??= 'Are you certain ?';
    confirm.icon ??= 'pi pi-exclamation-triangle';
    confirm.blockScroll ??= false;
    confirm.acceptButtonStyleClass ??= 'p-button-text p-button p-component';
    confirm.defaultFocus ??= 'reject';
    this.confirmationService.confirm(confirm);
  }
}
