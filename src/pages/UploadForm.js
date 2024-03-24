import React, { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import './UploadForm.css';
import '../App.css';
import PaperList from '../components/PaperList';
import { useAuth } from '../components/AuthContext';
import { MyResponsiveNetwork } from '../components/MyResponsiveNetwork';

const UploadForm = () => {
  const [user_question, setUserQuestion] = useState('');
  const [showPaperList, setShowPaperList] = useState(false);
  const [data, setData] = useState('');
  const [graph, setGraph] = useState(null);
  const [annotations, setAnnotations] = useState([]);

  const { token } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://223.130.128.44:8000/graph/mkdata");
        setGraph(response.data);
        const newAnnotations = [];
        for (let i = 0; i < response.data.nodes.length; i++) {
          newAnnotations[i] = {
            type: 'circle',
            match: {
              id: response.data.nodes[i].id
            },
            note: `${response.data.nodes[i].author}, ${response.data.nodes[i].year}`,
            noteX: 75,
            noteY: 36,
            offset: 6,
            noteTextOffset: 5
          };
        }
        setAnnotations(newAnnotations);
      } catch (error) {
        console.error("Error fetching graph data:", error);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = useCallback(async () => {
    try {
      const response = await axios.get(`http://223.130.141.170:8000/api/data/get_data/${user_question}`, {
        headers: {
          Authorization: `Bearer ${token.access_token}`,
        }
      });
      setData(response.data);
      setShowPaperList(true);
      console.log(data);
    } catch (error) {
      console.error('Error Rised During Search', error);
      alert('Failed to connect with server.');
    }
  }, [user_question, token]);

  const handleButtonClick = () => {
    if (user_question && token) {
      handleSubmit();
    }
  };

  const handleTextChange = (event) => {
    setUserQuestion(event.target.value);
  };

  return (
    <div>
      <div className="inputField" style={{ padding: "5px", position: "absolute", left: "50%", transform: "translateX(-50%)", width: "600px", height: "30px", marginTop: "30px" }}>
        <input id="text" placeholder='Search the paper by typing a word you are interested' value={user_question} onChange={handleTextChange} style={{ border: 0, right: "95%", width: "550px", height: "28px", float: "left", outline: "none", verticalAlign: "middle" }} />
        <button type="button" className='btn btn-primary' onClick={handleButtonClick} disabled={!user_question} style={{ float: "right", position: "absolute", bottom: "8px", right: "5px", borderRadius: "12px", height: "60%", outline: "none", verticalAlign: "middle" }}>Search</button>
      </div>
      <div className='response-container'>
        {showPaperList && <PaperList papers={data} />}
        <div className="responsive-network" style={{ position: "absolute", left: "50%", right: "0%", top:"180px", height: "500px" }}>
          {showPaperList && <MyResponsiveNetwork data={graph} annotations={annotations} />}
        </div>
      </div>
    </div>
  );
};

export default UploadForm;
