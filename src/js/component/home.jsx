import React, { useState, useEffect } from "react";

const Home = () => {
  const [inputText, setInput] = useState("");
  const [toDo, setToDo] = useState([]);
  const apiUrl = "https://playground.4geeks.com/todo"; //Para poner la API que voy a usar.

  useEffect(() => {
    fetch(apiUrl + '/users/MariaJoseFonseca', { method: "GET" })
      .then((response) => response.json())
      .then((data) => setToDo(data))
      .catch((error) => console.error("Error al obtener las tareas:", error));
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
  //         throw new Error("Error en la actualización de tareas en el servidor");
  //       }
  //     })
  //     .catch((error) => console.error("Error al actualizar las tareas en el servidor:", error));
  // };

  //NO RECUERDO SI ACÁ ES POST MEJOR
  const sendData = (event) => {
    event.preventDefault();
    if (inputText.trim() !== "") {
      const newTasks = [...toDo, inputText.trim()];
      setToDo(newTasks);
      setInput("");
      updateTasksOnServer(newTasks); //PUT para actualizar
    }
  };
  // //Aplicar DELETE por id
  // const handleDelete = (index) => {
  //   const updatedToDo = toDo.filter((_, i) => i !== index);
  //   setToDo(updatedToDo);
  //   updateTasksOnServer(updatedToDo); //PUT para actualizar
  // };

  const clearAllTasks = () => {
    fetch(apiUrl, { method: "DELETE" })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al eliminar todas las tareas en el servidor");
        }
        setToDo([]);
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