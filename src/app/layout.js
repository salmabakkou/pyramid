import "./globals.css";
import Sidebar from "@/components/Sidebar";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex bg-slate-50">
        <Sidebar />
        <main className="flex-1 ml-64 p-8">
        {children}
        </main>
      </body>
    </html>
  );
}
