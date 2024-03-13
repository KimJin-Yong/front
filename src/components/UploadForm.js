// import { FaCamera } from "react-icons/fa";
// import { MyResponsiveNetwork } from './MyResponsiveNetwork';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UploadForm.css';
import '../App.css';
import PaperList from './PaperList';
import { MyResponsiveNetwork } from './MyResponsiveNetwork';

const UploadForm = () => {
  const [user_question, setUserQuestion] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [showPaperList, setShowPaperList] = useState(false); // 새로운 상태 추가

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData =
      async () => {
        try {
          const response = await axios.get("http://localhost:8000/graph/data");
          setData(response.data);
          setLoading(false);
          console.log(response.data);
        } catch (error) {
          console.error("Error fetching data:", error);
          setLoading(false);
        }
      };

    fetchData();
  }, []);



  // const [uploadedText, setUploadedText] = useState('');
  // const [data, setData] = useState(null);
  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await axios.get("http://localhost:8000/graph/data");
  //       setData(response.data);
  //       setLoading(false);
  //       console.log(response.data);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, []);

  const handleTextChange = (event) => {
    setUserQuestion(event.target.value);
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const formData = new FormData();
      formData.append('user_question', user_question);
      if (selectedFile) {
        formData.append('file', selectedFile);
      }

      setShowPaperList(false);
      const response = await axios.post('http://223.130.141.170:8000/api/question/upload', formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      //setUploadedText(response.data.txt);

      setUserQuestion('');
      setSelectedFile(null);
      setShowPaperList(true); // 업로드 완료 시 PaperList 표시
    } catch (error) {
      console.error('Error Rised During Search', error);
      alert('Failed to connect with server.');
    }
  };

  return (
    <div>
      <div className="inputField" style={{ padding: "5px", position: "absolute", left: "50%", transform: "translateX(-50%)", width: "600px", height: "30px" }}>
        {/* <li>
          <button
            onClick={() => {
              document.getElementById('file').click();
            }} className='btn btn-primary' disabled>
            <FaCamera />
          </button>
        </li> */}
        <input
          type="file"
          id="file"
          accept="image/*"
          onChange={handleFileChange}
          className="file-input"
        />
        <input id="text" value={user_question} onChange={handleTextChange} style={{ border: 0, width: "500px", height: "28px", float: "left", outline: "none", verticalAlign: "middle"}} />
        <button type="button" className='btn btn-primary' onClick={handleSubmit} disabled={!user_question && !selectedFile} style={{ float: "right", position: "absolute", bottom: "8px", right: "5px", borderRadius: "12px", height: "60%", outline: "none", verticalAlign: "middle"}}>Search</button>
      </div>
      <div>
        {(
          <div className='response-container'>
            {showPaperList && <PaperList />}
            <div className="responsive-network" style={{position:"absolute", right:"5%", bottom:"5%",  width: "600px", height:"500px"}}>
              {showPaperList && <MyResponsiveNetwork data={data} />}
            </div>
            {/* <div className="responsive-network">
              {loading ? (
                <div>Loading...</div>
              ) : (
                data && <MyResponsiveNetwork data={data} />
              )}
            </div> */}
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadForm;
