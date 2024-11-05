import React, { useState } from "react";

const Home = () => {
  const [inputText, setInput] = useState("");
  const [toDo, setToDo] = useState([]);

  function sendData(event) {
    event.preventDefault();
    if (inputText.trim() !== "") {
      setToDo([...toDo, inputText.trim()]);//De expansión
      setInput("");
    }
  }

  function handleDelete(index) {
    const updatedToDo = toDo.filter((_, i) => i !== index);
    setToDo(updatedToDo);
  }

  return (
    <div className="container">
      <form onSubmit={sendData}>
        <h1 className="Title text-center mt-5">To Do List</h1>
        <div className="Lista">
          <input type="text" className="InputCSS p-1 text-muted" placeholder="What needs to be done?" value={inputText} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => {
            if (event.key === "Enter") {
              sendData(event);
            }
          }} />
          <ul className="list-group paper">
            {toDo.length === 0 ? (
              <li className="list-group-item bg-light text-muted mb-3">No hay tareas, añadir tareas</li>
            ) : (
              toDo.map((task, index) => (
                <li key={index} className="list-group-item d-flex justify-content-between align-items-center text-muted">
                  {task}
                  <button
                    type="button"
                    className="btn p-0 m-0"
                    onClick={() => handleDelete(index)}
                  >
                    <i class="fas fa-trash-alt" style={{ fontSize: '0.5rem' }}></i>
                  </button>
                </li>
              ))
            )}
          </ul>
          <p className="AmountTasks">
            {toDo.length} {toDo.length === 1 ? "item left" : "items left"}
          </p>
        </div>
      </form >
    </div>
  );
};

export default Home;