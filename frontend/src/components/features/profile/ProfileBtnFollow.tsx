import { Button } from "@/components/ui/button";
import { Profile, useFollow, useSession } from "@lens-protocol/react-web";
import { StopCircle, UserRoundMinus, UserRoundPlus } from "lucide-react";
import React, { ReactNode } from "react";
import { ProfileName } from "./ProfileName";
import { useToast } from "@/components/ui/use-toast";

export const ProfileBtnFollow = ({
  children,
  profile,
  variant = "outline",
}: {
  variant?: string;
  children?: ReactNode;
  profile: Profile;
}) => {
  const { execute } = useFollow();
  const { data: session } = useSession();

  const { toast } = useToast();
  if (!session?.authenticated || (session as any)?.profile?.id === profile.id)
    return <></>;

  return (
    <Button
      variant={variant as any}
      disabled={profile.operations.canFollow === "NO"}
      className={`gap-3 justify-between ${
        profile.operations.isFollowedByMe.value ||
        profile.operations.canFollow === "NO"
          ? "text-destructive"
          : "text-green-600"
      }`}
      onClick={async () => {
        try {
          if (profile.operations.canFollow === "NO") {
            return toast({
              title: "Error Follow",
              description: "This profile has blocked follow action",
              variant: "destructive",
            });
          }
          await execute({ profile });

          return toast({
            title: "Success",
            description: (
              <>
                Following <ProfileName profile={profile} />{" "}
              </>
            ),
          });
        } catch (error) {
          toast({
            title: "Error Follow",
            description: "An error occured during follow",
            variant: "destructive",
          });
        }
      }}
    >
      {profile.operations.canFollow ? (
        <>
          Can't following <StopCircle />
        </>
      ) : children || !profile.operations.isFollowedByMe.value ? (
        <>
          Follow <ProfileName profile={profile} />
          <UserRoundPlus />
        </>
      ) : (
        <>
          Unfollow <ProfileName profile={profile} />
          <UserRoundMinus />
        </>
      )}
    </Button>
  );
};
