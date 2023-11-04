const form = document.getElementById('form');
const userName = document.getElementById('userName');
const email = document.getElementById('email');
const birthDate = document.getElementById('birthDate');
const message = document.getElementById('message');
const table = document.getElementById('table');
const idContact = document.getElementById('id');
const submit = document.getElementById('submit');

let contactsList = [];

let getContactList = () => {
  fetch('https://app-de-contactos-74f42-default-rtdb.firebaseio.com/contacts.json')
    .then(response => response.json())
    .then(data => {
      contactsList = data;
      cargarContacts();
      return contactsList;
    })
    .catch(error => console.log(error));
}

let start = () => {
  idContact.value = '';
  form.reset();
  userName.focus();
  getContactList();
}
start();

class Contact {
  constructor(id, userName, email, birthDate) {
    this.id = id;
    this.userName = userName;
    this.email = email;
    this.birthDate = birthDate;
  }

  fetchGetContacts() {
    console.log("Obteniendo contactos...");
    fetch('https://app-de-contactos-74f42-default-rtdb.firebaseio.com/contacts.json')
      .then(response => response.json())
      .then(data => {
        contactsList = data;
        return contactsList;
      })
      .catch(error => console.log(error));
  }

  fetchPostContact() {
    let contact = new Contact(id.value, userName.value, email.value, birthDate.value);

    if (!contact.id) {
      // Genera un nuevo ID basado en el número de contactos existentes
      contact.id = Object.keys(contactsList).length + 1;
    }
  
    // Verifica si ya existe un contacto con el mismo ID en la lista
    if (contactsList[contact.id]) {
      alert("Ya existe un contacto con el mismo ID. Debes editar el contacto existente en lugar de agregar uno nuevo.");
      return;
    }

    fetch('https://app-de-contactos-74f42-default-rtdb.firebaseio.com/contacts.json', {
      method: 'POST',
      body: JSON.stringify(contact),
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
          getContactList();
        }, 3500);
      })
      .catch(error => console.log(error));
  }

  fetchPutContact(id) {

    let contact = {
      id: idContact.value,
      userName: userName.value,
      email: email.value,
      birthDate: birthDate.value
    }
    console.log(idContact.value);

    let referenceId;
    Object.entries(contactsList).forEach(([key, value]) => {
      console.log(key, value);
      if (contact.id == value.id) {
        return referenceId = key;
      }
    });

    fetch('https://app-de-contactos-74f42-default-rtdb.firebaseio.com/contacts/' + referenceId + '.json', {
      method: 'PUT',
      body: JSON.stringify(contact),
      headers: {
        'Content-Type': 'application/json; charset=UTF-8'
      }
    })
      .then(response => response.json())
      .then(() => {
        modoEdit = false;
        form.append(message);
        setTimeout(() => {
          message.remove();
          form.reset();
          getContactList();
        }, 3500);
      })
      .catch(error => console.log(error));
  }

  fetchDeleteContact(id) {
    if (!id) {
      console.error("El ID del contacto es nulo.");
      return;
    }

    let referenceId;
    Object.entries(contactsList).forEach(([key, value]) => {
      if (id == value.id) {
        return referenceId = key;
      }
    });

    let urlToDelete = `https://app-de-contactos-74f42-default-rtdb.firebaseio.com/contacts/${referenceId}.json`;

    fetch(urlToDelete, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8'
      }
    })
      .then(response => {
        if (response.status === 200) {
          // Eliminar el contacto de la lista y actualizar la tabla
          delete contactsList[referenceId];
          cargarContacts();
          console.log("Contacto eliminado con éxito.");
        } else {
          console.error("La solicitud DELETE no se completó correctamente.");
        }
      })
      .then(() => {
        message.innerHTML = `
          Contacto ELIMINADO CON EXITO
        `;
        form.append(message);
        setTimeout(() => {
          message.remove();
          form.reset();
          getContactList();
        }, 3500);
      })
      .catch(error => console.error("Error DELETE:", error));
  }
}

let contact = new Contact();

let cargarContacts = () => {
  let data = Object.values(contactsList) ? Object.values(contactsList) : [];
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

  if (data.length > 0) {
    for (const element of data) {
      let birthDate = element.birthDate ? element.birthDate.split('-').reverse().join('-') : 'Fecha de nacimiento no disponible';

      table.innerHTML += `
        <tr>
        <td>${element.id}</td>
        <td>${element.userName}</td>
        <td>${element.email}</td>
        <td>${birthDate}</td>
        <td><button class="btn btn-warning btn-azul" onclick="editOn((${element.id}))">Editar</button></td>
        <td><button class="btn btn-danger btn-borde" onclick="deleteContact(${element.id})">Borrar</button></td>
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
  e.preventDefault();
  let regexName = /^[a-zA-ZÀ-ÿ\s]{1,40}$/;
  let regexEmail = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  let regexBirthDate = /^\d{4}-\d{2}-\d{2}$/;
  let info = document.getElementById('info');
  modoEdit = false;
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
  const result = confirm("¿Estás seguro de que deseas eliminar este contacto?");
  if (result) {
    contact.fetchDeleteContact(id);

    message.innerHTML = `El contacto  eliminado con éxito`;
  }
}

let modoEdit = false;

let editOn = (id) => {
      modoEdit = true;
      if (modoEdit = true) {
        document.getElementById('submit').textContent = 'Editar contacto';
  
    let referenceId;
      Object.entries(contactsList).forEach(([key, value]) => {
        if (id == value.id) {
          return referenceId = key;
        }
      });
  
      console.log(referenceId)
    const contactToUpdate = contactsList[referenceId];
  
    if (!contactToUpdate) {
      console.error("No se encontró el contacto con el ID proporcionado.");
      return;
    }
  
    document.getElementById('id').value = contactToUpdate.id;
    document.getElementById('userName').value = contactToUpdate.userName;
    document.getElementById('email').value = contactToUpdate.email;
    document.getElementById('birthDate').value = contactToUpdate.birthDate || '';
    
    if (contactToUpdate.birthDate) {
      document.getElementById('birthDate').value = contactToUpdate.birthDate;
    } else {
      document.getElementById('birthDate').value = '';
    }
  
    document.getElementById('submit').addEventListener('click', () => {
      const updatedName = document.getElementById('userName').value;
      const updatedEmail = document.getElementById('email').value;
      const updatedBirthDate = document.getElementById('birthDate').value;
    
      if (!updatedName.trim() || !updatedEmail.trim()) {
        alert("El nombre y el email son campos obligatorios");
        return;
      }
  
      contactToUpdate.userName = updatedName;
      contactToUpdate.email = updatedEmail;
      contactToUpdate.birthDate = updatedBirthDate || null;
      if (updatedBirthDate) {
        contactToUpdate.birthDate = updatedBirthDate;
      }
  
      contact.fetchPutContact(id);
  
      cargarContacts();
    ;
  
      document.getElementById('id').value = '';
      document.getElementById('userName').value = '';
      document.getElementById('email').value = '';
      document.getElementById('birthDate').value = '';
  
  
      document.getElementById('submit').textContent = 'Agregar';
  
      cargarContacts();
  
      message.innerHTML = `
      CONTACTO ACTUALIZADO CON ÉXITO
      <p>Nombre: ${contactToUpdate.userName}</p>
      <p>Email: ${contactToUpdate.email}</p>
      <p>Fecha de nacimiento: ${contactToUpdate.birthDate || 'Fecha no disponible'}</p>
      `;
      form.append(message);
      setTimeout(() => {
      message.remove();
    }, 3500);
    
    })
      
  }

}




