"use client";
import { fetchUnitPayments } from "@/actions/resident-actions";
import { Button } from "@/app/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/app/components/ui/sheet";
import { useAppSelector } from "@/redux/store";
import { Payment, Unit } from "@/types";
import { useEffect, useState } from "react";
import { MonthInput, MonthPicker } from "react-lite-month-picker";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/app/components/table/data-table";
import { FinanceReportPDFDocument } from "./finance-report-pdf-generator";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";

export const paymentColumns: ColumnDef<Payment>[] = [
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      return <span>{new Date(row.original.date).toLocaleString()}</span>;
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      return (
        <span>
          {row.original.amount.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })}
        </span>
      );
    },
  },
];

type PaymentHistoryProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  property: Unit;
};

export default function PaymentHistory({
  open,
  setOpen,
  property,
}: PaymentHistoryProps) {
  const { token } = useAppSelector((state) => state.auth.value);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [monthlyPayments, setMonthlyPayments] = useState<Payment[]>([]);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState({
    month: 2,
    year: 2024,
  });

  useEffect(() => {
    async function fetchPayments() {
      const payments = await fetchUnitPayments(property.id, token as string);

      if (payments) setPayments(payments);
    }

    fetchPayments();
  }, [property]);

  useEffect(() => {
    const filteredPayments = payments.filter((p: Payment) => {
      const date: Date = new Date(p.date);
      return (
        date.getMonth() == selectedMonth.month &&
        date.getFullYear() == selectedMonth.year
      );
    });
    setMonthlyPayments(filteredPayments);
  }, [selectedMonth, payments]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="w-[350px] md:w-[700px] flex flex-col">
        <SheetHeader>
          <SheetTitle>Payment History</SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>
        <div className="flex items-center mt-4 z-10">
          <div>
            <MonthInput
              selected={selectedMonth}
              setShowMonthPicker={setIsPickerOpen}
              showMonthPicker={isPickerOpen}
              size="small"
            />
            {isPickerOpen ? (
              <MonthPicker
                setIsOpen={setIsPickerOpen}
                selected={selectedMonth}
                onChange={setSelectedMonth}
                size="small"
              />
            ) : null}
          </div>
        </div>
        <div>
          {monthlyPayments.length === 0 && (
            <div className="text-center font-bold text-2xl">
              No payment record found for the selected month
            </div>
          )}

          {monthlyPayments.length !== 0 && (
            <div className="flex flex-col gap-3 ">
              <DataTable
                columns={paymentColumns}
                data={monthlyPayments}
                showRowsPerPage={false}
              />
            </div>
          )}
        </div>
        <SheetFooter>
          {monthlyPayments.length !== 0 && (
            <Button size="sm" className="px-3">
              <PDFDownloadLink
                document={
                  <FinanceReportPDFDocument
                    property={property}
                    payments={payments}
                  />
                }
                fileName="payments-report.pdf"
              >
                {({ loading }) =>
                  loading ? "Generating report..." : "Generate PDF Report"
                }
              </PDFDownloadLink>
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
