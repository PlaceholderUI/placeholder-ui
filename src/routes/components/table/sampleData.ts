import type { Column } from '$lib/ui/Table.svelte';

// User data types and samples
export interface User {
	id: number;
	name: string;
	email: string;
	role: string;
	status: 'active' | 'inactive' | 'pending';
	joinDate: string;
	department: string;
}

export const sampleUsers: User[] = [
	{
		id: 1,
		name: 'John Doe',
		email: 'john@example.com',
		role: 'Admin',
		status: 'active',
		joinDate: '2024-01-15',
		department: 'Engineering'
	},
	{
		id: 2,
		name: 'Jane Smith',
		email: 'jane@example.com',
		role: 'User',
		status: 'active',
		joinDate: '2024-02-20',
		department: 'Marketing'
	},
	{
		id: 3,
		name: 'Bob Johnson',
		email: 'bob@example.com',
		role: 'Manager',
		status: 'inactive',
		joinDate: '2023-11-10',
		department: 'Sales'
	},
	{
		id: 4,
		name: 'Alice Brown',
		email: 'alice@example.com',
		role: 'User',
		status: 'pending',
		joinDate: '2024-03-05',
		department: 'HR'
	},
	{
		id: 5,
		name: 'Charlie Wilson',
		email: 'charlie@example.com',
		role: 'Admin',
		status: 'active',
		joinDate: '2023-09-15',
		department: 'Engineering'
	},
	{
		id: 6,
		name: 'Diana Martinez',
		email: 'diana@example.com',
		role: 'User',
		status: 'active',
		joinDate: '2024-01-22',
		department: 'Marketing'
	},
	{
		id: 7,
		name: 'Edward Lee',
		email: 'edward@example.com',
		role: 'Manager',
		status: 'active',
		joinDate: '2023-10-30',
		department: 'Engineering'
	},
	{
		id: 8,
		name: 'Fiona Taylor',
		email: 'fiona@example.com',
		role: 'User',
		status: 'inactive',
		joinDate: '2024-02-14',
		department: 'Sales'
	},
	{
		id: 9,
		name: 'George Harris',
		email: 'george@example.com',
		role: 'Admin',
		status: 'active',
		joinDate: '2023-08-20',
		department: 'IT'
	},
	{
		id: 10,
		name: 'Helen Clark',
		email: 'helen@example.com',
		role: 'User',
		status: 'pending',
		joinDate: '2024-03-10',
		department: 'HR'
	}
];

// Larger generated dataset for the pagination demo
const firstNames = ['Olivia', 'Liam', 'Emma', 'Noah', 'Ava', 'Ethan', 'Sophia', 'Mason', 'Isabella', 'Lucas', 'Mia', 'Oliver', 'Amelia', 'Elijah', 'Harper', 'James', 'Evelyn', 'Benjamin', 'Abigail', 'Henry'];
const lastNames = ['Anderson', 'Baker', 'Carter', 'Dixon', 'Ellis', 'Foster', 'Griffin', 'Hayes', 'Ingram', 'Jenkins', 'Keller', 'Lawson', 'Mitchell', 'Norris', 'Owens', 'Parker', 'Quinn', 'Reyes', 'Sutton', 'Turner'];
const roles = ['Admin', 'User', 'Manager'];
const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'IT'];
const statuses: User['status'][] = ['active', 'inactive', 'pending'];

export const manyUsers: User[] = Array.from({ length: 57 }, (_, i) => {
	const first = firstNames[i % firstNames.length];
	const last = lastNames[Math.floor(i / 3) % lastNames.length];
	return {
		id: i + 1,
		name: `${first} ${last}`,
		email: `${first.toLowerCase()}.${last.toLowerCase()}${i + 1}@example.com`,
		role: roles[i % roles.length],
		status: statuses[i % statuses.length],
		joinDate: `202${3 + (i % 2)}-${String((i % 12) + 1).padStart(2, '0')}-${String(((i * 3) % 28) + 1).padStart(2, '0')}`,
		department: departments[i % departments.length]
	};
});

// Column definitions for users
export const basicColumns: Column<User>[] = [
	{ key: 'id', label: 'ID', sortable: true, width: '80px' },
	{ key: 'name', label: 'Name', sortable: true },
	{ key: 'email', label: 'Email', sortable: true },
	{ key: 'role', label: 'Role', sortable: true },
	{ key: 'department', label: 'Department', sortable: true }
];

export const customColumns: Column<User>[] = [
	{ key: 'id', label: 'ID', sortable: true, width: '80px', align: 'center' },
	{ key: 'name', label: 'Name', sortable: true },
	{ key: 'email', label: 'Email', sortable: true },
	{
		key: 'status',
		label: 'Status',
		sortable: true,
		render: (value: string) => {
			const variants = {
				active: 'success',
				inactive: 'danger',
				pending: 'warning'
			};
			return `<span class="badge ${variants[value as keyof typeof variants]}">${value}</span>`;
		}
	},
	{
		key: 'joinDate',
		label: 'Join Date',
		sortable: true,
		render: (value: string) => new Date(value).toLocaleDateString()
	}
];

// Product data types and samples
export interface Product {
	id: number;
	name: string;
	category: string;
	price: number;
	stock: number;
	rating: number;
}

export const products: Product[] = [
	{ id: 1, name: 'Laptop Pro', category: 'Electronics', price: 1299.99, stock: 15, rating: 4.5 },
	{
		id: 2,
		name: 'Wireless Mouse',
		category: 'Accessories',
		price: 29.99,
		stock: 50,
		rating: 4.2
	},
	{ id: 3, name: 'USB-C Hub', category: 'Accessories', price: 49.99, stock: 30, rating: 4.7 },
	{ id: 4, name: 'Monitor 4K', category: 'Electronics', price: 599.99, stock: 8, rating: 4.8 },
	{
		id: 5,
		name: 'Keyboard Mechanical',
		category: 'Accessories',
		price: 149.99,
		stock: 25,
		rating: 4.6
	},
	{ id: 6, name: 'Webcam HD', category: 'Electronics', price: 79.99, stock: 40, rating: 4.1 },
	{ id: 7, name: 'Desk Lamp', category: 'Office', price: 39.99, stock: 60, rating: 4.3 },
	{ id: 8, name: 'Chair Ergonomic', category: 'Office', price: 399.99, stock: 12, rating: 4.9 }
];

export const productColumns: Column<Product>[] = [
	{ key: 'id', label: '#', sortable: true, width: '60px', align: 'center' },
	{ key: 'name', label: 'Product Name', sortable: true },
	{ key: 'category', label: 'Category', sortable: true },
	{
		key: 'price',
		label: 'Price',
		sortable: true,
		align: 'right',
		render: (value: number) => `$${value.toFixed(2)}`
	},
	{
		key: 'stock',
		label: 'Stock',
		sortable: true,
		align: 'center',
		render: (value: number) => {
			const color = value < 10 ? 'red' : value < 30 ? 'orange' : 'green';
			return `<span style="color: ${color}; font-weight: bold;">${value}</span>`;
		}
	},
	{
		key: 'rating',
		label: 'Rating',
		sortable: true,
		align: 'center',
		render: (value: number) => `⭐ ${value}`
	}
];