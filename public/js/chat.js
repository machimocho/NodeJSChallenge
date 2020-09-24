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
        console.log(response);
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
        console.log(rooms);

        // Update UI
        rooms.map((room) => {
          $("#sRoom").append(new Option(room.room, room._id));
        });

        // If sent, select a room
        if (pRoom)
            $("sRoom").val(pRoom);
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
