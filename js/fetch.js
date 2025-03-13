$(function () {
  $('#task-result').hide();
  fetchTasks();
  let edit = false;

  $('#search').keyup(() => {
    if ($('#search').val()) {
      let search = $('#search').val();
      let formData = new URLSearchParams();
      formData.append('search', search);
      fetch('php/buscar-tarea.php', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
        .then(resp => {
          if (!resp.ok) throw new Error('Error en la solicitud');
          return resp.json();
        })
        .then(response => {
          let template = '';
          response.forEach(task => {
            template += `<li class="task-item">${task.name}</li>`;
          });
          $('#task-result').show();
          $('#container').html(template);
        })
        .catch(error => console.error('Error:', error));
    }
  });

  $('#task-form').submit((e) => {
    e.preventDefault();
    const postData = {
      name: $('#name').val(),
      description: $('#description').val(),
      id: $('#taskId').val(),
    };

    const url = edit === false ? 'php/agregar-tarea.php' : 'php/editar-tarea.php';

    let form = new URLSearchParams();
    form.append('name', postData.name);
    form.append('description', postData.description);
    form.append('id', postData.id);

    fetch(url, {
      method: 'POST',
      body: form,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then((resp) => {
      if (!resp.ok) throw new Error('Error en la solicitud');
      return resp.json();
    })
      .then((response) => {
        if (!response.error) {
          fetchTasks();
          $('#task-form').trigger('reset');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      })
  });

  function fetchTasks() {
    fetch('php/listar-tareas.php')
      .then(resp => resp.json())
      .then(response => {
        let template = ``;
        response.forEach((task) => {
          template += `
                        <tr taskId="${task.id}">
                            <td>${task.id}</td>
                            <td>${task.name}</td>
                            <td>${task.description}</td>
                            <td>
                                <button class="btn btn-danger task-delete">Eliminar</button>
                                <button class="btn btn-warning task-item">Modificar</button>
                            </td>
                        </tr>
                        `;
        });
        $('#tasks').html(template);
        edit = false;
      })
  }

  $(document).on('click', '.task-delete', () => {
    if (confirm('¿Seguroski que quieres eliminar esa tarea?')) {
      const element = $(this)[0].activeElement.parentElement.parentElement;
      const id = $(element).attr('taskId');
      let form = new URLSearchParams();
      form.append('id', id);
      fetch('php/eliminar-tarea.php', {
        method: 'POST',
        body: form,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then((resp) => resp.json())
        .then((response) => {
          if (!response.error) {
            fetchTasks();
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        })
    }
  });

  $(document).on('click', '.task-item', () => {
    const element = $(this)[0].activeElement.parentElement.parentElement;
    const id = $(element).attr('taskId');
    let url = 'php/obtener-una-tarea.php';
    
    let form = new URLSearchParams();
    form.append('id', id);
    fetch(url, {
      method: 'POST',
      body: form,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(resp => resp.json())
      .then(response => {
        if(!response.error){
          $('#name').val(response.name);
          $('#description').val(response.description);
          $('#taskId').val(response.id);
          edit = true;
        }
      })
  });
});
