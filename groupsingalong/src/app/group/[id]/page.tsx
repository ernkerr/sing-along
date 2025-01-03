// group page

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Pusher from "pusher-js";

export default function GroupPage() {
  const { id } = useParams() as { id: string }; // retrieve the group ID from the URL
  const [isConductor, setIsConductor] = useState(false); // determine if the user is the coductor/creator or if they are a singer
  const [lyrics, setLyrics] = useState(""); // state to hold the current lyrics
  const [searchTerm, setSearchTerm] = useState(""); // state for song name search
  const [artist, setArtist] = useState(""); // state for artist name search

  //   useEffect(() => {
  //     //identify if the user is the Conductor (via localStorage or query param)
  //     setIsConductor(localStorage.getItem("isConductor") === id);
  //   }, [id]);

  // identify if the user is the conductor
  useEffect(() => {
    setIsConductor(localStorage.getItem("isConductor") === "true");
  }, []);

  useEffect(() => {
    // initialize pusher
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY as string, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER as string,
    });

    // subscribe to a channel for the group
    const channel = pusher.subscribe("group-lyrics");

    // listen for 'lyrics-update' event to sunc events
    channel.bind("lyric-update", (data: { lyrics: string }) => {
      setLyrics(data.lyrics); // update local lyrics state
    });

    // cleanup: unbind events and unsubscribe from the channel when the component unmounts
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []);

  const searchLyrics = async () => {
    try {
      console.log("trying to query lyrics from db");
      const response = await fetch(
        `/api/lyrics?query=${searchTerm}&srtist=${artist}`
      );
      const data = await response.json();

      if (data.lyrics) {
        setLyrics(data.lyrics); // update local lyrics

        // broadcast lyrics to all group members via pusher
        const response = await fetch("/api/pusher", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            channel: `group-lyrics-${id}`,
            event: "lyrics-update",
            data: { lyrics: data.lyrics },
          }),
        });
        if (!response.ok) {
          alert("Failed to broadcast lyrics!");
        }
      } else {
        alert("No lyrics found");
      }
    } catch (error) {
      console.error("Error searching lyrics: ", error);
    }
  };

  return (
    <>
      <h1>Group Code: {id}</h1>
      {isConductor ? (
        <>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Enter song name"
          />
          <input
            type="text"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            placeholder="Enter artist name (optional)"
          />
          <button onClick={searchLyrics}>Search</button>
          <div>
            <h2>Lyrics:</h2>
            <p>{lyrics}</p>
          </div>
        </>
      ) : (
        <p>Waiting for the conductor to select a song...</p>
      )}
      <>
        <h2>Lyrics:</h2>
        <pre>{lyrics || "No lyrics avaliable yet."}</pre>
      </>
    </>
  );
}
