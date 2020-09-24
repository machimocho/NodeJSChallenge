const socket = io()

// Verify valid token
let token = localStorage.getItem("Jobsity-Token");
if (token) {
  $.ajax({
    type: "GET",
    beforeSend: function (xhr) {
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    },
    url: `/api/v1/usuarios/sistema`,
  })
    .done(function (response) {
      if (response && response == "Valid Token") {
        loadUIDAta();
      }
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      localStorage.removeItem("Jobsity-Token");
      location.replace("/");
    });
} else {
  location.replace("/");
}

const getRooms = (pRoom) => {
  {
    $.ajax({
      type: "GET",
      beforeSend: function (xhr) {
        xhr.setRequestHeader("Authorization", `Bearer ${token}`);
      },
      url: `/api/v1/salas`
    })
      .done(function (rooms) {

        // Update UI
        rooms.map((room) => {
          $("#sRoom").append(new Option(room.room, room._id));
        });

        // If sent, select a room
        if (pRoom)
            $("#sRoom").val(pRoom);
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        alert(jqXHR.responseJSON.message);
      });
  }
};

const loadUIDAta = () => {
  // Get chat rooms
  let rooms = getRooms();
};

// Mustache Templates
const messageTemplate = $('#message-template').html();
const sidebarTemplate = $('#sidebar-template').html();

// Listen to incoming notifications
socket.on('message', (message) => {
  console.log(message)
  const html = Mustache.render(messageTemplate, {
      username: message.username,
      message: message.text,
      createdAt: moment(message.createdAt).format('h:mm a')
  })
  $("#messages").append(html)
  // autoscroll()
})

socket.on('roomData', ({ room, users }) => {
  const html = Mustache.render(sidebarTemplate, {
      room,
      users
  })
  $('#sidebar').innerHTML = html
})

// Emit joining the room
socket.emit('join', { username: 'Mario', room: 'Soocer' }, (error) => {
  if (error) {
      alert(error)
      location.href = '/'
  }
})