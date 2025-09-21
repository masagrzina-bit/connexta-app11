import './globals.css';
import Navbar from '../components/Navbar';

export const metadata = {
  title: 'Connexta',
  description: 'Connect with friends and the world around you',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
