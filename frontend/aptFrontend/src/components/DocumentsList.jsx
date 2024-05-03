import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Icon } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import React from "react";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import DocsCard from "./documentCard";
import Modal from "./popup";
import PopUp from "./popup";
import { Box } from "@mui/material";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

const owndedocslist = [
  {
    id: "1",
    filename: "file1.docx",
    date: new Date("2016-05-02"),
    owner: "me",
    editorList: ["fouda", "mido"],
    viewerList: ["ahmed", "khaled"],
  },
  {
    id: "2",
    filename: "file2.docx",
    date: new Date("2016-05-03"),
    owner: "me",
    editorList: ["fouda", "mido"],
    viewerList: ["ahmed", " khaled"],
  },
  {
    id: "3",
    filename: "file3.docx",
    date: new Date("2016-05-04"),
    owner: "me",
    editorList: ["fouda", " mido"],
    viewerList: ["ahmed", "khaled"],
  },
  {
    id: "4",
    filename: "file4.docx",
    date: new Date("2016-05-05"),
    owner: "me",
    editorList: ["fouda", "mido"],
    viewerList: ["ahmed", "khaled"],
  },
  {
    id: "5",
    filename: "file5.docx",
    date: new Date("2016-05-06"),
    owner: "me",
    editorList: ["fouda", "mido"],
    viewerList: ["ahmed", "khaled"],
  },
];
const notowneddocs = [
  {
    id: "1",
    filename: "hagatanya.docx",
    date: new Date("2016-05-02"),
    owner: "Mido",
    editorList: ["me", "fouda"],
    viewerList: ["ahmed", "khaled"],
  },
  {
    id: "2",
    filename: "file2.docx",
    date: new Date("2016-05-03"),
    owner: "Fouda",
    editorList: ["mido"],
    viewerList: ["ahmed", "me"],
  },
  {
    id: "3",
    filename: "file3.docx",
    date: new Date("2016-05-04"),
    owner: "Mido",
    editorList: ["fouda", "me"],
    viewerList: ["ahmed", "khaled"],
  },
  {
    id: "4",
    filename: "hagatanya.docx",
    date: new Date("2016-05-05"),
    owner: "Fouda",
    editorList: ["mido"],
    viewerList: ["ahmed", "me"],
  },
  {
    id: "5",
    filename: "hagatanya.docx",
    date: new Date("2016-05-06"),
    owner: "Mido",
    editorList: ["fouda", "me"],
    viewerList: ["ahmed", " khaled"],
  },
];
const allDocs = owndedocslist.concat(notowneddocs);

function Doclist() {
  const [sortby, setsort] = useState("Owned by me");
  const [open, setOpen] = useState(true);
  const [popUp, setPopUp] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (event) => {
    console.log("clicked");
    setAnchorEl(event.currentTarget);
  };
  const handleMenuItemClick = (sortType) => {
    // Update state based on the sortType
    // For example: setSort(sortType);
    setsort(sortType);
    // Close the menu
    handleClose();
  };
  const handleButtonClick = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <div className="flex justify-center">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          onClick={() => setPopUp(true)}
        >
          Add New Document
        </button>
      </div>
      {popUp && (
        <Modal
          open={popUp}
          setOpen={setPopUp}
          type={0}
          message={"Enter New Document Name"}
        />
      )}
      <section className="bg-white px-10 md:px-0">
        <div className="max-w-3xl mx-auto py-8 text-sm text-gray-700">
          <div className="flex items-center justify-between pb-5 border-b-2 border-gray-200">
            <h2 className="font-medium">Recent documents</h2>
            {/* <div display="flex" justifyContent="center" alignItems="center">
              <IconButton onClick={handleClick}>
                <Typography variant="body1">{sortby}</Typography> ArrowDownwardIcon
              </IconButton>
            </div> */}
            <Box display="flex" alignItems="center">
              <Typography variant="body1">{sortby}</Typography>
              <IconButton onClick={handleClick}>
                <ArrowDownwardIcon />
              </IconButton>
            </Box>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={() => handleMenuItemClick("Owned by me")}>
                Owned by me
              </MenuItem>
              <MenuItem onClick={() => handleMenuItemClick("Owned by others")}>
                Owned by others
              </MenuItem>
              <MenuItem onClick={() => handleMenuItemClick("All Docs")}>
                All Docs
              </MenuItem>
            </Menu>
            <Typography variant="body1" sx={{ marginRight: 9 }}>
              Date Created
            </Typography>
            {/* <p className="mr-12">Date created</p> */}
          </div>

          {sortby === "Owned by me" ? (
            <div>
              {owndedocslist.map((doc) => (
                <DocsCard
                  id={doc.id}
                  fileName={doc.filename}
                  date={doc.date}
                  owner={doc.owner}
                  editorList={doc.editorList}
                  viewerList={doc.viewerList}
                />
              ))}
            </div>
          ) : sortby === "Owned by others" ? (
            <div>
              {" "}
              {notowneddocs.map((doc) => (
                <DocsCard
                  id={doc.id}
                  fileName={doc.filename}
                  date={doc.date}
                  owner={doc.owner}
                  editorList={doc.editorList}
                  viewerList={doc.viewerList}
                />
              ))}
            </div>
          ) : (
            <div>
              {allDocs.map((doc) => (
                <DocsCard
                  id={doc.id}
                  fileName={doc.filename}
                  date={doc.date}
                  owner={doc.owner}
                  editorList={doc.editorList}
                  viewerList={doc.viewerList}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default Doclist;
