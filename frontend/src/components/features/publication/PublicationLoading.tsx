import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/utils/ui";

export const PublicationLoading = ({}: {}) => {
  return (
    <>
      <div
        className={cn(
          `sm:px-6 px-2  relative w-full  flex pt-6 gap-3 mb-4 pb-2`
        )}
      >
        <div className="flex w-fit items-center flex-col">
          <Skeleton className="w-[45px] h-[45px] rounded-full" />
        </div>

        <div className="w-full flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex gap-4 items-center w-full">
              <Skeleton className="w-[100px] p-2" />
              <Skeleton className="w-[70px] p-2" />
            </div>
            <Skeleton className="w-[80px] p-1" />
          </div>

          <div className="flex flex-col gap-3">
            <Skeleton className={cn(`w-[500px] p-2`)} />
            <Skeleton className={cn(`w-[500px] p-2`)} />
          </div>
          <div className="flex gap-10 items-center">
            <Skeleton className="p-3 rounded-full" />
            <Skeleton className="p-3 rounded-full" />
            <Skeleton className="p-3 rounded-full" />
          </div>
        </div>
      </div>
    </>
  );
};
