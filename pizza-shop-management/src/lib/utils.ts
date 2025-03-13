import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function generateOrderNumber(): string {
  const timestamp = new Date().getTime().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `ORD-${timestamp}-${random}`;
}

export function calculateTax(subtotal: number, taxRate: number = 0.0825): number {
  return subtotal * taxRate;
}

export function calculateTotal(subtotal: number, tax: number, tip: number = 0): number {
  return subtotal + tax + tip;
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function getTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + ' years ago';

  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + ' months ago';

  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + ' days ago';

  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + ' hours ago';

  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + ' minutes ago';

  return Math.floor(seconds) + ' seconds ago';
}

export function generateQRCode(tableNumber: number): string {
  // This is a placeholder - in a real app, you would use a QR code generation library
  return `https://example.com/order?table=${tableNumber}`;
}

export function estimatePrepTime(orderItems: any[]): number {
  // Basic algorithm to estimate preparation time in minutes
  // In a real app, this would be more sophisticated
  const baseTime = 10; // Base time for any order
  const itemCount = orderItems.reduce((total, item) => total + item.quantity, 0);
  const complexityFactor = orderItems.some(item => item.customization) ? 1.5 : 1;

  return Math.ceil(baseTime + (itemCount * 2) * complexityFactor);
}