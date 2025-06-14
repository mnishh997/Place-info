import { Card, CardContent, CardHeader } from "./ui/card";
import { Separator } from "./ui/separator";

export default function Suggestions({ text }: { text: string }) {
  return (
    <Card className="border-x-8 border-x-foreground  rounded-xl p-4 bg-muted/30">
      <CardHeader className="text-2xl font-bold">
        Suggestions
      </CardHeader>
      <div className="px-6">
        <Separator />
      </div>
      <CardContent className="text-justify whitespace-pre-line">{text}</CardContent>
    </Card>
  );
}
