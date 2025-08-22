import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgClass, DecimalPipe } from '@angular/common';
import {
  BillService,
  BillCreateDto,
  BillDto,
  BillPaymentDto,
} from '../../core/services/bill.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-bills',
  standalone: true,
  imports: [CommonModule, NgClass, DecimalPipe, FormsModule],
  templateUrl: './bills.component.html',
  styleUrls: ['./bills.component.css'],
})
export class BillsComponent implements OnInit {
  bills: BillDto[] = [];
  loading = false;
  error: string | null = null;
  newBillId?: number;
  lastErrorCode?: string;
  showPayFormFor?: number;
  payModel: Partial<BillPaymentDto> = {};
  currentUser: any;

  constructor(
    private billService: BillService,
    private router: Router,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getUser();
    const navState: any = history.state;
    if (navState) {
      if (navState.newBillId) this.newBillId = navState.newBillId;
      if (navState.createdBill) {
        const incoming: BillDto = navState.createdBill;
        if (!this.bills.some((b) => b.id === incoming.id)) {
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
        this.bills = this.filterForUser(data);
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error(err);
        this.error = err?.error?.error || 'Failed to load bills';
        this.lastErrorCode = err?.error?.code;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  private filterForUser(all: BillDto[]): BillDto[] {
    // Only narrow for customers. Admin & other roles see full list (admin still needs server-enforced auth!)
    if (this.currentUser?.role === 'Customer' && this.currentUser?.id != null) {
      return all.filter((b) => b.userId === this.currentUser.id);
    }
    return all;
  }

  // Retry logic removed: server now returns hydrated bill in create response and list fetch is immediate.

  payBill(bill: BillDto) {
    // Debug log actual status value coming from backend
    console.log('Pay clicked. Raw status value:', bill.status);
    if (!this.isPending(bill)) {
      return;
    }
    this.showPayFormFor = bill.id;
    this.payModel = { customerName: '', addressLine1: '', city: '', country: '', phone: '' };
  }

  deleteBill(bill: BillDto) {
    if (bill.status === 'Paid') return; // business rule example
    this.billService.deleteBill(bill.id).subscribe({
      next: () => this.loadBills(),
      error: (err) => console.error(err),
    });
  }

  submitPayment(bill: BillDto) {
    if (
      !this.payModel.customerName ||
      !this.payModel.addressLine1 ||
      !this.payModel.city ||
      !this.payModel.country ||
      !this.payModel.phone
    ) {
      this.error = 'All payment fields required';
      return;
    }
    this.billService.payBillWithDetails(bill.id, this.payModel as BillPaymentDto).subscribe({
      next: (updated) => {
        this.bills = this.bills.map((b) => (b.id === updated.id ? updated : b));
        this.showPayFormFor = undefined;
        this.router.navigate(['/order-confirmation'], {
          state: { billId: updated.id, paymentReference: updated.paymentReference },
        });
      },
      error: (err) => {
        console.error(err);
        this.error = err?.error?.error || 'Payment failed';
        this.lastErrorCode = err?.error?.code;
      },
    });
  }

  private normalizeStatus(status: any): string {
    if (status === 0 || status === '0') return 'Pending';
    if (status === 1 || status === '1') return 'Paid';
    if (status === 2 || status === '2') return 'Canceled';
    if (typeof status === 'string') {
      const s = status.toLowerCase();
      if (s === 'pending') return 'Pending';
      if (s === 'paid') return 'Paid';
      if (s === 'canceled' || s === 'cancelled') return 'Canceled';
    }
    return 'Pending';
  }

  isPending(bill: BillDto): boolean {
    return this.normalizeStatus(bill.status) === 'Pending';
  }
  isPaid(bill: BillDto): boolean {
    return this.normalizeStatus(bill.status) === 'Paid';
  }
  isCanceled(bill: BillDto): boolean {
    return this.normalizeStatus(bill.status) === 'Canceled';
  }
}
