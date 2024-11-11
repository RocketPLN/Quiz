import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import UserProfile from "@/components/userProfile";

import {
  AppWindow,
  ChevronsUpDown,
  LogOut,
  UserIcon,
  UserPen,
} from "lucide-react";

import { User } from "next-auth";
import { signOut } from "next-auth/react";
import { Dialog, DialogTrigger } from "./ui/dialog";
import { useState } from "react";

function UserDropdown({ user }: { user: User | undefined }) {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Dialog>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" onMouseOver={() => setOpen(!open)}>
            {user?.username} <ChevronsUpDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel className="flex-row flex items-center gap-2">
            My Account <UserIcon />
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <DialogTrigger className="flex justify-center gap-2 items-center">
              Profile <UserPen />
            </DialogTrigger>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => (globalThis.location.href = "/dashboard")}
          >
            Dashboard <AppWindow />
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => signOut()}>
            Log out <LogOut />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <UserProfile user={user} />
    </Dialog>
  );
}

export default UserDropdown;
