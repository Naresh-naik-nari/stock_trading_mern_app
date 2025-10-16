# Stock Trading Simulator

## About
Welcome to my Stock Trading Simulator! 

The goal of this web app is to allow users to learn about investing in a fun and risk-free manner. Users can access stock data and charts and use the app to buy and sell stocks using their $100k budget to simulate in a simplistic way the investing process.


It consists of a dynamic ReactJS frontend using Material UI, React Routing and Hooks. The backend API uses NodesJS and ExpressJS to perform user authentication and user and stock information retrieval. Furthermore, the data is stored in a MongoDB database.
\
\
## Installation
Make sure you have NodeJS installed. Then install the required packages for the server with:

```sh
npm install
```

And the required packages for the client with:
```sh
npm run install-client
```


Then run the server with:
```sh
npm run start
```
And run the client with:
```sh
cd client
npm run start
```


The Stock Trading Simulator is a web-based application designed to provide users with a realistic, risk-free environment to learn and practice stock trading. It combines real-time market data with simulated trading functionality, allowing users to experience the dynamics of stock market investing without financial risk. 

Key Features:
1.
Virtual Trading: Users start with a $100,000 simulated balance to buy and sell stocks.
2.
Real-Time Data: Integration with stock market APIs (like Tiingo) for up-to-date stock prices and information.
3.
Portfolio Management: Users can track their investments, view performance, and manage their virtual portfolio.
4.
Market Analysis Tools: Includes stock charts, historical data, and basic analysis features.
5.
News Integration: Provides relevant financial news to inform trading decisions.
6.
User Authentication: Secure login system to save user progress and portfolio information.
7.
Educational Resources: Includes a chatbot assistant for trading advice and educational content.

Technology Stack: 
Frontend: React.js with Material-UI
Backend: Node.js with Express.js
Database: MongoDB

APIs: Tiingo API for stock data, custom REST API for application functions
Real-time Updates: WebSockets and Server-Sent Events (SSE)

Target Audience:
Beginner to intermediate investors looking to practice trading strategies, students learning about financial markets, and anyone interested in experiencing stock market dynamics without financial risk.

Objective:
To provide an engaging, educational platform that simulates real stock market trading, helping users gain confidence and knowledge in investing before committing real money.

This project serves as both a learning tool and a practical simulator, bridging the gap between theoretical knowledge of stock markets and the experience of making trading decisions in a dynamic environment.
