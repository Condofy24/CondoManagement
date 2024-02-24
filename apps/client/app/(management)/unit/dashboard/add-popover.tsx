import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/ui/popover";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { IconType } from "react-icons/lib";

type AddPopoverProps = {
  title: string;
  icon: IconType;
};

function AddPopover({ title, icon: Icon }: AddPopoverProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <Icon style={{ marginRight: "5px" }} /> {title}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="bg-white border rounded shadow-md p-4 dark:bg-grey">
        <div className="flex flex-col space-y-2">
            <Input placeholder="Input Quantity" type="number"/>
            <Button>Add</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default AddPopover;
