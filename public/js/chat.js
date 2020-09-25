const socket = io();

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
      url: `/api/v1/salas`,
    })
      .done(function (rooms) {
        // Update UI
        rooms.map((room) => {
          $("#sRoom").append(new Option(room.room, room._id));
        });

        // If sent, select a room
        if (pRoom) $("#sRoom").val(pRoom);
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        alert(jqXHR.responseJSON.message);
      });
  }
};

// Chat functions
const loadUIDAta = () => {
  // Get chat rooms
  let rooms = getRooms();
};

const emitirMensaje = () => {
  let input = $("#iMensaje")
  socket.emit('sendMessage', {message:input.val(), token, room: selectedRoomVal}, (error) => {

      if (error) {
          return console.log(error)
      }

      // Reset input
      input.val('');
      input.focus()
  })
}

const scroll = () => {
  $('#dMensajes').scrollTop(10000);
}

const verificarCantidadMensajes = () => {
  if($( "#messages" ).children().length > 50){
    $( "#messages div" ).first().remove();
  }
}

const obtenerUltimosMensajes = () => {
  $.ajax({
    type: "GET",
    beforeSend: function (xhr) {
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    },
    url: `/api/v1/mensajes/${selectedRoomVal}`,
    contentType: "application/json"
  })
  .done(function (msjs) {
    // Update UI
    msjs.map((msj) => {
      agregarMensaje({
        username:  msj.user.username,
        text: msj.message,
        createdAt: msj.createdAt
      });
    });
  })
  .fail(function (jqXHR, textStatus, errorThrown) {
    alert(jqXHR.responseJSON.message);
  });
}

// DOM Events
$( "#btnEnviar" ).click(function() {
  emitirMensaje();
});

$("#iMensaje").keypress(function(e) {
  if(e.which == 13 && $('#btnEnviar').is(':enabled')) {
    e.preventDefault();
    emitirMensaje();
  }
});

$("#sRoom").change(function () {
  // Left the previous room
  if (selectedRoomVal != "0") {
    socket.emit("leave", { username, selectedRoomText }, (error) => {
      if (error) {
        alert(error);
        location.href = "/";
      }
      $("#messages").empty();
    });
  }

  // Join the new room
  if ($(this).val() != 0) {
    let room = $("#sRoom option:selected").text();
    selectedRoomVal = $(this).val();
    selectedRoomText = room
    $('#btnEnviar').prop('disabled', false);
    socket.emit("join", { username, room }, (error) => {
      if (error) {
        alert(error);
        location.href = "/";
      }
      obtenerUltimosMensajes();
      $("#iMensaje").focus();
    });
  }else{
    $('#btnEnviar').prop('disabled', true);
    $("#sidebar").html('');
  }
});

const agregarMensaje = (message) => {
  const html = Mustache.render(messageTemplate, {
    username: message.username,
    message: message.text,
    createdAt: moment(message.createdAt).format("h:mm a"),
  });
  $("#messages").append(html);
  verificarCantidadMensajes();
  scroll()
}

// Chat info
const { username } = Qs.parse(location.search, { ignoreQueryPrefix: true });
let selectedRoomVal = $("#sRoom option:selected").val();
let selectedRoomText = $("#sRoom option:selected").text();

// Mustache Templates
const messageTemplate = $("#message-template").html();
const sidebarTemplate = $("#sidebar-template").html();

// Listen to incoming notifications
socket.on("message", (message) => {
  // console.log(message);
  agregarMensaje(message);
});

socket.on("roomData", ({ room, users }) => {
  const html = Mustache.render(sidebarTemplate, {
    room,
    users,
  });
  $("#sidebar").html(html);
});

// Emit just login the chat
socket.emit("login", { username }, (error) => {
  if (error) {
    alert(error);
    location.href = "/";
  }
});
