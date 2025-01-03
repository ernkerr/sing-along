// pusher server side event trigger
// api route to handle pusher event triggering securely

// initalize pusher with credentials

import Pusher from "pusher";
import { NextApiRequest, NextApiResponse } from "next";

console.log("PUSHER_APP_ID:", process.env.PUSHER_APP_ID);
console.log("NEXT_PUBLIC_PUSHER_KEY:", process.env.NEXT_PUBLIC_PUSHER_KEY);
console.log("PUSHER_SECRET:", process.env.PUSHER_SECRET);
console.log(
  "NEXT_PUBLIC_PUSHER_CLUSTER:",
  process.env.NEXT_PUBLIC_PUSHER_CLUSTER
);

// initialze pusher with credentials
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID as string,
  key: process.env.PUSHER_KEY as string,
  secret: process.env.PUSHER_SECRET as string,
  cluster: process.env.PUSHER_CLUSTER as string,
  useTLS: true,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { channel, event, data } = req.body;

    try {
      await pusher.trigger(channel, event, data);
      res.status(200).send("Event triggered successfully!");
    } catch (error) {
      console.error("Error triggering Pusher event:", error);
      res.status(500).send("Error triggering event.");
    }
  } else {
    res.status(405).send("Method not allowed.");
  }
}
