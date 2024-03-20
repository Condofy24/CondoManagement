import { Button } from "@/app/components/ui/button";
import { cn } from "@/lib/utils";
import { Storage } from "@/types";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/app/components/ui/collapsible";
import { ChevronsDown, ChevronsUp } from "lucide-react";
import { SectionHeader } from "./section-header";
import { useState } from "react";
import { Card } from "@/app/components/ui/card";
import { Separator } from "@/app/components/ui/separator";

const StorageInfo = ({ storage }: { storage: Storage }) => (
  <div className="border-black p-1 flex flex-nowrap gap-4 ">
    <div className="basis-3/5">
      <div className="flex flex-row justify-between mx-1">
        <span className="text-muted-foreground">Number</span>
        <span className="font-bold">{storage.storageNumber}</span>
      </div>
      <div className="flex flex-row justify-between mx-1">
        <span className="text-muted-foreground">Fees</span>
        <span className="font-bold">
          {storage.fees.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })}
        </span>
      </div>
    </div>
    <div
      className={cn(
        "rounded-lg p-1 text-sm font-semibold flex flex-1 items-center justify-center",
        storage.isOccupiedByRenter ? "bg-red-500" : "bg-green-500",
      )}
    >
      {storage.isOccupiedByRenter ? "Occupied By Renter" : "Available"}
    </div>
  </div>
);

export default function StorageSection({ storages }: { storages: Storage[] }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <Collapsible className="mt-8" open={isOpen} onOpenChange={setIsOpen}>
      <Card className="p-2 space-y-2">
        <div className="flex justify-center items-center gap-2 pb-2">
          <SectionHeader title="Storages" />
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-9 p-0">
              {isOpen ? (
                <ChevronsUp className="h-4 w-4" />
              ) : (
                <ChevronsDown className="h-4 w-4" />
              )}
              <span className="sr-only">Toggle</span>
            </Button>
          </CollapsibleTrigger>
        </div>

        <CollapsibleContent className="space-y-2 mt-4">
          <Separator orientation="horizontal" />
          {storages.length === 0 ? (
            <div className="flex justify-center font-semibold text-lg">
              No associated storages found
            </div>
          ) : (
            storages.map((storage) => (
              <StorageInfo key={storage.id} storage={storage} />
            ))
          )}
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
