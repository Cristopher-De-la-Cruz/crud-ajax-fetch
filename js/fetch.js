$(() => {
  $('#task-result').hide();
  fetchTasks();
  console.log('Fetch');

  let edit = false;

  let downloadpdf = $('#downloadpdf');

  let search = $('#search').val();

  $('#search').keyup(() => {
    search = $('#search').val();
    fetchTasks(search);
    if (search) {
      downloadpdf.attr('href', 'php/downloadPDF.php?search=' + search);
      // downloadpdf.attr('href', 'php/downloadPDF.php?search=' + encodeURIComponent(search));
    } else {
      downloadpdf.attr('href', 'php/downloadPDF.php');
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
          fetchTasks(search);
          $('#task-form').trigger('reset');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      })
  });

  function fetchTasks(search = '') {
    // let form = new URLSearchParams();
    // form.append('search', search);
    fetch('php/listar-tareas.php?search=' + search,
      // {
      //   method: 'POST',
      //   body: form,
      //   headers: {
      //     'Content-Type': 'application/x-www-form-urlencoded'
      //   }
      // }
    )
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
                                <button id="${task.id}" class="btn btn-danger task-delete">Eliminar</button>
                                <button id="${task.id}" class="btn btn-warning task-item">Modificar</button>
                            </td>
                        </tr>
                        `;
        });
        $('#tasks').html(template);
        edit = false;
      })
  }

  $(document).on('click', '.task-delete', function () {
    if (confirm('¿Seguroski que quieres eliminar esa tarea?')) {
      const id = $(this).attr('id');
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
            fetchTasks(search);
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        })
    }
  });

  $(document).on('click', '.task-item', function () {
    const id = $(this).attr('id');
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
        if (!response.error) {
          $('#name').val(response.name);
          $('#description').val(response.description);
          $('#taskId').val(response.id);
          edit = true;
        }
      })
  });
});
