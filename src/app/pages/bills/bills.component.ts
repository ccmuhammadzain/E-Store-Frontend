import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgClass, DecimalPipe } from '@angular/common';
import { BillService, BillCreateDto, BillDto, BillPaymentDto } from '../../core/services/bill.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bills',
  standalone: true,
  imports: [CommonModule, NgClass, DecimalPipe, FormsModule],
  templateUrl: './bills.component.html',
  styleUrls: ['./bills.component.css']
})
export class BillsComponent implements OnInit {
  bills: BillDto[] = [];
  loading = false;
  error: string | null = null;
  newBillId?: number;
  lastErrorCode?: string;
  showPayFormFor?: number;
  payModel: Partial<BillPaymentDto> = {};

  constructor(private billService: BillService, private router: Router) {}

  ngOnInit(): void {
    const navState: any = history.state;
    if (navState) {
      if (navState.newBillId) this.newBillId = navState.newBillId;
      if (navState.createdBill) {
        const incoming: BillDto = navState.createdBill;
        if (!this.bills.some(b => b.id === incoming.id)) {
          this.bills.unshift(incoming);
        }
      }
    }
    this.loadBills();
  }

  loadBills() {
    this.loading = true;
    this.error = null;
    this.billService.getBills().subscribe({
      next: (data) => {
        this.bills = data;
      },
      error: (err) => {
        console.error(err);
    this.error = err?.error?.error || 'Failed to load bills';
    this.lastErrorCode = err?.error?.code;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  // Retry logic removed: server now returns hydrated bill in create response and list fetch is immediate.

  createSampleBill() {
    const newBill: BillCreateDto = {
      billItems: [
        { productId: 12, quantity: 2 },
        { productId: 13, quantity: 1 }
      ]
    };

    this.billService.createBill(newBill).subscribe({
      next: (bill) => {
        // Prepend freshly created bill without reloading entire list
        this.bills = [bill, ...this.bills];
      },
      error: (err) => {
        console.error(err);
        this.error = err?.error?.error || 'Failed to create bill';
        this.lastErrorCode = err?.error?.code;
      }
    });
  }

  payBill(bill: BillDto) {
  if (bill.status !== 'Pending') return;
  this.showPayFormFor = bill.id;
  this.payModel = { customerName: '', addressLine1: '', city: '', country: '', phone: '' };
  }

  deleteBill(bill: BillDto) {
    if (bill.status === 'Paid') return; // business rule example
    this.billService.deleteBill(bill.id).subscribe({
      next: () => this.loadBills(),
      error: (err) => console.error(err)
    });
  }

  submitPayment(bill: BillDto) {
    if (!this.payModel.customerName || !this.payModel.addressLine1 || !this.payModel.city || !this.payModel.country || !this.payModel.phone) {
      this.error = 'All payment fields required';
      return;
    }
    this.billService.payBillWithDetails(bill.id, this.payModel as BillPaymentDto).subscribe({
      next: updated => {
        this.bills = this.bills.map(b => b.id === updated.id ? updated : b);
        this.showPayFormFor = undefined;
        this.router.navigate(['/order-confirmation'], { state: { billId: updated.id, paymentReference: updated.paymentReference } });
      },
      error: err => {
        console.error(err);
        this.error = err?.error?.error || 'Payment failed';
        this.lastErrorCode = err?.error?.code;
      }
    });
  }
}
