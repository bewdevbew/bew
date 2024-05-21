"use client";

import { cn } from "@/utils/ui";

import { AnimatePresence, motion } from "framer-motion";
import React, {
  ReactElement,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Card, CardType } from "./card";
import { Notification, NotificationType } from "./notification";

const AnimatedList = React.memo(
  ({
    className,
    children,
    delay = 1500,
  }: {
    className?: string;
    children: React.ReactNode;
    delay?: number;
  }) => {
    const [index, setIndex] = useState(0);
    const childrenArray = React.Children.toArray(children);

    useEffect(() => {
      const interval = setInterval(() => {
        setIndex((prevIndex) => {
          const newIndex = prevIndex + 1;
          if (newIndex >= childrenArray.length) {
            clearInterval(interval);

            return prevIndex; // Return the previous index to stop incrementing
          }
          return newIndex;
        });
      }, delay);

      return () => clearInterval(interval);
    }, [childrenArray.length, delay]);

    const AnimatedItemsToShow = useMemo(
      () => childrenArray.slice(0, index + 1).reverse(),
      [index, childrenArray]
    );

    return (
      <div className={`flex flex-col AnimatedItems-center gap-4 ${className}`}>
        <AnimatePresence>
          {AnimatedItemsToShow.map((item) => (
            <AnimatedListAnimatedItem key={(item as ReactElement).key}>
              {item}
            </AnimatedListAnimatedItem>
          ))}
        </AnimatePresence>
      </div>
    );
  }
);

AnimatedList.displayName = "AnimatedList";

export function AnimatedListAnimatedItem({
  children,
}: {
  children: React.ReactNode;
}) {
  const animations = {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1, originY: 0 },
    exit: { scale: 0, opacity: 0 },
    transition: { type: "spring", stiffness: 350, damping: 40 },
  };

  return (
    <motion.div {...animations} layout className="mx-auto w-full">
      {children}
    </motion.div>
  );
}

export function MyAnimatedList({
  header,
  notifications = [],
  children,
}: {
  children?: React.ReactNode;
  header: CardType["header"];
  notifications: NotificationType[];
}) {
  return (
    <Card
      header={header}
      className="relative flex max-h-[600px] min-h-[600px] w-full "
    >
      <div className="p-4 scrollbar-thin overflow-auto">
        <AnimatedList>
          {notifications.map((item, idx) => (
            <Notification {...item} className="overflow-hidden" key={idx} />
          ))}
        </AnimatedList>
      </div>
      {children}
    </Card>
  );
}

export { MyAnimatedList as AnimatedList };
