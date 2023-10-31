const form = document.getElementById('form');
const userName = document.getElementById('userName');
const email = document.getElementById('email');
let birthDate = document.getElementById('birthDate');
const message = document.getElementById('message');
const table = document.getElementById('table');
const idContact = document.getElementById('id');

let contactsList = [];

class Contact {
  constructor(id, userName, email, birthDate) {
    this.id = id;
    this.userName = userName;
    this.email = email;
    this.birthDate = birthDate;
  }

  fetchGetContacts() {
    fetch('https://app-de-contactos-74f42-default-rtdb.firebaseio.com/contacts.json')
      .then(response => response.json())
      .then(data => {
        contactsList = data;
        cargarContacts(); // Agregar esto para mostrar los contactos
      })
      .catch(error => console.log(error));
  }

  fetchPostContact() {
    fetch('https://app-de-contactos-74f42-default-rtdb.firebaseio.com/contacts.json')
      .then(response => response.json())
      .then(data => {
        let lastID = 0;
        for (const key in data) {
          if (data[key].id > lastID) {
            lastID = data[key].id;
          }
        }
        const nuevoID = lastID + 1;
  
        this.id = nuevoID;
  
        fetch('https://app-de-contactos-74f42-default-rtdb.firebaseio.com/contacts.json', {
          method: 'POST',
          body: JSON.stringify(this),
          headers: {
            'Content-Type': 'application/json; charset=UTF-8'
          }
        })
        .then(response => response.json())
        .then(() => {
          message.innerHTML = `
            Contacto agregado con éxito
            <p>Nombre: ${this.userName}</p>
            <p>Email: ${this.email}</p>
            <p>Fecha de nacimiento: ${this.birthDate}</p>
          `;
          form.append(message);
          setTimeout(() => {
            message.remove();
            form.reset();

            this.fetchGetContacts();
          }, 3500);
        })
        .catch(error => console.log(error));
      })
      .catch(error => console.log(error));
  }
  
  fetchDeleteContact() {
    let urlToDelete = `https://app-de-contactos-74f42-default-rtdb.firebaseio.com/contacts/${this.id}.json`;
    console.log("URL a eliminar:", urlToDelete); // Agrega este console.log
    fetch(urlToDelete, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8'
      }
    })
      .then(response => {
        console.log("Respuesta DELETE:", response); // Agrega este console.log
        if (response.status === 200) {
          // Eliminar el contacto de la lista y actualizar la tabla
          delete contactsList[this.id];
          cargarContacts();
        } else {
          console.error("La solicitud DELETE no se completó correctamente.");
        }
      })
      .catch(error => console.error("Error DELETE:", error));
  }
  
}

let contact = new Contact();

let start = () => {
  form.reset();
  userName.focus();
  contact.fetchGetContacts(); // Agregar esto para cargar los contactos al inicio
}

start();



let cargarContacts = () => {
  table.innerHTML = `<table class="table">
    <caption>
        <h4>Lista de contactos</h4>
    </caption>
    <thead>
        <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Fecha de nacimiento</th>
            <th class="text-center">Acciones</th>
        </tr>
    </thead>`;
  
  if (contactsList) {
    for (const id in contactsList) {
      const contact = contactsList[id];
      let birthDate = contact.birthDate;

      if (birthDate) {
        birthDate = birthDate.split('-').reverse().join('/');
      } else {
        birthDate = '';
      }

      table.innerHTML += `
        <tr>
        <td>${contact.id}</td>
        <td>${contact.userName}</td>
        <td>${contact.email}</td>
        <td>${birthDate}</td>
        <td><button class="btn btn-warning btn-azul"
        onclick="updateContact(${contact.id})">Editar</button></td>
        <td><button class="btn btn-danger btn-borde" onclick="deleteContact(${contact.id})">Borrar</button></td>
        </tr>`;
    }
  } else {
    table.innerHTML = `
      <tr>
        <td colspan="5">No hay ningún contacto cargado en la base de datos</td>
      </tr>`;
  }
}



