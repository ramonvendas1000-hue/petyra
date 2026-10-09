import './globals.css';

export const metadata = {
  title: 'Petyra Business',
  description: 'Gestão inteligente para negócios pet',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}
