"use client";

import { useState, useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Question, QuestionType } from "@prisma/client";
import { z } from "zod";
import { trpc } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

const questionSchema = z.object({
  id: z.string().optional(),
  quizId: z.string(),
  question: z.string().min(1, "Question is required"),
  type: z.nativeEnum(QuestionType),
  answer: z.array(z.string()).min(1, "At least one answer is required"),
  correctAnswer: z
    .array(z.string())
    .min(1, "At least one correct answer is required"),
});

const formSchema = z.object({
  questions: z.array(questionSchema),
});

type FormValues = z.infer<typeof formSchema>;

export default function QuestionForm({
  quizId,
  initialQuestions = [],
}: {
  quizId: string;
  initialQuestions?: Question[];
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const upsertQuestionsMutation = trpc.Quizzes.createQuestions.useMutation();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      questions:
        initialQuestions.length > 0
          ? initialQuestions
          : [
              {
                quizId,
                question: "",
                type: QuestionType.ABC,
                answer: [""],
                correctAnswer: [],
              },
            ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "questions",
    control: form.control,
  });

  useEffect(() => {
    if (initialQuestions.length > 0) {
      form.reset({ questions: initialQuestions });
    }
  }, [initialQuestions, form]);

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      await upsertQuestionsMutation.mutateAsync(data.questions);
      toast.success(`${data.questions.length} question(s) saved successfully`);
    } catch (error) {
      toast.error("Failed to save questions." + error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full max-w-2xl space-y-8"
      >
        {fields.map((field, index) => (
          <Card key={field.id}>
            <CardHeader>
              <CardTitle>Question {index + 1}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name={`questions.${index}.question`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Question</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your question" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`questions.${index}.type`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Question Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a question type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={QuestionType.ABC}>ABC</SelectItem>
                        <SelectItem value={QuestionType.MULTIPLE_CHOICE}>
                          Multiple Choice
                        </SelectItem>
                        <SelectItem value={QuestionType.FILL_BLANK}>
                          Fill in the Blank
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <FormLabel>Answers</FormLabel>
                {form
                  .watch(`questions.${index}.answer`)
                  .map((_, answerIndex) => (
                    <FormField
                      key={answerIndex}
                      control={form.control}
                      name={`questions.${index}.answer.${answerIndex}`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="mt-2 flex items-center space-x-2">
                              <Input {...field} />
                              <FormField
                                control={form.control}
                                name={`questions.${index}.correctAnswer`}
                                render={({ field: correctAnswerField }) => (
                                  <FormItem className="flex items-center space-x-2">
                                    <FormControl>
                                      <Checkbox
                                        checked={correctAnswerField.value?.includes(
                                          field.value,
                                        )}
                                        onCheckedChange={(checked) => {
                                          const updatedCorrectAnswers = checked
                                            ? [
                                                ...(correctAnswerField.value ||
                                                  []),
                                                field.value,
                                              ]
                                            : (
                                                correctAnswerField.value || []
                                              ).filter(
                                                (value) =>
                                                  value !== field.value,
                                              );
                                          form.setValue(
                                            `questions.${index}.correctAnswer`,
                                            updatedCorrectAnswers,
                                          );
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="text-sm font-normal">
                                      Correct
                                    </FormLabel>
                                  </FormItem>
                                )}
                              />
                              {answerIndex > 0 && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  onClick={() => {
                                    const currentAnswers = form.getValues(
                                      `questions.${index}.answer`,
                                    );
                                    form.setValue(
                                      `questions.${index}.answer`,
                                      currentAnswers.filter(
                                        (_, i) => i !== answerIndex,
                                      ),
                                    );
                                    const currentCorrectAnswers =
                                      form.getValues(
                                        `questions.${index}.correctAnswer`,
                                      );
                                    form.setValue(
                                      `questions.${index}.correctAnswer`,
                                      currentCorrectAnswers.filter(
                                        (answer) => answer !== field.value,
                                      ),
                                    );
                                  }}
                                >
                                  -
                                </Button>
                              )}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => {
                    const currentAnswers = form.getValues(
                      `questions.${index}.answer`,
                    );
                    form.setValue(`questions.${index}.answer`, [
                      ...currentAnswers,
                      "",
                    ]);
                  }}
                >
                  Add Answer
                </Button>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => remove(index)}
              >
                Remove Question
              </Button>
            </CardFooter>
          </Card>
        ))}

        <div className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              append({
                quizId,
                question: "",
                type: QuestionType.ABC,
                answer: [""],
                correctAnswer: [],
              })
            }
          >
            Add Another Question
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save All Questions"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
