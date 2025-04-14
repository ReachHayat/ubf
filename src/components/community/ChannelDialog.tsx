
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ChannelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  channelName: string;
  setChannelName: (name: string) => void;
  onSave: () => void;
  saveButtonText: string;
}

export const ChannelDialog: React.FC<ChannelDialogProps> = ({
  open,
  onOpenChange,
  title,
  channelName,
  setChannelName,
  onSave,
  saveButtonText,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="channel-name" className="text-right">
              Channel name
            </Label>
            <Input
              id="channel-name"
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
              className="col-span-3"
              placeholder="general"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSave}>
            {saveButtonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
