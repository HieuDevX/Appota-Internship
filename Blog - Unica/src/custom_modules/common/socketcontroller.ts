import { Socket } from 'socket.io';

export default function socketControl(io: SocketIO.Server) {
  const usernames = [];

  io.on('connection', (socket: Socket) => {
    console.log('a user connected');
    let currentUser = 'nobody';
    // Listen adduser event
    socket.on('adduser', (username: string) => {
      if (username !== null) {
        console.log(username);

        currentUser = username;
        // Save
        usernames.push(username);
        console.log(usernames);

        // Notify to that user
        const dataToThatUser = {
          sender: 'SERVER',
          message: 'You have join chat room',
        };

        socket.emit('update_message', dataToThatUser);

        // Notify to other users
        const dataToOtherUser = {
          sender: 'SERVER',
          message: `${username} have join to chat room`,
        };

        socket.broadcast.emit('update_message', dataToOtherUser);
      }
    });

    // Listen send_message event
    socket.on('send_message', (message) => {
      // Notify to that user
      const dataToThatUser = {
        sender: 'You',
        message,
      };

      socket.emit('update_message', dataToThatUser);

      // Notify to other users
      const dataToOtherUser = {
        sender: currentUser,
        message,
      };

      socket.broadcast.emit('update_message', dataToOtherUser);
    });

    socket.on('disconnect', () => {
      // Delete current user
      for (const [index, user] of usernames) {
        if (user === currentUser) {
          usernames.splice(index, 1);
        }
      }

      // Notify to other users
      const dataToOtherUser = {
        sender: 'SERVER',
        message: `${currentUser} have left chat room`,
      };

      socket.broadcast.emit('update_message', dataToOtherUser);
    });
  });
}
