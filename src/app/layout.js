"use client"

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Head from "./coms/head";
import Loading from "./loading";
import { createContext, useEffect, useState } from "react";
import { db } from "./firebase/firebase_confage";
import { collection, onSnapshot } from "firebase/firestore"
import {encode, decode} from "@/app/sign_up/replacer"
/*
export const metadata = {
  title: "Funny Chat",
  description: "Funny Chat is a chat app that allows you to chat with your friends",
};*/

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const UseUser = createContext(null);

export default function RootLayout({ children }) {
  const [user, setUser] = useState({
    userOk: false,
    userName: "o",
    userNum: 0,
    score: 100,
    userPhoto: " ",
    mode: false,
    userFriends: [],
  });

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
      const fetchedUsers = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setUsers(fetchedUsers);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (users.length === 0) return;

    const loginWithToken = () => {
      setLoading(true);
      if(localStorage.getItem("user_token") === null  ){
        setLoading(false);
        return;
      }
      // //(localStorage.getItem("user_token"))
      const userDataToken1 = localStorage.getItem("user_token");
      const userDataToken = decode(userDataToken1);
      // //(userDataToken,"yy")
      if (!userDataToken) {
        setLoading(false);
        return;
      }

      const tokenParts = userDataToken.split("UT-5");
      //(tokenParts)

      const foundUser = users.find(
        (user) => user.userNum == tokenParts[0] && user.password == tokenParts[1]
      );

      if (foundUser) {
        setUser({ ...foundUser, userOk: true });
      } else {
        alert("User not found");
      }

      setLoading(false);
    };

    loginWithToken();
  }, [users]);

  return (
    <html lang="en">
      <head>
      <meta property="og:image" content="/share.jpg"/>
      <link rel="icon" type="image/png" href = "./funny messages.png" />
        <title>funny chat</title>
        {/* <link ref={"icon"} href="./funny messages.png"/> */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="funny chat" />
        <meta property="og:description" content="Funny Chat is a chat app that allows you to chat with your / my friends with emojis and stickers"/>
        <meta property="og:image" content="/share.jpg" />
        
        {/* <meta name="description" content="Funny Chat is a chat app that allows you to chat with your / my friends with emojis and stickers and funny // some key words => chat , chats , fun , funny , funny chat , sfunny chats , funny chat app , funny chat app for android , funny chat app for ios , funny chat app for windows , funny chat app for mac , funny chat app for linux , funny chat app for web , funny chat app for mobile , funny chat app for tablet , funny chat app for desktop , chat with friends , chat with friends app , chat with friends app for android , chat with friends app for ios , chat by stickers " /> */}
      </head>
      <UseUser.Provider value={{ user, setUser }}>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <Head />
          {loading ? <Loading /> : children}
        </body>
      </UseUser.Provider>
    </html>
  );
}
