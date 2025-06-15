import { Card, CardContent, CardHeader } from "./ui/card";
import { Separator } from "./ui/separator";
import { Skeleton } from "./ui/skeleton";

export default function Suggestions({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  // Split text into lines and filter out empty lines
  const items = text.split(/\r?\n/).filter((line, index) => index != 0 && line.trim().length > 0);
  console.log(text)
  // Helper to render bold markdown (**text**) as <strong>text</strong>
  const renderMarkdownBold = (str: string) => {
    // Replace **bold** with <strong>bold</strong>
    return str.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  };

  return (
    <Card
      className={
        "border-x-8 border-x-foreground  rounded-xl p-4 bg-muted/30 " +
        (className || "")
      }
    >
      <CardHeader className="text-2xl font-bold">Suggestions</CardHeader>
      <div className="px-6">
        <Separator />
      </div>
      <CardContent className="text-justify">
        <ul className="list-disc pl-6">
          {items.map((item, idx) => (
            <li
              key={idx}
              dangerouslySetInnerHTML={{
                __html: renderMarkdownBold(item),
              }}
            />
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}


export const SuggestionSkeleton = ({className} : {className: string}) => {
  return <Card className={className}>
      <CardHeader>
        <Skeleton className="h-8" />
        <CardContent className="px-0 flex flex-col gap-4">
          <Skeleton className="w-full max-w-xl h-4" />
          <Skeleton className="w-full max-w-xl h-4" />
          <Skeleton className="w-full max-w-xl h-4" />
          <Skeleton className="w-full max-w-xl h-4" />
          <Skeleton className="w-full max-w-xl h-4" />
          <Skeleton className="w-full max-w-xl h-4" />
          <Skeleton className="w-full max-w-xl h-4" />
          <Skeleton className="w-full max-w-xl h-4" />
          <Skeleton className="w-full max-w-xl h-4" />
          <Skeleton className="w-full max-w-xl h-4" />
          <Skeleton className="w-full max-w-xl h-4" />
          <Skeleton className="w-full max-w-xl h-4" />
        </CardContent>
      </CardHeader>
    </Card>
}