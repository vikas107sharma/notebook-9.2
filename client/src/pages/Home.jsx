import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";
import NoteCard from "../components/NoteCard";
import "./homestyle.css";
import Filter from "../components/Filter";
import { BackDropLoader } from "../utils/Loaders";

const Home = () => {
  const [notes, setNotes] = useState([]);
  const [savedNotes, setSavedNotes] = useState([]);
  const [checkingSavedNotes, setCheckingSavedNotes] = useState(false);
  const [cookies, setCookies] = useCookies(["access_token"]);
  const userID = window.localStorage.getItem("userID");
  // const [usr, setUsr] = useState("");
  const [active, setActive] = useState("");
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [statusOK, setSOK] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:3000/notes/getnotes").then((response) => {
      setNotes(response.data);
      if(response.status===200){
        setSOK(true);
        console.log("status ", response)
      }
    });

    const fetchData = async () => {
      setCheckingSavedNotes(true);
      const response = await axios.get(
        `http://localhost:3000/auth/savednotes/${userID}`
      );

      let savedID = response.data.map((d) => {
        return d["_id"];
      });
      await setSavedNotes(savedID);
      await setCheckingSavedNotes(false);
    };

    // const getu = async () => {
    //   const res = await axios.get(
    //     `http://localhost:3000/auth/getuserbyid/${userID}`
    //   );
    //   const userNam = res.data.username.split("@");
    //   // console.log(userNam);
    //   setUsr(userNam[0]);
    // };

    if (cookies.access_token) {
      fetchData();
      // getu();
    }
  }, []);

  const chooseTag = (s) => {
    setActive(s.id);
    filtereNotes(s.id);
  };

  const filtereNotes = (tag) => {
    const fn = notes.filter((note) => note.tag === tag);
    setFilteredNotes(fn);
  };

  const returnToAll = () => {
    setFilteredNotes([]);
    setActive("");
  };

  return (
    <>
      <div className="flex mt-2">
        <Filter
          // usr={usr}
          filteredNotes={filteredNotes}
          chooseTag={chooseTag}
          returnToAll={returnToAll}
          active={active}
        />

        <div className="lg:ml-[280px] ml-[120px]">
          {filteredNotes.length > 0 && (
            <>
              <h1 onClick={returnToAll} className="text-purple-800 text-center">
                Return back to all....
              </h1>
              {filteredNotes.map((note) => {
                return (
                  <NoteCard
                    key={note._id}
                    saved={savedNotes.includes(note._id) ? true : false}
                    note={note}
                  />
                );
              })}
            </>
          )}
          {filteredNotes.length < 1 && (
            <>
              {((notes.length < 1 || checkingSavedNotes) && !statusOK) && (
                <p>Loading...</p>
              )}
              {(notes.length < 1 && statusOK) && (
                <p>Note is empty</p>
              )}
              {notes.length > 0 && !checkingSavedNotes && (
                <>
                  {notes.map((note) => {
                    return (
                      <NoteCard
                        key={note._id}
                        saved={savedNotes.includes(note._id) ? true : false}
                        note={note}
                      />
                    );
                  })}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
