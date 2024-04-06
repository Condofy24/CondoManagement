import { Button } from "@/app/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/ui/popover";
import { BuildingAsset } from "@/types";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { CSSProperties } from "react";
import { FaBox, FaParking, FaHome } from "react-icons/fa";
import { BsBuildingFillGear } from "react-icons/bs";

const IconStyle: CSSProperties = { marginRight: "5px" };

export function ManagerOptions({
  setAssetPage,
}: {
  setAssetPage: React.Dispatch<React.SetStateAction<BuildingAsset>>;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <HamburgerMenuIcon style={IconStyle} />
          Manage Building Assets
        </Button>
      </PopoverTrigger>
      <PopoverContent className="border rounded shadow-md">
        <div className="flex flex-col space-y-2">
          <Button
            className="w-full"
            onClick={() => {
              setAssetPage(BuildingAsset.unit);
            }}
          >
            <FaHome style={IconStyle} />
            Manage Units
          </Button>

          <Button
            className="w-full"
            onClick={() => {
              setAssetPage(BuildingAsset.parking);
            }}
          >
            <FaParking style={IconStyle} />
            Manage Parking
          </Button>

          <Button
            className="w-full"
            onClick={() => {
              setAssetPage(BuildingAsset.storage);
            }}
          >
            <FaBox style={IconStyle} />
            Manage Storage
          </Button>

          <Button
            className="w-full"
            onClick={() => {
              setAssetPage(BuildingAsset.facility);
            }}
          >
            <BsBuildingFillGear style={IconStyle} />
            Manage Facilities
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
