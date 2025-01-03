// group page

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import socket from "../../../services/socket";

export default function GroupPage() {
  const { id } = useParams() as { id: string }; // reetrieve the group ID from the URL
  const [isCreator, setIsCreator] = useState(false);
  const [lyrics, setLyrics] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [artist, setArtist] = useState(""); // state for artist name

  useEffect(() => {
    //identify if the user is the creator (via localStorage or query param)
    setIsCreator(localStorage.getItem("isCreator") === id);
  }, [id]);

  const searchLyrics = async () => {
    console.log("query lyrics db");
    const response = await fetch(
      `/api/lyrics?query=${searchTerm}&artist=${artist}`
    );
    const data = await response.json();
    if (data.lyrics) {
      setLyrics(data.lyrics);

      // send lyrics to WebSocket server
      // Broadcast lyrics to all group members via WebSocket
      socket.emit("lyricsUpdate", { groupId: id, lyrics: data.lyrics });
      // use WebSocket to broadcast lyrics
    } else {
      alert("No lyrics found!");
    }
  };

  return (
    <>
      <h1>Group Code: {id}</h1>
      {isCreator && (
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
      )}
    </>
  );
}
