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
        const paperIdFromUrl = params.get('paper_id');

        if (paperIdFromUrl) {
            setPaperId(paperIdFromUrl);
            axios.get(`http://223.130.128.44:8000/api/data/sidebar/${paperIdFromUrl}`)
            // axios.get(`http://223.130.141.170:8000/chat/room`)
                .then(response => {
                    console.log(response.data);
                    setSearchHistory(response.data);
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
        }
    }, [paperId]);

    const handleMenuItemClick = (item) => {
        navigate(`/chatbot?paper_id=${item}`);
        window.location.reload();
    };
    
    return (
        <Sidebar>
            <Menu>
                {/* 데이터를 매핑하여 MenuItem을 동적으로 생성 */}
                {searchHistory.map((item, index) => (
                    <MenuItem key={index} onClick={() => handleMenuItemClick(item)}
                    >{item}</MenuItem>
                ))}
            </Menu>
        </Sidebar>
    );
};

export default CustomSidebar;
