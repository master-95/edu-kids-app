import './globals.css';

export const metadata = {
  title: 'EduKids - Lectoescritura y Matemáticas Preescolar',
  description: 'Aplicación educativa interactiva para trazo, caligrafía, conteo y fonética.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}