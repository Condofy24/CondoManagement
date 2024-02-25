import React from "react";
import { Button } from "../ui/button";

function StatusCell({ getValue }: any) {
  const isOccupied = getValue();

  return (
    <div>
      {isOccupied === true ? (
        <Button className="bg-red-400 dark:bg-red-400 hover:bg-red-400 hover:dark:bg-red-400 cursor-default">
          Occupied
        </Button>
      ) : (
        <Button className="bg-green-400 dark:bg-green-400 hover:bg-green-400 hover:dark:bg-green-400 cursor-default">
          Available
        </Button>
      )}
    </div>
  );
}

export default StatusCell;
