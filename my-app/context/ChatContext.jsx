import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";


export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {

    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectUser] = useState(null);
    const [unseenMessages, setUnseenMessages] = useState({});

    const { socket, axios } = useContext(AuthContext);

    // function to get all users
    const getUsers = async () => {
        try {
            const { data } = await axios.get("api/message/users");
            if (data.success) {
                setUsers(data.users);
                setUnseenMessages(data.unseenMessages);
            }
        }
        catch (error) {
            toast.error(error.message);
        }
    }

    // function to get message of selecting user 

    const getMessages = async (userId) => {
        try {
            const { data } = await axios.get(`/api/message/${userId}`);
            if (data.success) {
                setMessages(data.message);
            }
        }
        catch (error) {
            toast.error(error.message);
        }
    }

    // function to send message

    const sendMessage = async (messageData) => {
        try {
            const { data } = await axios.post(`/api/message/send/${selectedUser._id}`, messageData);
            if (data.success) {
                setMessages((prevMessages) => [...prevMessages, data.newMessage]);
            }
            else {
                toast.error(data.message);
            }
        }
        catch (error) {
            toast.error(error.message);
        }
    }

    // function to subscribe to messages for selected user

    const subscribeToMessage = async () => {
        if (!socket) return;


        socket.on("newMessage", (newMessage) => {
            //console.log("RECEIVED NEW MESSAGE:", newMessage);
            if (selectedUser && newMessage.senderId === selectedUser._id) {
                newMessage.seen = true;
                setMessages((prevMessages) => [...prevMessages, newMessage]);
                axios.put(`/api/message/mark/${newMessage._id}`);
            }
            else {
                setUnseenMessages((prevUnseenMessages) => ({
                    ...prevUnseenMessages, [newMessage.senderId]:
                        prevUnseenMessages[newMessage.senderId] ? prevUnseenMessages[newMessage.senderId] + 1 : 1
                }))
            }
        })
    }

    // function to unsubscribe message from particular user 

    const unsubscribeFromMessages = () => {
        if (socket) socket.off("newMessage");
    }

    useEffect(() => {
        subscribeToMessage();
        return () => unsubscribeFromMessages();
    }, [socket, selectedUser])

    const value = {
        messages,
        users,
        selectedUser,
        getUsers,
        getMessages,
        sendMessage,
        setSelectUser,
        unseenMessages,
        setUnseenMessages
    }

    // added to ensure the count is set to 0 (debugged)

    // useEffect(() => {
    //     if (selectedUser) {
    //         getMessages(selectedUser._id);

    //         setUnseenMessages((prev) => {
    //             const updated = { ...prev };
    //             delete updated[selectedUser._id];
    //             return updated;
    //         });
    //     }
    // }, [selectedUser]);

    // useEffect(() => {
    //     if (!socket) return;

    //     const handleNewMessage = (newMessage) => {
    //         console.log("📩 New message received:", newMessage);

    //         if (
    //             selectedUser &&
    //             (newMessage.senderId === selectedUser._id || newMessage.receiverId === selectedUser._id)
    //         ) {
    //             setMessages((prev) => [...prev, newMessage]);
    //         } else {
    //             setUnseenMessages((prev) => ({
    //                 ...prev,
    //                 [newMessage.senderId]: (prev?.[newMessage.senderId] || 0) + 1,
    //             }));
    //         }
    //     };

    //     socket.on("newMessage", handleNewMessage);

    //     return () => {
    //         socket.off("newMessage", handleNewMessage);
    //     };
    // }, [socket, selectedUser]);


    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    )
}