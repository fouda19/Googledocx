import React, { useState, useRef, useEffect } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css"; // Import Quill styles
import { useParams } from "react-router-dom";
let WebSock;
let oldContent = "";
let counter = 0;
let changesQueue = [];
let editor;
let docContent = "";
const Editor = () => {
  const quillRef = useRef(null);
  const { documentId } = useParams();
  const [docContent, setDocContent] = useState("");
  useEffect(() => {
    setupWebSocket();
    if (!quillRef.current) {
      editor = new Quill("#editor-container", {
        theme: "snow",
        placeholder: "Write something...",
      });
      quillRef.current = editor;
    }
    if (docContent) {
      console.log("DOC", docContent);
      editor.root.innerHTML = docContent;
    }
    
    if (quillRef.current) {
      const handleChange = function (delta, oldDelta, source) {
        console.log("DELTA", delta.ops);
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
          if (
            operation.attributes &&
            operation.attributes.hasOwnProperty("bold")
          ) {
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

      quillRef.current.on("text-change", handleChange);
      return () => {
        if (quillRef.current) {
          quillRef.current.off("text-change", handleChange);
        }
        if (WebSock && WebSock.readyState === WebSocket.OPEN) {
          WebSock.close();
          WebSock = null;
        }
      };
    }

    oldContent = "";
    return () => {
      if (WebSock && WebSock.readyState === WebSocket.OPEN) {
        WebSock.close();
      }
      if (editor) {
        editor.off("text-change");
        // editor.removeAllListeners();
        editor.destroy();
      }
    };
  }, [docContent]);
  function setupWebSocket() {
    console.log("Setting up websocket");
    const url = `ws://192.168.100.4:3001/editor/${documentId}`;
    WebSock = !WebSock ? new WebSocket(url) : WebSock;

    WebSock.onopen = function () {
      console.log("WebSocket connection established");
    };
    WebSock.onmessage = function (event) {
      console.log("Websocket message received");
      let JsonData = JSON.parse(event.data);
      console.log(JsonData, "JsonData");
      if (JsonData.type == "init") {
        // editor.root.innerHTML = JsonData.content;
        // if (quillRef.current != null) {
        //   quillRef.current.root.innerHTML = JsonData.content;
        // }
        // editor.root.innerHTML = JsonData.content;
        // quillRef.current = editor;
        setDocContent(JsonData.content);
        console.log("DOCzzzzzzz", docContent);
        console.log("JSON V ABL", counter);
        counter = JsonData.counter;
        console.log("JSON V B3d", counter);
      } else if (JsonData.type == "ack") {
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
          if (data.index > change.index) {
            data.index = data.index + 1;
          }
        });
        modifyCharInText(
          data.index,
          data.character,
          data.isDelete,
          data.isBold,
          data.isItalic,
          data.isInsert
        );
      }
      // const data = JSON.parse(event.data);
      // console.log("recieved", data);
      counter++;
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
    if (changes.length > 0) {
      console.log("changes", changes);
      if (WebSock.readyState === WebSocket.OPEN) {
        WebSock.send(JSON.stringify(changes[0]));
      } else {
        console.error("WebSocket connection is not open.");
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
