// import Button from "@material-tailwind/react/Button";
// import Icon from "@material-tailwind/react/Icon";

import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Icon } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import React from "react";
import Typography from "@mui/material/Typography";
import ArticleIcon from "@mui/icons-material/Article";
import { useState } from "react";
import Modal from "./popup";
import SharePop from "./sharePop";
import { useMutation } from "react-query";
import { postRequest } from "../API/API";
import { useNavigate } from "react-router-dom";
import moment from "moment";
function DocsCard(props) {
  const date = moment(props.date, "ddd MMM DD HH:mm:ss zzz YYYY");
  const [popUp, setPopUp] = useState(false);
  const [sharePop, setSharePop] = useState(false);
  const [newFilename, setNewFilename] = useState("");
  const [filename, setFilename] = useState(props.fileName);
  const [error, setError] = useState("");

  const [anchorEl, setAnchorEl] = React.useState(null);
  const renameReq = useMutation((data) =>
    postRequest(`/backend/documents/rename/${newFilename}`, data)
  );
  const deleteReq = useMutation(
    (data) => postRequest("/backend/documents/delete", data),
    {
      onSuccess: () => {
        props.refetch();
      },
    }
  );
  const navigate = useNavigate();
  const handleClick = (event) => {
    console.log("clicked");
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    console.log("deleting");
    deleteReq.mutate(props.id, {
      onSuccess: () => {},
    });

    handleClose();
  };

  const handleRename = () => {
    console.log("renaming");
    if (newFilename.trim() === "") {
      // alert("Please enter text before saving.");
      setError("Please enter text before renaming.");
      return;
    }
    renameReq.mutate(
      props.id,

      {
        onSuccess: () => {
          setPopUp(false);
          setFilename(newFilename);
          setNewFilename("");
        },
      }
    );

    setPopUp(true);
    handleClose();
  };

  const handleShare = () => {
    setSharePop(true);
    handleClose();
  };
  return (
    <div
      className="flex items-center py-4 rounded-lg hover:cursor-pointer hover:bg-gray-100 text-gray-700 text-sm"
      onClick={() => navigate(`/texteditor/${props.id}`)}
    >
      {/* <Icon name="article" size="3xl" color="blue" /> */}
      <ArticleIcon color="primary" />
      <p className="flex-grow pl-5 w-10 pr-10 truncate">{filename}</p>
      <p className="flex-grow pl-5 w-10 pr-10 truncate">{props.owner}</p>
      <p className="pr-12 text-sm italic">{date.format("DD/MM/YYYY")}</p>
      {props.isViewer && !props.isEditor && !props.isOwner ? (
        <IconButton style={{ pointerEvents: "none" }}>
          <MoreVertIcon
            style={{ visibility: "hidden", pointerEvents: "none" }}
          />
        </IconButton>
      ) : (
        <IconButton
          onClick={(e) => {
            handleClick(e);
            e.stopPropagation();
          }}
        >
          <MoreVertIcon />
        </IconButton>
      )}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {(props.isOwner || props.isEditor) && (
          <MenuItem
            onClick={(e) => {
              setPopUp(true);
              handleClose();
              e.stopPropagation();
            }}
          >
            Rename
          </MenuItem>
        )}
        {props.isOwner && (
          <MenuItem
            onClick={(e) => {
              handleDelete();
              e.stopPropagation();
            }}
          >
            Delete
          </MenuItem>
        )}
        {props.isOwner && (
          <MenuItem
            onClick={(e) => {
              handleShare();
              e.stopPropagation();
            }}
          >
            Share
          </MenuItem>
        )}
      </Menu>

      {popUp && (
        <Modal
          open={popUp}
          setOpen={setPopUp}
          type={1}
          message={"Rename the document"}
          error={error}
          handleClick={handleRename}
          handleInputChange={(e) => {
            setNewFilename(e.target.value);
            setError("");
          }}
          input={newFilename}
        />
      )}
      {sharePop && (
        <SharePop open={sharePop} setOpen={setSharePop} id={props.id} />
      )}
    </div>
  );
}

export default DocsCard;