form.addEventListener('submit', (e) => {
  e.preventDefault(); // Evita que el formulario se envíe

  let regexName = /^[a-zA-ZÀ-ÿ\s]{1,40}$/;
  let regexEmail = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  let regexBirthDate = /^\d{4}-\d{2}-\d{2}$/;

  let info = document.getElementById('info');
  info.innerHTML = '';

  if (userName.value == '' || email.value == '' || birthDate.value == '') {
    info.innerHTML += 'Todos los campos son obligatorios';
    setTimeout(() => {
      info.innerHTML = '';
    }, 2000);
    return false;
  }

  if (!regexName.test(userName.value)) {
    info.innerHTML += 'El nombre no es válido';
    setTimeout(() => {
      info.innerHTML = '';
    }, 2000);
    return false;
  }

  if (!regexEmail.test(email.value)) {
    info.innerHTML += 'El email no es válido';
    setTimeout(() => {
      info.innerHTML = '';
    }, 2000);
    return false;
  }

  if (!regexBirthDate.test(birthDate.value)) {
    info.innerHTML += 'La fecha no es válida';
    setTimeout(() => {
      info.innerHTML = '';
    }, 2000);
    return false;
  }

  let contact = new Contact(null, userName.value, email.value, birthDate.value);
  contact.fetchPostContact();
});

function deleteContact(id) {
  // Realizar la eliminación en la base de datos
  fetch(`https://app-de-contactos-74f42-default-rtdb.firebaseio.com/contacts/${element.id}.json`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8'
    }
  })
    .then(response => response.json())
    .then(data => {
      // Verificar si la eliminación fue exitosa
      if (data === null) {
        console.log('Contacto eliminado con éxito.');
        
      
        contact.fetchGetContacts();
      } else {
        console.log('Error al eliminar el contacto.');
      }
    })
    .catch(error => console.log('Error de eliminación:', error));
}





// const form = document.getElementById('form');
// const userName = document.getElementById('userName');
// const email = document.getElementById('email');
// const birthDate = document.getElementById('birthDate');
// const message = document.getElementById('message');
// const table = document.getElementById('table');
// const idContact = document.getElementById('id');


// let contactsList = [];

// let start = () => {
//   form.reset();
//   userName.focus();
  
//   let getContacts = () => {

//     fetch ('https://app-de-contactos-74f42-default-rtdb.firebaseio.com/contacts.json')
//     .then (response => response.json())
//     .then (data => {
//       contactsList = data;
//       return contactsList;
//     })
//     .catch (error => console.log(error))
//   }
//   getContacts();
// }
// start();

// class Contact {
//   constructor (id, userName, email, birthDate,) {
//     this.id = id;
//     this.userName = userName;
//     this.email = email;
//     this.birthDate = birthDate;
//   }

//   fetchGetContacts () {
//     fetch ('https://app-de-contactos-74f42-default-rtdb.firebaseio.com/contacts.json')
//     .then (response => response.json())
//     .then (data => {
//       contactsList = data;
//       return contactsList;
//     })
//     .catch (error => console.log(error))
//   }

//   fetchPostContact () {
//     let contact = new Contact (id.value, userName.value, email.value, birthDate.value);

//     fetch ('https://app-de-contactos-74f42-default-rtdb.firebaseio.com/contacts.json', {  
//       method: 'POST',
//       body: JSON.stringify(contact),
//       headers: {
//         'Content-Type': 'application/json ; charset=UTF-8'
//       }

//     })

//     .then (response => response.json())
//     .catch (error => console.log(error))

//   }

//   fetchPostContact() {
//     fetch('https://app-de-contactos-74f42-default-rtdb.firebaseio.com/contacts.json')
//         .then(response => response.json())
//         .then(data => {
//             let lastID = 0;
//             for (const key in data) {
//                 if (data[key].id > lastID) {
//                     lastID = data[key].id;
//                 }
//             }
//             const nuevoID = lastID + 1;

//             let contact = new Contact(nuevoID, userName.value, email.value, birthDate.value);

