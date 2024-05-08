import React, { useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { fetchRequest, postRequest } from '../API/API';
import { useParams } from 'react-router-dom';



const Editor = () => {
  const [editorHtml, setEditorHtml] = useState('');
  const { documentId } = useParams()
  const { data, isLoading, isError } = useQuery(['editor', documentId], () => { fetchRequest(`/backend/documents/${documentId}`) }
  ,
  {
    onSuccess: (data) => {
      setEditorHtml(data.text)
    }
  
  })
  const postReq = useMutation(postRequest)

  const handleEditorChange = (html) => {
    console.log(html, 'html');
    setEditorHtml(html);
    postReq.mutate(`/backend/documents/${documentId}`, { text: html });
  };

  return (
    <>
      <div className='flex flex-col h-[calc(94vh-var(--navbar-height))]'>
        <div className='w-full sm:w-full md:w-full lg:w-full xl:w-full h-[calc(94vh-var(--navbar-height))]'>
          <ReactQuill
            theme='snow'
            value={editorHtml}
            onChange={handleEditorChange}
            className='w-full mb-4 h-[calc(94vh-var(--navbar-height))]'
            placeholder='Text (optional) '
          />
        </div>
      </div>
    </>
  );
};

export default Editor;
