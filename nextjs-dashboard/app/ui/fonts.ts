import { Inter, Lusitana } from "next/font/google";
// Import the Inter font from the next/font/google module - this will be your primary font.
// Then, specify what subset you'd like to load. In this case, 'latin':

export const inter = Inter({ subsets: ["latin"] });

export const lusitana = Lusitana({
  subsets: ["latin"],
  weight: ["400", "700"],
});

// Next.js automatically optimizes fonts in the application when you use the next/font module
// Next.js downloads font files at build time and hosts them with your other static assets. This means when a user visits your application, there are no additional network requests for fonts which would impact performance.
