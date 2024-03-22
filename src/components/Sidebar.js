import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function CustomSidebar() {
    const [searchHistory, setSearchHistory] = useState([]);
    const [paperId, setPaperId] = useState();
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const paperIdFromUrl = params.get('paperId');

        if (paperIdFromUrl) {
            setPaperId(paperIdFromUrl);
            axios.get(`http://223.130.128.44:8000/api/data/sidebar/${paperIdFromUrl}`)
            // axios.get(`http://223.130.141.170:8000/chat`)
                .then(response => {
                    console.log(response.data);
                    setSearchHistory(response.data);
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
        }
    }, [paperId]);
    // DB 구성에 따라 post? 
    // 받아야 할 것: paperId, 질의&&응답 log
    // text로 하나의 긴 히스토리 || char 255 list 히스토리
    return (
        <Sidebar>
            <Menu>
                {/* 데이터를 매핑하여 MenuItem을 동적으로 생성 */}
                {searchHistory.map((item, index) => (
                    <MenuItem key={index} onClick={() => navigate(`/chatbot?paperId=${item}`)}>{item}</MenuItem>
                ))}
            </Menu>
        </Sidebar>
    );
};

export default CustomSidebar;
