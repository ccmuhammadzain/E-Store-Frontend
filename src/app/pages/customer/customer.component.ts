import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BillService, BillDto } from '../../core/services/bill.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css'],
})
export class CustomerComponent implements OnInit {
  loading = false;
  error: string | null = null;
  bills: BillDto[] = [];
  customers: Array<{
    userId: number;
    username?: string;
    customerName?: string;
    phone?: string;
    city?: string;
    country?: string;
    addressLine1?: string;
    bills: BillDto[];
    totalSpent: number;
    paidCount: number;
    pendingCount: number;
    canceledCount: number;
  }> = [];
  selectedUserId?: number;
  search = '';

  constructor(private billService: BillService) {}

  ngOnInit(): void {
    this.fetch();
  }

  fetch() {
    this.loading = true;
    this.billService.getBills().subscribe({
      next: (data) => {
        this.bills = data;
        this.buildCustomers();
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.error || 'Failed to load customer bills';
        this.loading = false;
      },
    });
  }

  normalizeStatus(status: any): string {
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

  statusClass(b: BillDto) {
    const s = this.normalizeStatus(b.status);
    if (s === 'Paid') return 'bg-green-100 text-green-700';
    if (s === 'Canceled') return 'bg-red-100 text-red-700';
    return 'bg-yellow-100 text-yellow-700';
  }

  private buildCustomers() {
    const map = new Map<number, BillDto[]>();
    for (const b of this.bills) {
      if (!map.has(b.userId)) map.set(b.userId, []);
      map.get(b.userId)!.push(b);
    }
    this.customers = Array.from(map.entries())
      .map(([userId, bills]) => {
        const firstPaidOrAny = bills.find((b) => b.customerName) || bills[0];
        const paidBills = bills.filter((b) => this.normalizeStatus(b.status) === 'Paid');
        const pendingBills = bills.filter((b) => this.normalizeStatus(b.status) === 'Pending');
        const canceledBills = bills.filter((b) => this.normalizeStatus(b.status) === 'Canceled');
        return {
          userId,
          username: firstPaidOrAny?.user?.username,
          customerName: firstPaidOrAny?.customerName,
          phone: firstPaidOrAny?.phone,
          city: firstPaidOrAny?.city,
          country: firstPaidOrAny?.country,
          addressLine1: firstPaidOrAny?.addressLine1,
          bills: bills.slice().sort((a, b) => b.id - a.id),
          totalSpent: paidBills.reduce((sum, b) => sum + (b.totalAmount || 0), 0),
          paidCount: paidBills.length,
          pendingCount: pendingBills.length,
          canceledCount: canceledBills.length,
        };
      })
      .sort((a, b) => b.totalSpent - a.totalSpent);
  }

  get filteredCustomers() {
    const term = this.search.trim().toLowerCase();
    if (!term) return this.customers;
    return this.customers.filter((c) =>
      `${c.username || ''} ${c.customerName || ''} ${c.phone || ''} ${c.city || ''} ${c.country || ''}`
        .toLowerCase()
        .includes(term)
    );
  }

  selectCustomer(c: any) {
    this.selectedUserId = this.selectedUserId === c.userId ? undefined : c.userId;
  }
}
