"use client";
import {
  KnockProvider,
  KnockFeedProvider,
  useKnockFeed,
} from "@knocklabs/react";
import { useAppSelector } from "@/redux/store";
import { useTheme } from "./theme-context";

import "@knocklabs/react/dist/index.css";
import { ReactNode, useEffect } from "react";
import toast from "react-hot-toast";

const NotificationToaster = ({ children }: { children: ReactNode }) => {
  const { feedClient } = useKnockFeed();

  const onNotificationsReceived = ({ items }: { items: any }) => {
    // Whenever we receive a new notification from our real-time stream, show a toast
    // (note here that we can receive > 1 items in a batch)
    items.forEach((notification: any) => {
      console.log(notification.blocks[0].rendered);
      toast(notification.blocks[0].rendered.replace(/<\/?p>/g, ""), {
        id: notification.id,
      });
    });

    // Optionally, you may want to mark them as "seen" as well
    feedClient.markAsSeen(items);
  };

  useEffect(() => {
    // Receive all real-time notifications on our feed
    feedClient.on("items.received.realtime", onNotificationsReceived);

    // Cleanup
    return () =>
      feedClient.off("items.received.realtime", onNotificationsReceived);
  }, [feedClient]);

  return <>{children}</>;
};

export function NotificationProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = useAppSelector((state) => state.auth.value);
  const { theme } = useTheme();

  return (
    <KnockProvider
      apiKey={process.env.KNOCK_PUBLIC_API_KEY as string}
      userId={user?.id}
    >
      <KnockFeedProvider
        colorMode={theme}
        feedId={process.env.KNOCK_FEED_CHANNEL_ID as string}
      >
        <>
          <NotificationToaster>{children}</NotificationToaster>
        </>
      </KnockFeedProvider>
    </KnockProvider>
  );
}
