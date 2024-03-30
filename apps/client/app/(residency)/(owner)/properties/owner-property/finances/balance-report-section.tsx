import { Unit } from "@/types";
import { BalanceProgress } from "./balance-progress";
import { Button } from "@/app/components/ui/button";
import { useState } from "react";
import PaymentHistory from "./payment-history";

type BalanceReportProps = {
  property: Unit;
};

export default function BalanceReport({ property }: BalanceReportProps) {
  const monthlyBalanceProgress =
    property.remainingMonthlyBalance == 0
      ? 100
      : ((property.totalMonthlyFees -
          (property.remainingMonthlyBalance as number)) /
          property.totalMonthlyFees) *
        100;

  const [openPayments, setOpenPayments] = useState(false);

  return (
    <div className="flex gap-4 flex-col flex-nowrap">
      <div className="flex gap-2 justify-between items-center">
        <span className="w-[10rem]">Monthly Fees</span>
        <span>
          {property.totalMonthlyFees.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })}
        </span>
      </div>
      <div className="flex flex-1 gap-2 items-center">
        <span className="w-[10rem]">Remaining Balance</span>
        <BalanceProgress className="h-10" value={monthlyBalanceProgress}>
          {(property.remainingMonthlyBalance as number).toLocaleString(
            "en-US",
            {
              style: "currency",
              currency: "USD",
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            },
          )}
        </BalanceProgress>
      </div>

      {property.overdueFees != 0 && (
        <div className="flex gap-2 justify-between items-center">
          <span className="w-[10rem]">Overdue</span>
          <span>{property.overdueFees}</span>
        </div>
      )}

      <Button variant="outline" onClick={() => setOpenPayments(true)}>
        Payment History
      </Button>
      <PaymentHistory
        open={openPayments}
        setOpen={setOpenPayments}
        property={property}
      />
    </div>
  );
}
