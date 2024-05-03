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

const owndedocslist = [
    { id: "1", filename: "file1.docx", date: new Date('2016-05-02') },
    { id: "2", filename: "file2.docx", date: new Date('2016-05-03') },
    { id: "3", filename: "file3.docx", date: new Date('2016-05-04') },
    { id: "4", filename: "file4.docx", date: new Date('2016-05-05') },
    { id: "5", filename: "file5.docx", date: new Date('2016-05-06') },
    { id: "4", filename: "file7.docx", date: new Date('2016-05-05') },
    { id: "4", filename: "file9.docx", date: new Date('2016-05-05') },
  ];
  const notowneddocs = [
    { id: "1", filename: "hagatanya.docx", date: new Date('2016-05-02') },
    { id: "2", filename: "file2.docx", date: new Date('2016-05-03') },
    { id: "3", filename: "file3.docx", date: new Date('2016-05-04') },
    { id: "4", filename: "hagatanya.docx", date: new Date('2016-05-05') },
    { id: "5", filename: "hagatanya.docx", date: new Date('2016-05-06') },
    { id: "4", filename: "hagatanya.docx", date: new Date('2016-05-05') },
    { id: "4", filename: "file9.docx", date: new Date('2016-05-05') },
  ];


function Doclist() {
    const [sortby, setsort] = useState("owned by me");
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
         setsort(sortType)
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
        <section className="bg-white px-10 md:px-0">
            <div className="max-w-3xl mx-auto py-8 text-sm text-gray-700">
                <div className="flex items-center justify-between pb-5 border-b-2 border-gray-200">
                    <h2 className="font-medium flex-grow">Recent documents</h2>
                    <button
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        onClick={() => setPopUp(true)}
      >
        Open Modal
      </button>
      {popUp && <Modal  setPopUp={setPopUp} />}
                    <IconButton onClick={handleClick}>
        <Typography variant="body1">{sortby}</Typography>
      
      </IconButton>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={() => handleMenuItemClick('owned by me')}>Owned by me</MenuItem>
        <MenuItem  onClick={() => handleMenuItemClick('owned by others')}>owned by others</MenuItem>
      </Menu>
                    <p className="mr-12 italic">Date created</p>
                    {/* <Icon name="folder" size="3xl" color="blue" /> */}
                </div>
               
{sortby === "owned by me" ? (
  <div>
   {owndedocslist.map((doc) => (
          <DocsCard
            id={doc.id}
            fileName={doc.filename}
            date={doc.date}
          />
        ))}

  </div>
) : (
  <div> {notowneddocs.map((doc) => (
    <DocsCard
      id={doc.id}
      fileName={doc.filename}
      date={doc.date}
    />
  ))}</div>
)}

            </div>


        </section>
    );
}

export default Doclist;