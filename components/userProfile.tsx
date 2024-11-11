"use client";

import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload, UserRoundMinus } from "lucide-react";

import { User } from "next-auth";

import { trpc } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateUserSchema } from "@/lib/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

function UserProfile({ user }: { user: User | undefined }) {
  const { data: users } = trpc.Users.getUsers.useQuery();
  const updateUser = trpc.Users.updateUser.useMutation();
  const removeUser = trpc.Users.removeUser.useMutation();

  const router = useRouter();

  const form = useForm<z.infer<typeof updateUserSchema>>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      id: user?.id,
      username: user?.username,
      password: "12345678",
    },
  });

  async function onSubmit(values: z.infer<typeof updateUserSchema>) {
    if (values.username === user?.username && values.password === "12345678") {
      return toast.error("You can not change your username and password");
    }

    if (
      !!users?.find((user) => user.username === values.username) &&
      values.username !== user?.username
    ) {
      return toast.error("Username already was taken");
    }

    await updateUser.mutateAsync({
      id: values.id,
      username: values.username,
      password: `${values.password}`,
    });

    router.refresh();
  }

  return (
    <DialogContent>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Profile</DialogTitle>
            <DialogDescription>Edit your profile</DialogDescription>
          </DialogHeader>
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Username" />
                </FormControl>
                <FormDescription>Update your username</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input {...field} type="password" />
                </FormControl>
                <FormDescription>
                  Update your password. If you want change password remove
                  placeholder password
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <DialogClose asChild>
            <div className="flex flex-row justify-between">
              <Button type="submit">
                Update <Upload />
              </Button>
              <Button
                variant="destructive"
                onClick={async () => {
                  await removeUser.mutateAsync(user?.id as string);
                  router.prefetch("/");
                  router.push("/");
                }}
              >
                Delete <UserRoundMinus />
              </Button>
            </div>
          </DialogClose>
        </form>
      </Form>
    </DialogContent>
  );
}

export default UserProfile;