//             fetch('https://app-de-contactos-74f42-default-rtdb.firebaseio.com/contacts.json', {
//                 method: 'POST',
//                 body: JSON.stringify(contact),
//                 headers: {
//                     'Content-Type': 'application/json; charset=UTF-8'
//                 }
//             })
//             .then(response => response.json())
//             .catch(error => console.log(error));
//         })
//         .catch(error => console.log(error));
//   }

//   fetchDeleteContact () {
    
//       let idToDelete = idContact.value;
//       let urlToDelete = 'https://app-de-contactos-74f42-default-rtdb.firebaseio.com/contacts/' + idToDelete + '.json';
  
//       fetch(urlToDelete, {
//           method: 'DELETE',
//           headers: {
//               'Content-Type': 'application/json; charset=UTF-8'
//           }
//       })
//       .then(response => response.json())
//       .catch(error => console.log(error));
  

//   }

// }

// let contact = new Contact();

// setTimeout(() => {
//   contactsList ? cargarContacts() : table.innerHTML = `
//   <tr>
//       <td colspan="5">No hay ningun contacto cargado en la base de datos</td>
//   </tr>`
// }, 1000);


// let cargarContacts = () => {
//   let data = Object.values(contactsList) ? Object.values(contactsList) : data = [];
//   table.innerHTML = `<table class="table">
//   <caption>
//       <h4>Lista de contactos</h4>
//   </caption>
//   <thead>
//       <tr>
//           <th>ID</th>
//           <th>Nombre</th>
//           <th>Email</th>
//           <th>Fecha de nacimiento</th>
//           <th class="text-center">Acciones</th>
//       </tr>
//   </thead>`;
//   data.forEach(element => {
//       let birthDate = element.birthDate.split('-').reverse().join('/');
//       table.innerHTML += `
//       <tr>
//       <td>${element.id}</td>
//       <td>${element.userName}</td>
//       <td>${element.email}</td>
//       <td>${birthDate}</td>
//       <td><button class="btn btn-warning btn-azul"
//       onclick="updateContact(${element.id})">Editar</button></td>
//       <td><button class="btn btn-danger btn-borde"
//       onclick="deleteContact(${element.id})">Borrar</button></td>
//   </tr>`
//   })
// }

// sumbit.addEventListener('click', () => {
//   let regexName = /^[a-zA-ZÀ-ÿ\s]{1,40}$/;
//   let regexEmail = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
//   let regexBirthDate = /^\d{4}-\d{2}-\d{2}$/;
//   let info = document.getElementById('info')
//   info.innerHTML = '';

//   if (userName.value == '' || email.value == '' || birthDate.value == '') {
//       info.innerHTML += 'Todos los campos son obligatorios';
//       setTimeout(() => {
//           info.innerHTML = '';
//       }, 2000);
//       return false;
//   }


//   if (!regexName.test(userName.value)) {
//       info.innerHTML += 'El nombre no es valido';
//       setTimeout(() => {
//           info.innerHTML = '';
//       }, 2000);
//       return false;
//   }

//   if (!regexEmail.test(email.value)) {
//       info.innerHTML += 'El email no es valido';
//       setTimeout(() => {
//           info.innerHTML = '';
//       }, 2000);
//       return false;
//   }

//   if (!regexBirthDate.test(birthDate.value)) {
//       info.innerHTML += 'La fecha no es valida';
//       setTimeout(() => {
//           info.innerHTML = '';
//       }, 2000);
//       return false;
//   }
  
//   let birthdate = '';
//   if (birthDate.value) {
//     birthdate = birthDate.value.split('-').reverse().join('/');}


//           contact.fetchPostContact();
//           table.innerHTML = '';
//           message.innerHTML = `
//           Contacto agregado con éxito 
//           <p>Nombre: ${userName.value}</p>
//           <p>Email: ${email.value}</p>
//           <p>Fecha de nacimiento: ${birthdate}</p>            
//           `;
//           form.append(message);
//           setTimeout(() => {
//               message.remove();
              
//           }, 3500);

//           setTimeout(() => {
//             contact.fetchGetContacts();
//              setTimeout(() => {
//                 cargarContacts();
//                 form.reset();
//             }, 1000);
//         }, 3000);
//       });

  
