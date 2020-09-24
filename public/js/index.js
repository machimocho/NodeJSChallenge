$("#btSI").click(function (e) {
  e.preventDefault();
  let datos = {
    username: $("#usernameSI").val(),
    password: $("#passwordSI").val(),
  };
  $.ajax({
    type: "POST",
    url: `/api/v1/usuarios/login`,
    data: JSON.stringify(datos),
    contentType: "application/json",
  })
    .done(function (response) {
      if (response.mensaje && response.mensaje == "Authorized User") {
        localStorage.setItem("Jobsity-Token", response.token);
        location.replace("/chat.html?username="+$("#usernameSI").val());
      }
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      alert(jqXHR.responseJSON.message);
    });
});

$("#btSU").click(function (e) {
  e.preventDefault();
  let datos = {
    username: $("#usernameSU").val(),
    password: $("#passwordSU").val(),
    password2: $("#passwordSU2").val(),
  };
  $.ajax({
    type: "POST",
    url: `/api/v1/usuarios`,
    data: JSON.stringify(datos),
    contentType: "application/json",
  })
    .done(function (response) {
      if (response.mensaje && response.mensaje == "User Created") {
        localStorage.setItem("Jobsity-Token", response.token);
        location.replace("/chat.html?username="+$("#usernameSU").val());
      }
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      alert(jqXHR.responseJSON.message);
    });
});

let token = localStorage.getItem("Jobsity-Token");
if (token){
  $.ajax({
    type: "GET",
    beforeSend: function (xhr) {
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    },
    url: `/api/v1/usuarios/sistema`
  })
    .done(function (response) {
      if (response && response == "Valid Token") {
        location.replace("/chat.html");
      }
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      localStorage.removeItem("Jobsity-Token");
    });
}
