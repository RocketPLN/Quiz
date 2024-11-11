"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormDescription,
  FormField,
  FormMessage,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { createQuizSchema } from "@/lib/zod";
import { trpc } from "@/trpc/client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

function CreateQuiz({ creatorId }: { creatorId: string }) {
  const { data: quizzes } = trpc.Quizzes.getQuizzes.useQuery();
  const createQuiz = trpc.Quizzes.createQuiz.useMutation();
  const router = useRouter();

  const QuizCategories = Object.values(createQuizSchema.shape.category.enum);
  const form = useForm<z.infer<typeof createQuizSchema>>({
    resolver: zodResolver(createQuizSchema),
    defaultValues: {
      title: "",
      category: "ENGLISH",
      creatorId: creatorId,
    },
  });

  async function onSubmit(values: z.infer<typeof createQuizSchema>) {
    const sameQuiz = quizzes?.find(
      (quiz) =>
        quiz.title === values.title && quiz.category === values.category,
    );

    if (!sameQuiz) {
      await createQuiz.mutateAsync(values);
      toast.success("Quiz created successfully");
      router.prefetch("/dashboard");
      router.push("/dashboard");
      return;
    }
    toast.error("Quiz with this title already exists");
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="border text-3xl font-semibold" variant="ghost">
          Create Quiz
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Quiz</DialogTitle>
          <DialogDescription>Create a new quiz</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              name="title"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Title" />
                  </FormControl>
                  <FormDescription>Enter the title of the quiz</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="category"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {QuizCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category.at(0) +
                            category.toLocaleLowerCase().slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select the category of the quiz
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogClose asChild>
              <Button type="submit" className="w-full text-2xl">
                Create
              </Button>
            </DialogClose>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateQuiz;
