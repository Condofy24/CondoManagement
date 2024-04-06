"use client";
import { Button } from "@/app/components/ui/button";
import Link from "next/link";

export default function OwnerPropertiesDashboardPage() {
  return (
    <div className="flex flex-1 flex-col p-4 space-y-8 md:p-10">
      <div className="flex items-center justify-end space-y-2">
        <Button variant="outline">
          <Link href="/reservations/new">Make New Reservation</Link>
        </Button>
      </div>
      <div className="flex flex-row flex-wrap gap-4 justify-center md:justify-start">
        <h1>No Reservations found</h1>
      </div>
    </div>
  );
}
