import { Metadata } from "next";
import { AppShell } from "@/components/AppShell";
import { BagClient } from "@/components/BagClient";

export const metadata: Metadata = {
  title: "Shopping Bag",
  description: "View the items in your shopping bag and proceed to checkout.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function BagPage() {
  return (
    <AppShell>
      <BagClient />
    </AppShell>
  );
}
