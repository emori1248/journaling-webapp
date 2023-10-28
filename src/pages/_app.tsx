import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";
import "../styles/globals.css"
import { ClerkProvider } from "@clerk/nextjs";

const queryClient = new QueryClient();
export default function App({ Component, pageProps }: AppProps) {
    return (
      <ClerkProvider>
        <QueryClientProvider client={queryClient}>
            <Component {...pageProps} />
        </QueryClientProvider>
      </ClerkProvider>
    );
}
