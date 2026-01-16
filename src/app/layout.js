import { StoreProvider } from "@/store/storeProvider";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className="bg-slate-50 min-h-screen">
        <StoreProvider>
          <Sidebar />
          <main className="transition-all duration-300 p-4 md:p-8 ml-0 md:ml-64">
          {children}
          </main>
        </StoreProvider>
      </body>
    </html>
  );
}
