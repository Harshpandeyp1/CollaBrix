import { Client } from "@stomp/stompjs";

let stompClient = null;


const connectWebSocket = (
    token,
    onMessageReceived
) => {

    stompClient = new Client({

        // Your working backend WebSocket port
        brokerURL: "ws://localhost:8080/ws",

        connectHeaders: {
            Authorization: `Bearer ${token}`,
        },

        reconnectDelay: 5000,


        onConnect: () => {

            console.log(
                "WebSocket connected"
            );


            stompClient.subscribe(
                "/user/queue/messages",

                (message) => {

                    const receivedMessage =
                        JSON.parse(
                            message.body
                        );


                    console.log(
                        "Message received:",
                        receivedMessage
                    );


                    onMessageReceived(
                        receivedMessage
                    );

                }
            );

        },


        onStompError: (frame) => {

            console.error(
                "STOMP error:",
                frame.headers["message"]
            );

            console.error(
                frame.body
            );

        },


        onWebSocketError: (error) => {

            console.error(
                "WebSocket error:",
                error
            );

        },

    });


    stompClient.activate();

};


const sendMessage = (
    receiverId,
    content
) => {

    if (
        !stompClient ||
        !stompClient.connected
    ) {

        console.error(
            "WebSocket is not connected"
        );

        return false;

    }


    stompClient.publish({

        destination: "/app/chat",

        body: JSON.stringify({

            receiverId:
                receiverId,

            content:
                content,

        }),

    });


    console.log(
        "Message published:",
        {
            receiverId,
            content,
        }
    );


    return true;

};


const disconnectWebSocket = () => {

    if (stompClient) {

        stompClient.deactivate();

        stompClient = null;

        console.log(
            "WebSocket disconnected"
        );

    }

};


export {
    connectWebSocket,
    sendMessage,
    disconnectWebSocket,
};