import {
  Tooltips,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function Tooltip({
  children,
  content,
  asChild,
}: {
  children: React.ReactNode;
  content: string;
  asChild?: boolean;
}) {
  return (
    <TooltipProvider>
      <Tooltips>
        <TooltipTrigger asChild={asChild}>{children}</TooltipTrigger>
        <TooltipContent>
          <p>{content}</p>
        </TooltipContent>
      </Tooltips>
    </TooltipProvider>
  );
}

export default Tooltip;
