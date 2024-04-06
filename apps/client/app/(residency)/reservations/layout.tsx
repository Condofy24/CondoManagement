import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/app/components/page-header";
import { Separator } from "@/app/components/ui/separator";
import { ReactNode } from "react";

type ReservationsLayoutProps = {
  children: ReactNode;
};

export default function ReservationsLayout({
  children,
}: ReservationsLayoutProps) {
  return (
    <div className="flex flex-col md:flex-row md:h-[calc(100vh_-_3.75rem)] w-screen">
      <PageHeader className="basis-1/3 mx-1">
        <PageHeaderHeading className="mb-6">
          Facility Reservation
        </PageHeaderHeading>
        <div className="py-4 text-justify text-wrap grow mx-8 text-xl font-normal">
          Welcome to our Facility Reservation Platform! Quickly find and book
          the amenities in your property with ease. Check availability and
          secure your spot in just a few clicks, ensuring a hassle-free
          experience as you enjoy all your property has to offer.{" "}
        </div>
      </PageHeader>

      <Separator orientation="vertical" className="w-[0.35rem]" />
      {children}
    </div>
  );
}
