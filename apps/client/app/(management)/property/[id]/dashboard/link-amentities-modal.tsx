import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";
import { useAssetManagement } from "@/context/asset-management-context";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import {
  Parking,
  Unit,
  Storage,
  IFinancialStatus,
  BuildingAsset,
  Facility,
} from "@/types";
import LoadingSpinner from "@/app/components/loading-spinner";
import useBuildingAsset from "./manage-building-assets-hook";
import { assetsColumns } from "./table-columns/assets-columns";
import { DataTable } from "@/app/components/table/data-table";
import CreateUpdateAssetModal from "./create-update-asset-modal";
import { ManagerOptions } from "./manager-options";
import { fetchBuildingParkings, fetchBuildingStorages } from "@/actions/management-actions";
import { useParams } from "next/navigation";
import { useAppSelector } from "@/redux/store";
import { use, useEffect, useState } from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
  
} from "@/app/components/ui/select"

export default function SelectParkingStorageModal() {
  const { token } = useAppSelector((state) => state.auth.value);
  const { id: buildingId } = useParams();
  const { showAmenityDialog, setShowAmenityDialog, asset } =
    useAssetManagement();
  const { assetPage, setAssetPage, assets, isFetching } = useBuildingAsset();

  const [storage, setStorage] = useState<Storage[]>([]);
  const [parking, setParking] = useState<Parking[]>([]);

  useEffect(() => {
    fetchBuildingStorages(buildingId as string, token as string).then(
      (storage) => {
        setStorage(storage);
      }
    );
    fetchBuildingParkings(buildingId as string, token as string).then(
      (parkings) => {
        setParking(parkings);
      }
    );
  }, []);



  return (
    <Dialog open={showAmenityDialog} onOpenChange={setShowAmenityDialog}>
      <DialogContent>
        <Tabs defaultValue="storage" className="w-[400px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value={BuildingAsset.parking}>Parking</TabsTrigger>
            <TabsTrigger value={BuildingAsset.storage}>Storage</TabsTrigger>
          </TabsList>
          <TabsContent value={BuildingAsset.parking}>
            <Card>
              <CardHeader>
                <CardTitle>Parking</CardTitle>
                <CardDescription>
                  Assign a parking spot to the selected unit
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {isFetching ? (
                  <div className="flex justify-center items-center">
                    <LoadingSpinner />
                  </div>
                ) : (
                      <Select>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select a parking number" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {parking.map((asset) => (
                              <SelectItem key={asset.parkingNumber} value={asset.parkingNumber as unknown as string}>
                                {asset.parkingNumber}
                              </SelectItem>
                            ))}

                          </SelectGroup>
                        </SelectContent>
                      </Select>

                  // getTable(BuildingAsset.parking, parking)
                )}
              </CardContent>
              <CardFooter>
                <Button>Save changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value={BuildingAsset.storage}>
            <Card>
              <CardHeader>
                <CardTitle>Storage</CardTitle>
                <CardDescription>
                  Assign a storage unit to the selected unit
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {isFetching ? (
                  <div className="flex justify-center items-center">
                    <LoadingSpinner />
                  </div>
                ) : (
                  <Select>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select a storage number" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                      {storage.map((asset) => (
                        <SelectItem key={asset.storageNumber} value={asset.storageNumber as unknown as string}>
                        {asset.storageNumber}
                      </SelectItem>
                      ))}

                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  // getTable(BuildingAsset.storage, storage)
                )}
              </CardContent>
              <CardFooter>
                <Button>Save password</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
      {/* <Button onClick={async()=>{
        await fetchBuildingParkings(buildingId as string, token as string);
        setShowAmenityDialog(false);
        //setUnit("")
      }}>asd</Button> */}
    </Dialog>
  );
}

const getAssetPageTitle = (assetPage: string) => {
  const assetPageTitle = assetPage.charAt(0).toUpperCase() + assetPage.slice(1);

  return assetPageTitle === BuildingAsset.facility
    ? "Facilities"
    : assetPageTitle;
};

// const getTable = (
//   assetPage: BuildingAsset,
//   assets: Unit[] | Parking[] | Storage[] | Facility[]
// ) => {
//   switch (assetPage) {
//     case BuildingAsset.parking:
//       return (
//         <DataTable
//           columns={assetsColumns("parkingNumber", BuildingAsset.parking)}
//           data={assets as Parking[]}
//           filter={{
//             title: "parking number",
//             key: "parkingNumber",
//           }}
//         />
//       );

//     case BuildingAsset.storage:
//       return (
//     <Select>
//       <SelectTrigger className="w-[180px]">
//         <SelectValue placeholder="Select a storage unit" />
//       </SelectTrigger>
//       <SelectContent>
//         <SelectGroup>
//           {assets.map((asset) => (
//             <SelectItem key={asset.storageNumber} value={asset.storageNumber}>
//               {asset.storageNumber}
//             </SelectItem>
//           ))}

//         </SelectGroup>
//       </SelectContent>
//     </Select>
//       );
//   }
// };
