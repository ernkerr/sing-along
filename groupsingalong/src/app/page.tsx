// default route
// landing page

"use client";
// useRouter is a hook that only works in a client component
// we need to mark the file with the use client directive

import { useRouter } from "next/navigation";
import { generateRandomString } from "../utils/randomstr";

export default function LandingPage() {
  // initialize router
  const router = useRouter();

  // function to create a new group
  const createGroup = () => {
    const groupId = generateRandomString();
    router.push(`/group/${groupId}`);
    // localStorage.setItem("isCreator", groupId); // Mark this user as the creator
    localStorage.setItem("isConductor", "true"); // Mark this user as the conductor
  };

  // function for users to join a group
  const joinGroup = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // prevents reload of page.. I think?
    const groupId = (
      e.currentTarget.elements.namedItem("code") as HTMLInputElement
    ).value.trim();
    console.log("groupId entered: ", groupId);
    if (groupId) {
      router.push(`/group/${groupId}`);
    } else {
      console.log("error: groupId not valid ");
    } // TODO handle this better
  };

  return (
    <>
      <h1>Group Sing Along</h1>
      <button onClick={createGroup}>Create Group</button>
      <form onSubmit={joinGroup}>
        <input
          type="text"
          name="code"
          placeholder="Enter Group Code"
          required
        />
        <button type="submit">Join a Group</button>
      </form>
    </>
  );
}
