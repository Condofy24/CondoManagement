import { Unit } from "@/types";
import { BalanceProgress } from "./balance-progress";

type BalanceReportProps = {
  property: Unit;
};

export default function BalanceReport({ property }: BalanceReportProps) {
  const monthlyBalanceProgress =
    property.remainingMonthlyBalance == 0
      ? 0
      : ((property.totalMonthlyFees -
          (property.remainingMonthlyBalance as number)) /
          property.totalMonthlyFees) *
        100;

  return (
    <div className="flex gap-2 items-center flex-nowrap">
      Balance Report
      <BalanceProgress
        className="h-8 bg-green-400"
        value={monthlyBalanceProgress}
      >
        {(property.remainingMonthlyBalance as number).toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        })}
      </BalanceProgress>
    </div>
  );
}
