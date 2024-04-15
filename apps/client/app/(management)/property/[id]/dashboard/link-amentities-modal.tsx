import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
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
import {
  fetchBuildingParkings,
  fetchBuildingStorages,
} from "@/actions/management-actions";
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
  SelectValue,
} from "@/app/components/ui/select";
import { linkParkingToUnit, linkStorageToUnit } from "@/actions/management-actions";
import toast from "react-hot-toast";

export default function SelectParkingStorageModal() {

  const { token } = useAppSelector((state) => state.auth.value);
  const { id: buildingId } = useParams();
  const { showAmenityDialog, setShowAmenityDialog, asset } =
    useAssetManagement();
  const { assetPage, setAssetPage, assets, isFetching } = useBuildingAsset();

  const [storage, setStorage] = useState<Storage[]>([]);
  const [parking, setParking] = useState<Parking[]>([]);

  const [selectedParkingSpot, setSelectedParkingSpot] = useState<string | null>(null);
  const [selectedStorageSpot, setSelectedStorageSpot] = useState<string | null>(null);


  const handleSaveChanges = async () => {
    try {
      if (selectedParkingSpot) {

        const parkingID = parking.filter((p) => p.parkingNumber as unknown as string === selectedParkingSpot)[0].id

        await linkParkingToUnit( (asset as Unit)?.id ,parkingID, token as string);
        toast.success("parking linked successfuly");
        setSelectedParkingSpot(null);
      }

      if (selectedStorageSpot) {
        const storageID = storage.filter((s) => s.storageNumber as unknown as string === selectedStorageSpot)[0].id
        await linkStorageToUnit( (asset as Unit)?.id ,storageID, token as string);
        toast.success("storage linked successfuly");
        setSelectedStorageSpot(null);
      }
      setShowAmenityDialog(false);
    } catch(error) {
      toast.error((error as Error).message);
      setSelectedParkingSpot(null);
      setSelectedStorageSpot(null);
    }
  }


  useEffect(() => {
    fetchBuildingStorages(buildingId as string, token as string).then(
      (storage) => {
        setStorage(storage);
      },
    );
    fetchBuildingParkings(buildingId as string, token as string).then(
      (parkings) => {
        setParking(parkings);
      },
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
                  <Select onValueChange={(value) => {setSelectedParkingSpot(value)}}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select a parking number" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {parking.map((asset) => (
                          <SelectItem
                            key={asset.parkingNumber}
                            value={asset.parkingNumber as unknown as string}                         
                          >
                            {asset.parkingNumber}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveChanges}>Save changes</Button>
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
                  <Select onValueChange={(value) => {setSelectedStorageSpot(value)}}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select a storage number" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {storage.map((asset) => (
                          <SelectItem
                            key={asset.storageNumber}
                            value={asset.storageNumber as unknown as string}
                          >
                            {asset.storageNumber}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveChanges}>Save changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>

    </Dialog>
  );
}

const getAssetPageTitle = (assetPage: string) => {
  const assetPageTitle = assetPage.charAt(0).toUpperCase() + assetPage.slice(1);

  return assetPageTitle === BuildingAsset.facility
    ? "Facilities"
    : assetPageTitle;
};

