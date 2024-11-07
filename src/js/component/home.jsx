import React, { useState, useEffect } from "react";

const Home = () => {
  const [inputText, setInput] = useState("");
  const [toDo, setToDo] = useState([]);
  const apiUrl = "https://playground.4geeks.com/todo";

  //POST: Creación de usuario
  function crearUsuario() {
    fetch('https://playground.4geeks.com/todo/users/MariaFonseca', { 
      method: "POST",
      headers:{
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then((data) => {
        console.log("Usuario creado:", data);
        return agregarTareas();
      })
      .catch((error) => console.error("Error al crear el usuario:", error));
  }

  //GET: Obtener tareas
  const Todos = () => {
    fetch('https://playground.4geeks.com/todo/users/MariaFonseca', { 
      method: "GET",
      headers:{
        "Content-Type": "application/json"
      }
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 404) {
            console.log("Usuario no encontrado, creando usuario...");
            return crearUsuario();
          } else if (response.status >= 500) {
            console.error("Error en el servidor al obtener tareas.");
          }
          throw new Error(`Error ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Tareas obtenidas:", data);
        setToDo(data.todos || []);
      })
      .catch((error) => console.error("Error al obtener las tareas:", error));
  }

  //POST: Agregar tareas
  function agregarTareas() {
    fetch('https://playground.4geeks.com/todo/todos/MariaFonseca', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify([{ label: "Tarea inicial", done: false }])
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error ${response.status} al agregar tareas`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Tareas agregadas:", data);
        Todos();
      })
      .catch((error) => console.error("Error al agregar las tareas:", error));
  }

  useEffect(() => {
    Todos();
  }, []);
 
  // const updateTasksOnServer = (tasks) => {
  //   fetch(apiUrl, {
  //     method: "PUT",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(tasks),
  //   })
  //     .then((response) => {
  //       if (!response.ok) {
  //         if (response.status === 400) {
  //           console.error("Error 400: Solicitud incorrecta al actualizar tareas.");
  //         } else if (response.status >= 500) {
  //           console.error("Error en el servidor al actualizar tareas.");
  //         }
  //         throw new Error(`Error ${response.status}`);
  //       }
  //     })
  //     .catch((error) => console.error("Error al actualizar las tareas en el servidor:", error));
  // };

  const sendData = (event) => {
    event.preventDefault();
    if (inputText.trim() !== "") {
      const newTasks = [...toDo, { label: inputText.trim(), done: false }];
      setToDo(newTasks);
      setInput("");
      updateTasksOnServer(newTasks);
    }
  };

  const handleDelete = (index) => {
    const updatedToDo = toDo.filter((_, i) => i !== index);
    setToDo(updatedToDo);
    updateTasksOnServer(updatedToDo);
  };

  const clearAllTasks = () => {
    fetch(apiUrl, { method: "DELETE" })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 400) {
            console.error("Error 400: Solicitud incorrecta al eliminar todas las tareas.");
          } else if (response.status >= 500) {
            console.error("Error en el servidor al eliminar todas las tareas.");
          }
          throw new Error(`Error ${response.status}`);
        }
        setToDo([]);a
      })
      .catch((error) => console.error("Error al eliminar todas las tareas:", error));
  };

  return (
    <div className="container">
      <form onSubmit={sendData}>
        <h1 className="Title text-center mt-5">To Do List</h1>
        <div className="Lista">
          <input
            type="text"
            className="InputCSS p-1 text-muted"
            placeholder="What needs to be done?"
            value={inputText}
            onChange={(event) => setInput(event.target.value)}
          />
          <ul className="list-group paper">
            {toDo.length === 0 ? (
              <li className="list-group-item bg-light text-muted mb-3">
                No hay tareas, añadir tareas
              </li>
            ) : (
              toDo.map((task, index) => (
                <li
                  key={index}
                  className="list-group-item d-flex justify-content-between align-items-center text-muted"
                >
                  {task.label}
                  <button
                    type="button"
                    className="btn p-0 m-0"
                    onClick={() => handleDelete(index)}
                  >
                    <i className="fas fa-trash-alt" style={{ fontSize: "0.5rem" }}></i>
                  </button>
                </li>
              ))
            )}
          </ul>
          <p className="AmountTasks">
            {toDo.length} {toDo.length === 1 ? "item left" : "items left"}
          </p>
          <button type="button" className="btn btn-danger mt-3" onClick={clearAllTasks}>
            Clear All Tasks
          </button>
        </div>
      </form>
    </div>
  );
};

export default Home;