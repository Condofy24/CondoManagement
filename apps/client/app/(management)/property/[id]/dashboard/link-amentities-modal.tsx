import { Button } from "@/app/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs"
import { useAssetManagement } from "@/context/asset-management-context"
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
import useBuildingAsset from "./manage-building-assets-hook"
import { assetsColumns } from "./table-columns/assets-columns"
import { DataTable } from "@/app/components/table/data-table"
import CreateUpdateAssetModal from "./create-update-asset-modal"
import { ManagerOptions } from "./manager-options"
import { fetchBuildingParkings } from "@/actions/management-actions"
import { useParams } from "next/navigation"
import { useAppSelector } from "@/redux/store"

export default function SelectParkingStorageModal() {
      const { token } = useAppSelector((state) => state.auth.value);
    const { id: buildingId } = useParams();
    const {showAmenityDialog, setShowAmenityDialog, asset } = 
      useAssetManagement();
      const { assetPage, setAssetPage, assets, isFetching } = useBuildingAsset();
    //   const v1 = BuildingAsset.parking;
    //   const v2 = await fetchBuildingParkings(buildingId as string, token as string);
      

  return (
    <Dialog open={showAmenityDialog} onOpenChange={setShowAmenityDialog}>
    <DialogContent>
    <Tabs defaultValue="account" className="w-[400px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="account">Parking</TabsTrigger>
        <TabsTrigger value="password">Storage</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <Card>
          <CardHeader>
            <CardTitle>Parking</CardTitle>
            <CardDescription>
              Assign parking spots to the selected unit
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">

            {isFetching ? (
                    <div className="flex justify-center items-center">
                    <LoadingSpinner />
                    </div>
                ) : (
                    getTable(assetPage, assets)          
                )}
          </CardContent>
          <CardFooter>
            <Button>Save changes</Button>
          </CardFooter>
        </Card>
      </TabsContent>



      <TabsContent value="password">
        <Card>
          <CardHeader>
            <CardTitle>Storage</CardTitle>
            <CardDescription>
              Assign storage units to the selected unit
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="current">Current password</Label>
              <Input id="current" type="password" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="new">New password</Label>
              <Input id="new" type="password" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save password</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
    </DialogContent>
    </Dialog>
  )
}

const getAssetPageTitle = (assetPage: string) => {
  const assetPageTitle = assetPage.charAt(0).toUpperCase() + assetPage.slice(1);

  return assetPageTitle === BuildingAsset.facility
    ? "Facilities"
    : assetPageTitle;
};

const getTable = (
  assetPage: BuildingAsset,
  assets:  Unit[] | Parking[] | Storage[] | Facility[]
) => {
  switch (assetPage) {

    case BuildingAsset.parking:
      return (
        <DataTable
          columns={assetsColumns("parkingNumber", BuildingAsset.parking)}
          data={assets as Parking[]}
          filter={{
            title: "parking number",
            key: "parkingNumber",
          }}
        />
      );

    case BuildingAsset.storage:
      return (
        <DataTable
          columns={assetsColumns("storageNumber", BuildingAsset.storage)}
          data={assets as Storage[]}
          filter={{
            title: "storage number",
            key: "storageNumber",
          }}
        />
      );
  }
};

