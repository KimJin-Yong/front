import PropTypes from 'prop-types';
import ChatBot, { Loading } from 'react-simple-chatbot';
import axios from 'axios';
import React, { Component } from 'react';

class PreviousSessionLogs extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      logs: [],
    };
  }

  componentDidMount() {
    const accessToken = JSON.parse(localStorage.getItem('accessToken'));
    const params = new URLSearchParams(window.location.search);
    const paperId = params.get('paper_id');

    const axiosInstance = axios.create({
      headers: {
        Authorization: `Bearer ${accessToken.access_token}`
      }
    });

    const exapleQuestions = [
      { 'content': 'Example Question 1:' },
      { 'content': 'What is the title of the paper?' },
      { 'content': 'Example Question 2:' },
      { 'content': 'What is the topic of this paper?' },
      { 'content': 'Example Question 3:' },
      { 'content': 'Could you brief me on this paper?' },
    ];

    axiosInstance.get(`http://223.130.141.170:8000/chat/?paper_id=${paperId}`)
      .then(response => {
        if (response.data === false) {
          axiosInstance.post(`http://223.130.141.170:8000/chat/`,
            {
              "paper_id": paperId
            }
          ).then(() => {
            const logs = exapleQuestions;
            this.setState({ logs, loading: false });
          }).catch(error => {
            console.error('Error posting initial message:', error);
            this.setState({ loading: false });
          });
        }
        else {
          const logs = response.data;
          console.log(logs);
          if (logs.length === 0) {
            logs = exapleQuestions;
          }
          this.setState({ logs, loading: false });
        }
      })
      .catch(error => {
        alert("Error Fetching Data");
        const logs = exapleQuestions;
        console.error('Error fetching previous logs:', error);
        this.setState({ logs, loading: false });
      });
  }

  render() {
    const { loading, logs } = this.state;

    return (
      <div>
        {loading ? <p>Loading...</p> :
          <ul style={{ listStyleType: 'none' }}>
            {logs.map((log) => (
              <li key={log.message_id}>
                <li>
                  {log.user_com ? (
                    // user_com이 true인 경우
                    <div className='font-User'>User</div>
                  ) : (
                    // user_com이 false인 경우
                    <div className='font-PRQAS'>PRQAS</div>
                  )}
                </li>
                <br />
                <li className=''>
                  {log.content}
                </li>
              </li> // Render the content of each log
            ))}
          </ul>
        }
      </div>
    );
  }
}

class ChatBotWithBackend extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      result: '',
      trigger: false,
    };

    this.triggetNext = this.triggetNext.bind(this);
  }

  componentDidMount() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const paperId = urlParams.get('paper_id');
    const accessToken = JSON.parse(localStorage.getItem('accessToken'));

    axios.get(`http://223.130.128.44:8000/api/data/chatbot/${paperId}/${this.props.previousStep.message}`)
      .then(response => {
        const data = response.data;
        if (data) {
          this.setState({ loading: false, result: data });

          const userMessage = {
            "content": this.props.previousStep.message,
            "paper_id": paperId,
            "user_com": false
          };

          const botMessage = {
            "content": JSON.stringify(data.answer),
            "paper_id": paperId,
            "user_com": true
          };

          axios.post(`http://223.130.141.170:8000/chat/message`, userMessage, {
            headers: {
              Authorization: `Bearer ${accessToken.access_token}`
            }
          })
            .then(response => {
              console.log('Data successfully sent:', response.data);
            })
            .catch(error => {
              console.error('Error sending data:', error);
            });

          axios.post(`http://223.130.141.170:8000/chat/message`, botMessage, {
            headers: {
              Authorization: `Bearer ${accessToken.access_token}`
            }
          })
            .then(response => {
              console.log('Data successfully sent:', response.data);
            })
            .catch(error => {
              console.error('Error sending data:', error);
            });
        } else {
          this.setState({ loading: false, result: 'Not found.' });
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        this.setState({ loading: false, result: 'Error fetching data.' });
      });

    this.props.triggerNextStep();
  }

  triggetNext() {
    this.setState({ trigger: true }, () => {
      this.props.triggerNextStep();
    });
  }

  render() {
    const { trigger, loading, result } = this.state;

    return (
      <div className="chatbot-with-backend">
        {loading ? <Loading /> : <pre>{removeQuotes(JSON.stringify(result.answer, null, 2))}</pre>}
      </div>
    );
  }
}

ChatBotWithBackend.propTypes = {
  triggerNextStep: PropTypes.func,
};

ChatBotWithBackend.defaultProps = {
  triggerNextStep: undefined,
};

function removeQuotes(str) {
  if (str.charAt(0) === '"' && str.charAt(str.length - 1) === '"') {
    return str.slice(1, -1);
  }
  return str;
}

const ExampleChatBotWithBackend = () => (
  <ChatBot
    headerTitle="Paper Explainer"
    hideUserAvatar={true}
    floatingStyle={{ width: "100%", background: "red" }}
    bubbleStyle={{ marginLeft: "8px", maxWidth: "100%", width: "100%", borderRadius: "5px" }}
    hidInput={false}
    hideHeader={true}
    width="100%"
    style={{ height: "89vh", boxShadow: "none" }}
    contentStyle={{ height: "82vh", width: "100%" }}
    steps={[
      {
        id: '1',
        component: <PreviousSessionLogs />,
        trigger: 'query',
      },
      {
        id: 'query',
        user: true,
        trigger: '3',
      },
      {
        id: '3',
        component: <ChatBotWithBackend />,
        waitAction: true,
        trigger: 'query',
      },
    ]}
  />
);

export default ExampleChatBotWithBackend;