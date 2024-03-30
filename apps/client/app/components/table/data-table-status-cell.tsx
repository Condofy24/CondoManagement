import React from "react";
import { Button } from "../ui/button";

function StatusCell({ getValue }: any) {
  const isOccupied = getValue();
  return (
    <div>
      {isOccupied === true ? (
        <Button className="text-black/80 dark:text-white bg-red-300 dark:bg-red-500 cursor-default">
          Occupied
        </Button>
      ) : (
        <Button className="text-black/80 dark:text-white bg-green-300 dark:bg-green-500 cursor-default">
          Available
        </Button>
      )}
    </div>
  );
}

export default StatusCell;
