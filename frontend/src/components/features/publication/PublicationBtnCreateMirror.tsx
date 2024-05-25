import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ExplorePublication, useCreateMirror } from "@lens-protocol/react-web";
import { Repeat2 } from "lucide-react";

export const PublicationBtnCreateMirror = ({
  publication,
}: {
  publication: ExplorePublication;
}) => {
  const { execute: mirror, error, ...rest } = useCreateMirror();
  const { toast } = useToast();

  const handleClick = async (e: any) => {
    e.stopPropagation();
    const result = await mirror({
      mirrorOn: publication.id,
    });

    if (result.isFailure()) {
      console.error("Failed to mirror", result);
      return toast({
        title: "Error",
        description: "Failed to mirror",
        variant: "destructive",
      });
    } else {
      return toast({ title: "Success", description: "Post was mirrored" });
    }
  };

  return (
    <Button
      onClick={handleClick}
      className={`rounded-full mr-1 ${
        publication.operations.hasMirrored ? "hover:bg-destructive" : ""
      }`}
      variant={publication.operations.hasMirrored ? "default" : "outline"}
    >
      <Repeat2 className="mr-2 h-4 w-4" />
      {publication?.stats.mirrors}
    </Button>
  );
};
