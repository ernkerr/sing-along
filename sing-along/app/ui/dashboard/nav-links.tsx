// usePathname() is a hook, so this file (nav-links.tsx) needs to be turned into a client component
// add react's "use client" to the top of the file
"use client";

import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: "Home", href: "/dashboard", icon: HomeIcon },
  {
    name: "Invoices",
    href: "/dashboard/invoices",
    icon: DocumentDuplicateIcon,
  },
  { name: "Customers", href: "/dashboard/customers", icon: UserGroupIcon },
];

export default function NavLinks() {
  const pathname = usePathname();
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              "flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3",
              {
                "bg-sky-100 text-blue-600": pathname === link.href,
              }
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}

// Navigation
// <a> HTML element is traditionally used but there's a full page refresh on each page nav
//
// to optimize we can use next/link & the <Link /> component
// < Link /> component allows you to do client-side navigation with JS
// it allows us to nav between pages without a full refresh
//
// to improve nav, Next.js automatically code splits your application by route segments
// different from a traditional React SPA, where the browser loads all your application code on initial load
// Furthermore, in production, whenever <Link> components appear in the browser's viewport, Next.js automatically prefetches the code for the linked route in the background. By the time the user clicks the link, the code for the destination page will already be loaded in the background, and this is what makes the page transition near-instant!

// Pattern: Showing active links
// it is common to show an active link to indicate what page the user is on
// to do this, we need to get the user's current path from the URL
// Next.js hook provides a hook called usePathname() to check the path and implement this pattern

// usePathname() is a hook, so this file (nav-links.tsx) needs to be turned into a client component
// add react's "use client" to the top of the file
