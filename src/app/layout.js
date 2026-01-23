import { StoreProvider } from "@/store/storeProvider";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className="bg-slate-50 min-h-screen antialiased">
        <StoreProvider>
          <Sidebar />
          {/* On ajuste le margin-left pour correspondre à la nouvelle largeur sidebar */}
          <main className="p-4 md:p-6 ml-0 md:ml-56">
            <div className="max-w-[1600px] mx-auto"> 
              {children}
            </div>
          </main>
        </StoreProvider>
      </body>
    </html>
  );
}
