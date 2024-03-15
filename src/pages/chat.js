import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import ExampleChatBotWithBackend from '../components/ExampleChatBotWithBackend';

function Chat() {
  return (
    <div>
      <div className='sidebar' style={{ position: 'absolute', width: "251px", height: "100%", background: "#F0EDCF" }}>
        <Sidebar>
          <Menu>
            <MenuItem style={{background: "#0B60B0", color: "#000000"}}>
              <h2>Header</h2>
            </MenuItem>
            <MenuItem> There be </MenuItem>
            <MenuItem> Paper Titles </MenuItem>
            <MenuItem> You've Searched </MenuItem>
            <MenuItem> extra </MenuItem>
            <MenuItem> extra </MenuItem>
          </Menu>
        </Sidebar>
      </div>
      <div> <div className='bot' style={{ float: "center", zIndex: "1", marginLeft: "300px", marginRight: "3%" }}>
        <ExampleChatBotWithBackend />
      </div>
      </div>
    </div>
  );
}

export default Chat;
