import React, { useState, useRef, useEffect } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css"; // Import Quill styles
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { fetchRequest } from "../API/API";
let WebSock;
let oldContent = "";
let counter = 0;
let changesQueue = [];
let flag = false;
const Editor = (props) => {
  const quillRef = useRef(null);
  const { documentId } = useParams();
  const [canEdit, setCanEdit] = useState(false);
  useQuery(
    "permissions",
    () => fetchRequest(`/backend/documents/getPermissions/${documentId}`),
    {
      onSuccess: (data) => {
        console.log("data", data);
        setCanEdit(data.data);
      },
      // onError: (error) => {
      //   console.log("error", error);

      // }
    }
  );
  const handleChange = function (delta, oldDelta, source) {
    // Delta is the change in the text
    // OldDelta is the old text
    // Source is the source of the change

    let isDelete = false;
    let isInsert = false;
    let isBold = false;
    let isItalic = false;
    let currentIndex = 0;
    delta.ops.forEach((operation) => {
      if (operation.delete) {
        isDelete = true;
      }
      if (operation.retain && !operation.attributes) {
        currentIndex += operation.retain;
      }
      if (operation.insert) {
        isInsert = true;
      }
      if (operation.attributes && operation.attributes.hasOwnProperty("bold")) {
        const boldValue = operation.attributes.bold;
        if (boldValue == true) {
          isBold = true;
        } else if (boldValue == false) {
          isBold = false;
        } else {
          isBold = null;
        }
      }
      if (
        operation.attributes &&
        operation.attributes.hasOwnProperty("italic")
      ) {
        const val = operation.attributes.italic;
        if (val == true) {
          isItalic = true;
        } else if (val == false) {
          isItalic = false;
        } else {
          isItalic = null;
        }
      }
    });
    if (source == "user" && source != "api") {
      handleTextChange(isDelete, isBold, isItalic, isInsert, currentIndex);
      oldContent = quillRef.current.root.innerHTML;
    }
  };
  useEffect(() => {
    flag = false;
    console.log("dkhlt");
    if (!quillRef.current) {
      setupWebSocket();
      console.log("Creating new Quill instance");
      quillRef.current = new Quill("#editor-container", {
        theme: "snow",
        // placeholder: "",
      });
      quillRef.current.on("text-change", handleChange);
    }

    oldContent = "";
    return () => {
      if (WebSock && WebSock.readyState === WebSocket.OPEN) {
        console.log("ba2fel");
        WebSock.close();
        WebSock = null;
      }
    };
  }, []);
  useEffect(() => {
    if (!canEdit) {
      quillRef.current.disable();
    } else {
      quillRef.current.enable();
    }
  }, [canEdit]);
  function setupWebSocket() {
    console.log("Setting up websocket");
    const url = `ws://localhost:3001/editor/${documentId}`;
    WebSock = !WebSock ? new WebSocket(url) : WebSock;
    console.log(WebSock, "WebSock");
    WebSock.onopen = function () {
      console.log("WebSocket connection established");
    };
    WebSock.onmessage = function (event) {
      console.log("Websocket message received");
      let JsonData = JSON.parse(event.data);

      console.log(JsonData, "JsonData");
      counter = JsonData.counter;
      console.log(counter, "counter");

      if (JsonData.type == "init") {
        if (JsonData.content != null) {
          if (JsonData.content == "") {
            flag = true;
          }
          JsonData.content = "<p>" + JsonData.content + "</p>";
          quillRef.current.root.innerHTML = JsonData.content;
        }
        // quillRef.current.root.innerHTML = JsonData.content;
        counter = JsonData.counter;
      } else if (JsonData.type !== "ack") {
        changesQueue = changesQueue.filter((change) => {
          return !(
            change.index == JsonData.index &&
            change.character == JsonData.character &&
            change.isDelete == JsonData.isDelete &&
            change.isBold == JsonData.isBold &&
            change.isItalic == JsonData.isItalic &&
            change.isInsert == JsonData.isInsert
          );
        });
      } else {
        changesQueue.forEach(function (change) {
          if (JsonData.index > change.index) {
            JsonData.index = JsonData.index + 1;
          }
        });
        modifyCharInText(
          JsonData.index,
          JsonData.character,
          JsonData.isDelete,
          JsonData.isBold,
          JsonData.isItalic,
          JsonData.isInsert
        );
      }
      // const data = JSON.parse(event.data);
      // console.log("recieved", data);
      // counter++;

      oldContent = quillRef.current.root.innerHTML;
    };

    WebSock.onclose = function (event) {
      console.log("WebSocket connection closed");
    };
  }

  function modifyCharInText(
    index,
    character,
    isDelete,
    isBold,
    isItalic,
    isInsert
  ) {
    console.log("HII", isBold);

    if (isBold == null) {
      quillRef.current.formatText(index, 1, "bold", false);
    } else if (isItalic == null) {
      quillRef.current.formatText(index, 1, "italic", false);
    } else if (isBold && !isInsert) {
      quillRef.current.formatText(index, 1, "bold", true);
    } else if (isItalic && !isInsert) {
      quillRef.current.formatText(index, 1, "italic", true);
    } else {
      let text = quillRef.current.root.innerHTML.replace(/<\/?[^>]+(>|$)/g, "");
      let length = text.length;
      let formatsArray = [];
      for (let i = 0; i < length; i++) {
        formatsArray.push({
          char: text[i],
          format: quillRef.current.getFormat(i, 1),
        });
      }
      if (isDelete) {
        text = text.slice(0, index) + text.slice(index + 1);
        formatsArray.splice(index, 1);
      } else {
        text = text.slice(0, index) + character + text.slice(index);
        formatsArray.splice(index, 0, {
          format: { italic: isItalic, bold: isBold },
        });
      }
      quillRef.current.setText(text, "api");
      length = text.length;
      for (let i = 0; i < length; i++) {
        quillRef.current.formatText(i, 1, formatsArray[i].format);
      }
    }

    // Set the cursor position to the end of the editor
    quillRef.current.setSelection(index + 1);
  }

  function findChanges(isDelete, isBold, isItalic, isInsert, currentIndex) {
    // const quill = quillRef.current.getEditor();
    const newContent = quillRef.current.root.innerHTML;
    const strippedOldContent = oldContent.replace(/<\/?[^>]+(>|$)/g, ""); //mal
    const strippedNewContent = newContent.replace(/<\/?[^>]+(>|$)/g, ""); //ml
    let character = strippedNewContent[currentIndex]; //abc
    if (currentIndex >= strippedNewContent.length)
      character = strippedOldContent[currentIndex];
    let changes = [];
    changes.push({
      index: currentIndex,
      character,
      isDelete,
      isAck: false,
      isBold,
      isItalic,
      isInsert,
      counter,
    });
    oldContent = quillRef.current.root.innerHTML;
    return changes;
  }

  function handleTextChange(
    isDelete,
    isBold,
    isItalic,
    isInsert,
    currentIndex
  ) {
    const changes = findChanges(
      isDelete,
      isBold,
      isItalic,
      isInsert,
      currentIndex
    );
    //CHANGE
    // if (!flag) {
    //   return;
    // }
    console.log("flag", flag);
    console.log("CHANGED", changes);
    console.log("RANA", WebSock.readyState === WebSocket.OPEN);
    if (
      changes.length > 0 &&
      changes[0].character != null &&
      changes[0].character != "undefined"
    ) {
      console.log(WebSock, "WebSock");
      if (WebSock.readyState === WebSocket.OPEN && flag) {
        console.log("changes", changes);
        WebSock.send(JSON.stringify(changes[0]));
      } else {
        flag = true;
        console.log("flag", flag);
      }

      changesQueue.push(changes[0]);
    }
  }

  return (
    <>
      <div className="flex flex-col mx-10 w-full" id="editor-container"></div>
    </>
  );
};

export default Editor;
