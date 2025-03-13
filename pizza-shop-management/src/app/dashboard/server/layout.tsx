import DashboardLayout from '@/components/layout/dashboard-layout';

export default function ServerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}