$(() => {
  $('#task-result').hide();
  fetchTasks();
  console.log('Ajax');
  
  let edit = false;

  let downloadpdf = $('#downloadpdf');

  let search = $('#search').val();

  $('#search').keyup(() => {
      search = $('#search').val();
      fetchTasks(search);
      if(search) {
        downloadpdf.attr('href', 'php/downloadPDF.php?search=' + encodeURIComponent(search));
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

    $.ajax({
      url,
      data: postData,
      type: 'POST',
      success: function (response) {
        if (!response.error) {
          fetchTasks(search);
          $('#task-form').trigger('reset');
        }
      },
    });
  });

  function fetchTasks(search = '') {
    $.ajax({
      url: 'php/listar-tareas.php?search=' + search,
      // data: { search },
      type: 'GET',
      success: function (response) {
        const tasks = JSON.parse(response);
        let template = ``;
        tasks.forEach((task) => {
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
        edit = false; // Restablecer 'edit' a false después de cargar las tareas
      },
    });
  }

  $(document).on('click', '.task-delete', function() {
    if (confirm('¿Seguroski que quieres eliminar esa tarea?')) {
      const id = $(this).attr('id');
      $.post('php/eliminar-tarea.php', { id }, () => {
        fetchTasks(search);
      });
    }
  });

  $(document).on('click', '.task-item', function() {
    const id = $(this).attr('id');
    let url = 'php/obtener-una-tarea.php';
    $.ajax({
      url,
      data: { id },
      type: 'POST',
      success: function (response) {
        if (!response.error) {
          const task = JSON.parse(response);
          $('#name').val(task.name);
          $('#description').val(task.description);
          $('#taskId').val(task.id);
          edit = true;
        }
      },
    });
  });
});
