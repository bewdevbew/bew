import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  ExplorePublication,
  PublicationReactionType,
  publicationId,
  useCreateMirror,
  useReactionToggle,
  useWhoReactedToPublication,
} from "@lens-protocol/react-web";
import { Loader2, Repeat2 } from "lucide-react";

import { Heart } from "lucide-react";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { HoverCard } from "@/components/ui/hover-card";
import { ProfileAvatar } from "../profile/ProfileAvatar";

export const PublicationBtnUpvotes = ({
  publication,
}: {
  publication: ExplorePublication;
}) => {
  const [targetId, setIsTargetId] = useState("");

  const { data, loading, hasMore } = useWhoReactedToPublication({
    for: publicationId(targetId),
  });

  const reactions = data?.filter((el) =>
    el.reactions.find((r) => r.reaction === "UPVOTE")
  );

  const { toast } = useToast();
  const { execute } = useReactionToggle();
  const handleClick = async (e: any) => {
    e.stopPropagation();
    const result = await execute({
      publication: publication,
      reaction: PublicationReactionType.Upvote,
    });
    console.log({ result });
    if (result.isFailure()) {
      console.error("Failed to upvote", result);
      return toast({
        title: "Error",
        description: "Failed to upvote",
        variant: "destructive",
      });
    }
  };

  return !publication?.stats?.upvotes ? (
    <Button
      onClick={handleClick}
      className="rounded-full mr-1"
      variant={"outline"}
    >
      <Heart className="mr-2 h-4 w-4" />
      {publication?.stats?.upvotes}
    </Button>
  ) : (
    <HoverCard
      trigger={
        <motion.span
          className={` grow flex items-center justify-center`}
          onClick={handleClick}
          onHoverStart={() => setIsTargetId(publication.id)}
        >
          <Heart className="mr-2 h-4 w-4" />
          {publication?.stats?.upvotes}
        </motion.span>
      }
      className={`relative   max-h-[20vh]  overflow-y-auto ${
        publication.operations.hasUpvoted
          ? " bg-primary text-primary-foreground hover:bg-destructive"
          : ""
      }`}
    >
      <div className=" pointer-events-auto  ">
        {loading ? (
          <Loader2 className="m-10" />
        ) : (
          reactions?.map((el, i) => (
            <ProfileAvatar
              showTooltip
              showBadge
              key={`upvote-reaction-${el.profile.id}-${i}`}
              profile={el.profile}
            />
          ))
        )}
      </div>
    </HoverCard>
  );
};
