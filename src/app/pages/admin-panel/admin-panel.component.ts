import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService, AdminUserDto, SellerOrderMetricDto } from '../../core/services/admin.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-panel.component.html',
  styles: [`:host{display:block;}`]
})
export class AdminPanelComponent implements OnInit {
  loading = signal(true);
  search = signal('');
  admins = signal<(AdminUserDto & { metrics?: any })[]>([]);
  expanded = signal<Set<number>>(new Set());
  metricsMissing = signal(false);

  // Aggregates
  hasMetrics = computed(() => this.admins().some(a => !!a.metrics));
  aggregate = computed(() => {
    const base = { totalOrders:0, paidOrders:0, pendingOrders:0, canceledOrders:0, totalRevenue:0, pendingRevenue:0 };
    this.admins().forEach(a => {
      if (a.metrics) {
        base.totalOrders += a.metrics.totalOrders || 0;
        base.paidOrders += a.metrics.paidOrders || 0;
        base.pendingOrders += a.metrics.pendingOrders || 0;
        base.canceledOrders += a.metrics.canceledOrders || 0;
        base.totalRevenue += a.metrics.totalRevenue || 0;
        base.pendingRevenue += a.metrics.pendingRevenue || 0;
      }
    });
    return base;
  });

  constructor(
    private adminService: AdminService,
    private auth: AuthService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  canView(): boolean { return this.auth.isSuperAdmin(); }

  load() {
    this.loading.set(true);
    this.adminService.getAdminsWithMetricsSafe().subscribe({
      next: res => {
        let items = res.items;
        if (res.metrics404) {
          // Provide zeroed placeholder metrics so UI can still show structure
            items = items.map(a => ({
              ...a,
              metrics: {
                sellerId: a.id,
                totalOrders: 0,
                paidOrders: 0,
                pendingOrders: 0,
                canceledOrders: 0,
                totalRevenue: 0,
                pendingRevenue: 0,
                lastPaidAt: null
              } as SellerOrderMetricDto
            }));
          this.metricsMissing.set(true);
        } else {
          this.metricsMissing.set(false);
        }
        this.admins.set(items);
        if (res.admins404) this.toast.warning('Admins endpoint (GET /api/Users/admins) not implemented yet');
        if (res.metrics404) this.toast.warning('Metrics endpoint (GET /api/Admins/metrics) not implemented yet');
        this.loading.set(false);
      },
      error: err => {
        this.toast.error('Failed loading admin data');
        this.loading.set(false);
        console.error(err);
      }
    });
  }

  toggle(id: number) {
    const clone = new Set(this.expanded().values());
    clone.has(id) ? clone.delete(id) : clone.add(id);
    this.expanded.set(clone);
  }

  filtered = computed(() => {
    const term = this.search().trim().toLowerCase();
    if (!term) return this.admins();
    return this.admins().filter(a => [a.username, a.email, a.role].some(v => v?.toLowerCase().includes(term)));
  });

  // Placeholder actions
  deactivate(a: AdminUserDto) { this.toast.info('Deactivate not implemented'); }
  promote(a: AdminUserDto) { this.toast.info('Promote not implemented'); }
  resetPassword(a: AdminUserDto) { this.toast.info('Reset password not implemented'); }
}
