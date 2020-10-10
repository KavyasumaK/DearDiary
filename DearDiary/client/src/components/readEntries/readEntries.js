import React, { useMemo, useRef, useState } from "react";

import Classes from "./readEntries.module.css";
import useHTTP from "../../utils/apiCalls";
import LoadingIndicator from "../../UI/loading/LoadingIndicator";
import GetEntries from "./getEntries/getEntries";
import EditModal from "./editModal/editModal"; 

//Setting maximun date allowed in the date picker to today.
const getTodayDate = () => {
  let dateToday = new Date();
  const dd = String(dateToday.getDate()).padStart(2, "0");
  const mm = String(dateToday.getMonth() + 1).padStart(2, "0"); //January is 0!
  const yyyy = dateToday.getFullYear();
  return `${yyyy}-${mm}-${dd}`;
};

const ReadEntries = () => {
  const { data, error, isLoading, sendRequest } = useHTTP();
  const inputRef = useRef();
  let readEntryContent = "";

  //Setting state based on the date selected for filtering the entries.
  const [enteredFilter, setEnteredFilter] = useState("");

  //State for maintaing opening and closing of diary entries. State is added the values of entry ID and open is initally set to false
  const [myEntriesState, setMyEntries] = useState([]);

  //editMode state to show or not to show.
  const [showState, setShowState] = useState(false);
  const [modalElement, setModalElemet]=useState(null);
 
  useMemo(() => {
    let targetDate = new Date(enteredFilter);
    if(isNaN(targetDate)){
      sendRequest("/diaryentry/getmyentries", "GET")
    }else{
      sendRequest("/diaryentry/getmyentriesondate", "POST", {
        date: targetDate,
      });
    }    
  }, [sendRequest, enteredFilter]);

  //Toggling the "open" property of the state.setttings object
  const toggleCollapsibleContainer = (ID) => {
    setMyEntries((myEntriesState) => ({
      ...myEntriesState,
      settings: myEntriesState.settings.map((item) =>
        item.id === ID ? { ...item, open: !item.open } : item
      ),
    }));
  };

  //show edit modal
  const editModalHandler = (el)=>{
    setModalElemet(el);
    setShowState(true);
  }

  const updateEntry = (updatedEntry)=>{
    let {dear, entry} = updatedEntry;
    let privacy = updatedEntry.privateChecked?'private':'share';
    let ID=updatedEntry.id;
    if(!dear) dear = undefined;
    setShowState(false);
    sendRequest(`/diaryentry/updatemyentry/?id=${ID}`,'PATCH', {dear,entry,privacy});
  }

  const deleteEntry = (deleteConfirm, ID)=>{
    if(deleteConfirm && deleteConfirm.toUpperCase()==='DELETE'){
      setShowState(false);
      sendRequest(`/diaryentry/deletemyentry/?id=${ID}`,'DELETE')
    }
  }

  //Inital setting of state only when the data becomes available from the API call.
  useMemo(() => {
    if (data) {
      let newEntryArray = [];
      if (data.myEntries) {
        data.myEntries.forEach((element) => {
          newEntryArray.push({ id: element._id, open: false });
        });
      }
      setMyEntries({ settings: newEntryArray });
    }
  }, [data]);

  if (error) console.log(error);
  if (isLoading) readEntryContent = <LoadingIndicator />;

  return (
    <>
    <EditModal show={showState} elem={modalElement} updateEntry={updateEntry} deleteEntry={deleteEntry} closeModal={()=>setShowState(false)}/>
    <div className={Classes.ReadEntries}>
      <label className={Classes.DatePick}>
        Search by Date:{" "}
        <input
          ref={inputRef}
          type="date"
          min="2020-09-12"
          max={getTodayDate()}
          onChange={(evt) => setEnteredFilter(evt.target.value)}
        />
      </label>
      {readEntryContent}
      <GetEntries
        myEntriesState={myEntriesState}
        data={data}
        clicked={toggleCollapsibleContainer}
        updateClicked={editModalHandler}
      />
      <div>{error}</div>
    </div>
    </>
  );
};

export default ReadEntries;
