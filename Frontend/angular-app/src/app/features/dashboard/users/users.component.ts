import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface User {
  userId: string;
  firstName: string;
  email: string;
  role: string;
  phone?: string;
  experience?: number;
  createdAt?: string;
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  filtered: User[] = [];
  loading = false;
  search = '';
  filterRole = 'ALL';

  roles = ['ALL', 'ADMIN', 'TRAINER', 'LEARNER', 'RH_SMARTEK', 'RH_COMPANY'];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.http.get<User[]>('http://localhost:8081/api/auth/users').subscribe({
      next: (data) => {
        this.users = data;
        this.applyFilter();
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  applyFilter(): void {
    this.filtered = this.users.filter(u => {
      const matchRole = this.filterRole === 'ALL' || u.role === this.filterRole;
      const matchSearch = !this.search ||
        u.firstName.toLowerCase().includes(this.search.toLowerCase()) ||
        u.email.toLowerCase().includes(this.search.toLowerCase());
      return matchRole && matchSearch;
    });
  }

  deleteUser(userId: string): void {
    if (!confirm('Supprimer cet utilisateur ?')) return;
    this.http.delete(`http://localhost:8081/api/auth/users/${userId}`).subscribe({
      next: () => this.loadUsers()
    });
  }

  getRoleClass(role: string): string {
    const map: Record<string, string> = {
      'ADMIN': 'bg-red-100 text-red-700',
      'TRAINER': 'bg-blue-100 text-blue-700',
      'LEARNER': 'bg-green-100 text-green-700',
      'RH_SMARTEK': 'bg-purple-100 text-purple-700',
      'RH_COMPANY': 'bg-yellow-100 text-yellow-700'
    };
    return map[role] || 'bg-gray-100 text-gray-600';
  }

  getInitial(name: string): string {
    return name?.charAt(0).toUpperCase() || '?';
  }
}
