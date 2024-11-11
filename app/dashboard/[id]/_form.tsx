"use client";

import { Button } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { createQuestionSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { QuestionType } from "@prisma/client";
import { useForm } from "react-hook-form";
import { z } from "zod";

function QuestionForm({ quizId }: { quizId: string }) {
  const form = useForm<z.infer<typeof createQuestionSchema>>({
    resolver: zodResolver(createQuestionSchema),
    defaultValues: {
      question: "",
      answer: [],
      type: "ABC",
      quizId: quizId,
    },
  });

  function onSubmit(values: z.infer<typeof createQuestionSchema>) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="question"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Question</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Question" />
              </FormControl>
              <FormDescription>Enter the question</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="answer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Answer</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Answer" />
              </FormControl>
              <FormDescription>Enter the answer</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(QuestionType).map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>Select the type of the question</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Create</Button>
      </form>
    </Form>
  );
}

export default QuestionForm;
