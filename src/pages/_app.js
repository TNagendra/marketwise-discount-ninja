// import "@/styles/globals.css";
// import { ThemeProvider } from "@/components/ThemeProvider";
// import Layout from "@/components/Layout";

// export default function App({ Component, pageProps }) {
//   return (
//     <ThemeProvider
//       attribute="class"
//       defaultTheme="system"
//       enableSystem
//       disableTransitionOnChange
//     >
//       <Layout>
//         <Component {...pageProps} />
//       </Layout>
//     </ThemeProvider>
//   );
// }
import "@/styles/globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import Layout from "@/components/Layout";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <main className={inter.className}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </main>
    </ThemeProvider>
  );
}
