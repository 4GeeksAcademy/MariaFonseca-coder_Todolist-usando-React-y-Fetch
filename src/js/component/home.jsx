import React, { useState, useEffect } from "react";

const Home = () => {
  const [inputText, setInput] = useState("");
  const [toDo, setToDo] = useState([]);

  //************GET: Obtener tareas************
  const Todos = () => {
    fetch('https://playground.4geeks.com/todo/users/MariaFonseca', {
      method: "GET",
      headers: {
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
  };

  //************POST: Creación de usuario************
  function crearUsuario() {
    fetch('https://playground.4geeks.com/todo/users/MariaFonseca', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then((data) => {
        console.log("Usuario creado:", data);
      })
      .catch((error) => console.error("Error al crear el usuario:", error));
  }


  //************POST: Agregar tarea************
  function agregarTarea(nuevaTarea) {
    fetch('https://playground.4geeks.com/todo/todos/MariaFonseca', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        label: nuevaTarea.label,
        done: nuevaTarea.done
      })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error ${response.status} al agregar tareas en la API`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Tareas agregadas a la API:", data);
        Todos();
      })
      .catch((error) => console.error("Error al agregar las tareas a la API:", error));
  }

  useEffect(() => {
    Todos();
  }, []);

  //************Agrega tareas a la API************
  const sendData = (event) => {
    event.preventDefault();
    if (inputText.trim() !== "") {
      const nuevaTarea = {
        label: inputText.trim(),
        done: false,
      };
      setToDo([...toDo, nuevaTarea]);
      setInput("");
      agregarTarea(nuevaTarea);
    }
  };

  //************DELETE: Eliminar una tarea específica por ID************
  const handleDelete = (id) => {
    console.log("Eliminando tarea con ID:", id);
    fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(() => {
        const updatedToDo = toDo.filter((task) => task.id !== id);
        setToDo(updatedToDo);
        console.log("Tarea eliminada exitosamente.");
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error ${response.status} al eliminar la tarea en la API`);
        }
        return response.json();
      })
      .catch((error) => console.error("Error al eliminar la tarea:", error));
  };

  //************DELETE: Eliminar todas las tareas************
  const clearAllTasks = () => {
    Promise.all(
      toDo.map((task) =>
        fetch(`https://playground.4geeks.com/todo/users/MariaFonseca`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json"
          }
        })
      )
    )
      .then(() => {
        crearUsuario();
        setToDo([]);
        console.log("Todas las tareas fueron eliminadas.");
      })
      .catch((error) => console.error("Error al eliminar todas las tareas:", error));
  };

  //************DELETE: Eliminar usuario************
  function DeleteUser() {
    fetch('https://playground.4geeks.com/todo/users/MariaFonseca', {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error ${response.status} al eliminar el usuario`);
        }
        setToDo([]);
        console.log("Usuario eliminado exitosamente.");
      })
      .catch((error) => console.error("Error al eliminar el usuario:", error));
  }


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
              toDo.map((task) => (
                <li
                  key={task.id}
                  className="list-group-item d-flex justify-content-between align-items-center text-muted"
                >
                  {task.label}
                  <button
                    type="button"
                    className="btn p-0 m-0"
                    onClick={() => handleDelete(task.id)}
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
          <button type="button" className="btn btn-primary text-light mt-3" onClick={DeleteUser}>
            Delete User
          </button>
        </div>
      </form>
    </div>
  );
};

export default Home;