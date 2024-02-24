import { Button } from "@/app/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/ui/popover";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import AddPopover from "./add-popover";
import { FaBox, FaParking } from "react-icons/fa";


export function ManagerOptions() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <HamburgerMenuIcon style={{ marginRight: "5px" }} />
          Manage Building Assets
        </Button>
      </PopoverTrigger>
      <PopoverContent className="bg-white border rounded shadow-md p-4">
        <div className="flex flex-col space-y-2">
          <Button>
            <Link href={"/unit"}>Add a New Unit</Link>
          </Button>
          <AddPopover title="Add Parking" icon={FaParking} />
          <AddPopover title="Add Storage" icon={FaBox} />
        </div>
      </PopoverContent>
    </Popover>
  );
}
