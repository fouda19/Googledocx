import React, { useState, useRef, useEffect } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css"; // Import Quill styles
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { fetchRequest } from "../API/API";
const Editor = () => {
  let WebSock;
  let prevCont = "";
  let counter = 0;
  let qChanges = [];
  let flag = false;
  const quillRef = useRef(null);
  const { documentId } = useParams();
  const [canEdit, setCanEdit] = useState(true);
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

  useEffect(() => {
    flag = false;
    console.log("dkhlt");
    if (!quillRef.current) {
      setupWebSocket();
      console.log("Creating new Quill instance");
      quillRef.current = new Quill("#editor", {
        theme: "snow",
        // placeholder: "",
      });
      quillRef.current.on("text-change", handleChange);
    }

    prevCont = "";
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

  const handleChange = function (delta, oldDelta, source) {
    let isDelete = false;
    let isInsert = false;
    let isBold = false;
    let isItalic = false;
    let currentIndex = 0;
    delta.ops.forEach((op) => {
      if (op.insert) {
        isInsert = true;
      }
      if (op.retain && !op.attributes) {
        currentIndex = currentIndex + op.retain;
      }
      if (op.delete) {
        isDelete = true;
      }
      if (op.attributes && op.attributes.hasOwnProperty("bold")) {
        if (op.attributes.bold == true) {
          isBold = true;
        } else if (op.attributes.bold == false) {
          isBold = false;
        } else {
          isBold = null;
        }
      }
      if (op.attributes && op.attributes.hasOwnProperty("italic")) {
        if (op.attributes.italic == true) {
          isItalic = true;
        } else if (op.attributes.italic == false) {
          isItalic = false;
        } else {
          isItalic = null;
        }
      }
    });

    if (source == "user" && source != "api") {
      sendLastMessInQ(isDelete, isBold, isItalic, isInsert, currentIndex);
      prevCont = quillRef.current.root.innerHTML;
    }
  };

  function setupWebSocket() {
    console.log("Setting up websocket");
    const url = `ws://172.20.10.3:3001/editor/${documentId}`;
    WebSock = !WebSock ? new WebSocket(url) : WebSock;
    console.log(WebSock, "WebSock");
    WebSock.onopen = function () {
      console.log("WebSocket connection established");
    };
    WebSock.onmessage = function (event) {
      console.log("Websocket message received");
      let JsonData = JSON.parse(event.data);
      JsonData.index = parseInt(JsonData.index, 10);
      // JsonData.character = JsonData.character.toString();
      JsonData.isDelete = JsonData.isDelete == "true";
      JsonData.isBold = JsonData.isBold == "true";
      JsonData.isItalic = JsonData.isItalic == "true";
      JsonData.isInsert = JsonData.isInsert == "true";
      JsonData.counter = parseInt(JsonData.counter, 10);
      console.log(JsonData, "JsonData");
      // counter = JsonData.counter;
      //EHTAMAL KARSA
      console.log(counter, "counter");

      if (JsonData.type == "init") {
        if (JsonData.content != null) {
          if (JsonData.content == "") {
            flag = true;
          }
          JsonData.content = "<p>" + JsonData.content + "</p>";
          quillRef.current.root.innerHTML = JsonData.content;
        }
        if (JsonData.content == null) {
          let tmpContent = "<p></p>";
          quillRef.current.root.innerHTML = tmpContent;
        }
        // quillRef.current.root.innerHTML = JsonData.content;
        counter = JsonData.counter - 1;
      } else if (JsonData.type == "ack") {
        qChanges = qChanges.filter((qch) => {
          return (
            qch.isDelete != JsonData.isDelete ||
            qch.character != JsonData.character ||
            qch.isItalic != JsonData.isItalic ||
            qch.isBold != JsonData.isBold ||
            qch.index != JsonData.index ||
            qch.isInsert != JsonData.isInsert
          );
        });
      } else {
        qChanges.forEach(function (change) {
          if (JsonData.index <= change.index) {
            change.index = change.index + 1;
          }
        });
        settingCharWithStyles(
          JsonData.index,
          JsonData.character,
          JsonData.isDelete,
          JsonData.isBold,
          JsonData.isItalic,
          JsonData.isInsert
        );
      }

      counter++;
      prevCont = quillRef.current.root.innerHTML;
    };

    WebSock.onclose = function (event) {
      console.log("WebSocket connection closed");
    };
  }

  function settingCharWithStyles(
    index,
    character,
    isDelete,
    isBold,
    isItalic,
    isInsert
  ) {
    if (isItalic == null) {
      quillRef.current.formatText(index, 1, "italic", false);
    } else if (isBold == null) {
      quillRef.current.formatText(index, 1, "bold", false);
    } else if (isItalic && !isInsert) {
      quillRef.current.formatText(index, 1, "italic", true);
    } else if (isBold && !isInsert) {
      quillRef.current.formatText(index, 1, "bold", true);
    } else {
      let text = quillRef.current.root.innerHTML.replace(/<\/?[^>]+(>|$)/g, "");
      console.log("textt", text);
      let stylingArr = [];
      let length = text.length;
      for (let i = 0; i < length; i++) {
        console.log("format", quillRef.current.getFormat(i, 1));
        stylingArr.push({
          format: quillRef.current.getFormat(i, 1),
          char: text[i],
        });
      }
      console.log("isdelete", isDelete);
      if (isInsert) {
        console.log(character, "character");
        console.log("indexgowa", index);
        text = text.slice(0, index) + character + text.slice(index);
        console.log(isItalic, isBold, "isItalic, isBold");
        stylingArr.splice(index, 0, {
          format: { italic: isItalic, bold: isBold },
        });
      }
      if (isDelete) {
        text = text.slice(0, index) + text.slice(index + 1);
        stylingArr.splice(index, 1);
      }
      console.log("settext", text);
      quillRef.current.setText(text, "api");

      for (let i = 0; i < text.length; i++) {
        quillRef.current.formatText(i, 1, stylingArr[i].format);
      }
    }

    let length = quillRef.current.getLength();
    // let range = quill.getSelection();
    // console.log("range", range.index);
    quillRef.current.setSelection(length, length);
    // quillRef.current.setSelection(index + 1); //setCurs
  }

  function getChangeWithStyling(
    isDelete,
    isBold,
    isItalic,
    isInsert,
    currentIndex
  ) {
    const newContent = quillRef.current.root.innerHTML;
    const newContentWithoutTags = newContent.replace(/<\/?[^>]+(>|$)/g, "");
    let character = newContentWithoutTags[currentIndex];
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
    prevCont = quillRef.current.root.innerHTML;
    return changes;
  }

  function sendLastMessInQ(isDelete, isBold, isItalic, isInsert, currentIndex) {
    const newChanges = getChangeWithStyling(
      isDelete,
      isBold,
      isItalic,
      isInsert,
      currentIndex
    );

    if (newChanges.length > 0) {
      console.log(WebSock, "WebSock");
      if (WebSock.readyState === WebSocket.OPEN && flag) {
        WebSock.send(JSON.stringify(newChanges[0]));
        qChanges.push(newChanges[0]);
      } else {
        flag = true;
        console.log("flag", flag);
      }
    }
  }

  return (
    <>
      <div className="flex flex-col w-full" id="editor"></div>
    </>
  );
};

export default Editor;
