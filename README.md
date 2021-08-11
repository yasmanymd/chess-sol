## Solution

The solution is composed by different projects representing different services.

* Game Service.
* Portal Service. 
* Viewer Service. 

### Game Service

It is a Golang Project that exposes in a REST API services to manage entities like games and strategy. It is a simple example to create, update and read entities between Golang and a PostgreSQL database using sqlx. Some integration tests are included using Testify.

### Portal Service

The Portal service is a client side project using React.js and Redux. It implements all the logic and validation that a chess game requires. It represents the game state as a Bitboard, an impresive data structure that validates all movements with bit operations bringing a great perfomance to the game rules.

A little server in Node.js is included in this project to manage the communication between the players using socket.io. It means authenticate the players, create/join a game and play it. Once the match is finished the game is saved automatically through Game Service to DB where Viewer service can list all the played games. 

### Viewer Service

The Viewer services is other client side project using React.js as well. It shows the list of games provided by Game Service where you can filter by player names and see the details of one game.

## Steps to run in docker

The only thing you need to do is run and wait the container finish of building.

```sh
docker-compose up
```
