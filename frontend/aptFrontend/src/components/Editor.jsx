import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { fetchRequest, postRequest } from "../API/API";
import { useParams } from "react-router-dom";
let WebSock;
const Editor = () => {
  const [editorHtml, setEditorHtml] = useState("");
  const { documentId } = useParams();

  // let WebSock = new WebSock(`ws://192.168.100.4:4004/editor/${documentId}`);
  // let webSocket; // Declare the WebSocket object outside the useEffect hook

  useEffect(() => {
    configureWebSock(); // Open the WebSocket connection
    // return () => {
    //   WebSock.close(); // Close the WebSocket connection
    // };
  }, []);

  const configureWebSock = () => {
    const url = `ws://192.168.100.4:3001/editor/${documentId}`;
    WebSock = !WebSock ? new WebSocket(url) : WebSock;
    WebSock.onopen = () => {
      console.log("Websocket connected");
    };
    WebSock.onmessage = (event) => {
      console.log(event.data, "event.data");
      console.log("Websocket message received");
      let JsonData = JSON.parse(event.data);
      console.log(JsonData, "JsonData");
      if (JsonData.type == "init") {
        setEditorHtml(JsonData.content);
      } else {
        setEditorHtml(editorHtml + event.data); //CHECK
      }
    };
    WebSock.onclose = (event) => {
      console.log("Websocket closed", event);
    };
    WebSock.onerror = (error) => {
      console.log("WebSocket error: ", error);
    };
  };
  // WebSock.onopen = () => {
  //   console.log("WebSock connected");
  // };
  // const { data, isLoading, isError } = useQuery(
  //   ["editor", documentId],
  //   () => {
  //     fetchRequest(`/backend/documents/${documentId}`);
  //   },
  //   {
  //     onSuccess: (data) => {
  //       setEditorHtml(data.text);
  //     },
  //   }
  // );
  // const postReq = useMutation(postRequest);

  // const handleEditorChange = (html) => {
  //   console.log(html, "html");
  //   setEditorHtml(html);
  //   postReq.mutate(`/backend/documents/${documentId}`, { text: html });
  // };

  return (
    <>
      <div className="flex flex-col h-[calc(94vh-var(--navbar-height))]">
        <div className="w-full sm:w-full md:w-full lg:w-full xl:w-full h-[calc(94vh-var(--navbar-height))]">
          <ReactQuill
            theme="snow"
            value={editorHtml}
            className="w-full mb-4 h-[calc(94vh-var(--navbar-height))]"
            placeholder="Text (optional) "
          />
        </div>
      </div>
    </>
  );
};

export default Editor;
