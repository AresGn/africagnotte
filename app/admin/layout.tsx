import SimpleAdminLayout from '../../components/admin/SimpleAdminLayout';

export const metadata = {
  title: 'Administration - AfriCagnotte',
  description: 'Dashboard d\'administration pour la modération des cagnottes',
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SimpleAdminLayout>{children}</SimpleAdminLayout>;
}
