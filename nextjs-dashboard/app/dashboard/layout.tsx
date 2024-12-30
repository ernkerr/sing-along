// any components we import into this file will be part of the layout
import SideNav from "@/app/ui/dashboard/sidenav";

// the layout component recieves a children prop (this child can either be a page or another layout)
// in our case here, all of the pages inside /dashboard will be nested inside this layout
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
    </div>
  );
}

// root layouts are required
// they share UI across multiple pages
// one benefit of using layouts on Next.js is partial rendering:
// only the page components update while the layout won't re-render
