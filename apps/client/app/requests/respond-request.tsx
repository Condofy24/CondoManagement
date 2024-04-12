import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { RequestStatus } from "@/types";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import toast from "react-hot-toast";
import {
  RequestUpdateData,
  respondToRequest,
} from "@/actions/resident-actions";

export default function RespondRequest({
  token,
  showReqDialog,
  setShowReqDialog,
  req,
  setReq,
  getReq,
}: {
  token: string | null;
  showReqDialog: boolean;
  setShowReqDialog: React.Dispatch<React.SetStateAction<boolean>>;
  req: RequestUpdateData;
  setReq: React.Dispatch<React.SetStateAction<RequestUpdateData>>;
  getReq: any;
}) {
  return (
    <Dialog open={showReqDialog} onOpenChange={setShowReqDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Respond to Request</DialogTitle>
        </DialogHeader>
        <Select
          onValueChange={(e) => {
            setReq({ ...req, status: e as RequestStatus });
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Request status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value={RequestStatus.SUBMITTED}>
                {RequestStatus.SUBMITTED}
              </SelectItem>
              <SelectItem value={RequestStatus.IN_PROGRESS}>
                {RequestStatus.IN_PROGRESS}
              </SelectItem>
              <SelectItem value={RequestStatus.RESOLVED}>
                {RequestStatus.RESOLVED}
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Textarea
          id="name"
          defaultValue="Description..."
          onChange={(e) => {
            setReq({ ...req, resolutionContent: e.target.value });
          }}
        />
        <DialogFooter>
          <DialogClose>
            <div
              className="rounded-lg p-1 text-sm font-semibold flex items-center justify-center w-32 bg-slate-400"
              onClick={async () => {
                if (!req.status || !req.resolutionContent) {
                  toast.error("Please fill in all fields");
                  return;
                }
                try {
                  await respondToRequest(
                    req.id as string,
                    req,
                    token as string,
                  );
                  toast.success(`Request updated successfully`);
                } catch (error) {
                  toast.error((error as Error).message);
                }
                setReq({} as RequestUpdateData);
                setShowReqDialog(false);
                await getReq();
              }}
            >
              Respond
            </div>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
