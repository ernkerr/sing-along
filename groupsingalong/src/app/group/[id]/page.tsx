// group page

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Pusher from "pusher-js";

// Define the structure of the search result based on the new data
interface SearchResult {
  display: string;
  artist: string;
  title: string;
}

export default function GroupPage() {
  const { id } = useParams() as { id: string }; // retrieve the group ID from the URL
  const [isConductor, setIsConductor] = useState(false); // determine if the user is the coductor/creator or if they are a singer
  const [lyrics, setLyrics] = useState(""); // state to hold the current lyrics
  const [searchTerm, setSearchTerm] = useState(""); // state for song name search
  // const [searchResults, setSearchResults] = useState([]); // store search results from Deezer
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]); // Store search results with correct type

  // identify if the user is the conductor
  useEffect(() => {
    // check if the user is marked as the conductor in local storage
    setIsConductor(localStorage.getItem("isConductor") === "true");
  }, []);

  useEffect(() => {
    // initialize pusher
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY as string, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER as string,
    });
    //
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
  }, [id]);

  // Search for songs using Deezer API
  //   const searchSong = async () => {
  //     try {
  //       console.log("Searching for song:", searchTerm);
  //       const response = await fetch(
  //         `https://api.deezer.com/search?q=${encodeURIComponent(searchTerm)}`
  //       );
  //       const result = await response.json();
  //       console.log("Deezer API response:", result); // Log Deezer response

  //       if (result.data) {
  //         // map the results to match the desired structure
  //         const formattedResults = result.data.map((item) => {
  //           console.log("Mapping item:", item); // Log each item being mapped
  //           return {
  //             display: `${item.title} - ${item.artist.name}`,
  //             artist: item.artist.name,
  //             title: item.title,
  //           };
  //         });
  //         setSearchResults(formattedResults); // set search results
  //       } else {
  //         setSearchResults([]);
  //         alert("No results found");
  //       }
  //     } catch (error) {
  //       console.error("Error searching songs: ", error);
  //     }
  //   };

  // maybe ngrok

  const searchSong = async () => {
    // Hardcoded search result
    const hardcodedResult = [
      {
        display: "Hello - Adele",
        artist: "Adele",
        title: "Hello",
      },
    ];

    // Set the hardcoded search results
    setSearchResults(hardcodedResult);

    console.log("Hardcoded search results:", hardcodedResult);
  };

  // Fetch lyrics using Lyrics.ovh API
  const fetchLyrics = async (title: string, artist: string) => {
    try {
      const response = await fetch(
        `https://api.lyrics.ovh/v1/${encodeURIComponent(
          artist
        )}/${encodeURIComponent(title)}`
      );
      const data = await response.json();

      if (data.lyrics) {
        setLyrics(data.lyrics); // Update local lyrics state
        console.log("lyrics have been set for: ", title);

        // Broadcast lyrics to all group members via Pusher
        const pusherResponse = await fetch("/api/pusher", {
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

        console.log("Pusher request body:", {
          channel: `group-lyrics-${id}`,
          event: "lyrics-update",
          data: { lyrics: data.lyrics },
        });

        if (!pusherResponse.ok) {
          console.error("Pusher response error:", await pusherResponse.text());
          alert("Failed to broadcast lyrics!");
        }
      } else {
        alert("No lyrics found");
      }
    } catch (error) {
      console.error("Error fetching lyrics: ", error);
    }
  };

  return (
    <>
      <h1>Group Code: {id}</h1>
      {isConductor ? (
        <>
          {/* search input */}
          {/* <div className="search">
            <input
              type="text"
              name="song"
              className="search-song"
              //   autofocus="autofocus"
              placeholder="Pick a song"
              id="search-input"
            />
            <ul className="results" id="results"></ul>
          </div> */}
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for a song"
          />
          <button onClick={searchSong}>Search</button>
          {/* display the search results  */}
          {searchResults.length > 0 && (
            <>
              <ul>
                {searchResults.map((result, index) => (
                  <li
                    key={index}
                    onClick={() => fetchLyrics(result.title, result.artist)}
                  >
                    {result.display}
                  </li>
                ))}
              </ul>
            </>
          )}

          <div>
            <h2>Lyrics:</h2>
            {/* <p>{lyrics}</p> */}
            <pre>{lyrics || "No lyrics available yet."}</pre>
          </div>
        </>
      ) : (
        <p>Waiting for the conductor to select a song...</p>
      )}
      {/* <>
        <h2>Lyrics:</h2>
        <pre>{lyrics || "No lyrics avaliable yet."}</pre>
      </> */}
    </>
  );
}
