// import e from "cors";
import React, { useState, useEffect } from "react";
import "./App.css";
import Todo from "./Todo";
const axios = require("axios");

export default function App() {
  const [lists, setLists] = useState([]);
  const [todos, setTodos] = useState([]);
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [noCat, setNoCat] = useState(false);
  const [filter, setFilter] = useState(0);
  const [reload, setReload] = useState("");
  const [newList, setNewList] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [count, setCount] = useState(0);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const counter = () => {
    let c = todos.filter((todo) => {
      return !todo.done && !todo.archived;
    });
    setCount(c.length);
  };
  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      addTodo(e);
    }
  };
  const handleListKeyDown = (e) => {
    if (e.keyCode === 13) {
      addList(e);
    }
  };
  const addTodo = (e) => {
    e.preventDefault();
    const body = {
      content,
      category,
    };
    if (!category) {
      setNoCat(true);
    }
    axios
      .post(`${process.env.REACT_APP_API_URL}/todos`, body)
      .then((res) => {
        setTodos(res.data);
        if (category) {
          setContent("");
          setNoCat(false);
        }
      })
      .catch((e) => {
        console.error(e.text);
      });
  };
  const removeDone = (e) => {
    axios
      .put(`${process.env.REACT_APP_API_URL}/todos/delete/allDone`)
      .then((res) => {
        setTodos(res.data);
      })
      .catch((e) => {
        console.error(e.text);
      });
  };
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/todos`)
      .then((res) => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        setTodos(res.data);
      })
      .catch((e) => {
        console.error(e.text);
      });
  }, [reload]);
  useEffect(() => {
    todos.map((todo) => {
      if (lists.indexOf(todo.category) === -1) {
        setLists([...lists, todo.category]);
      }
      return null;
    });
    counter();
  }, [todos, lists, counter]);

  const addList = (e) => {
    e.preventDefault();
    setLists([...lists, newList]);
    setEditMode(!editMode);
  };
  return (
    <>
      <div className="container">
        <h1>Todo App</h1>
        <div className="header">
          <div className="inputField">
            <form
              onSubmit={(e) => {
                addTodo(e);
              }}
            >
              <input
                onKeyDown={handleKeyDown}
                type="text"
                placeholder="What do you have to do ?"
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                }}
              />
            </form>
          </div>
          <div className="listPicker">
            <button
              onClick={() => {
                setEditMode(!editMode);
              }}
            >
              Add list
            </button>
            <form
              style={{ display: editMode ? "flex" : "none" }}
              onSubmit={(e) => {
                addList(e);
              }}
            >
              <input
                onKeyDown={handleListKeyDown}
                type="text"
                value={newList}
                className={noCat ? "required" : ""}
                placeholder="list ..."
                style={{ display: editMode ? "flex" : "none" }}
                onChange={(e) => {
                  if (newList.indexOf("list ") === -1) {
                    setNewList("list ");
                  } else {
                    setNewList(e.target.value);
                  }
                }}
              />
            </form>
            <select
              style={{ display: editMode ? "none" : "flex" }}
              className={noCat ? "required" : ""}
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
              }}
            >
              <option value="">All</option>
              {lists.map((list) => {
                return (
                  <option key={lists.indexOf(list)} value={list}>
                    {list}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
        <ul>
          {todos.map((todo) => {
            return (
              <Todo
                key={todo.id}
                todo={todo}
                callback={setReload}
                childFill={setTodos}
                filter={filter}
                catt={category}
              />
            );
          })}
        </ul>
        <div className="footer">
          <small className="itemCounter">
            {count} {count === 1 ? "item" : "items"} left
          </small>
          <div className="controlButtons">
            <div className="item">
              <label
                htmlFor="All"
                value={0}
                className={filter === 0 ? "active" : ""}
                onClick={() => {
                  setFilter(0);
                }}
              >
                All
              </label>
              <input type="checkbox" id="All" />
            </div>
            <div className="item">
              <label
                htmlFor="Active"
                value={1}
                className={filter === 1 ? "active" : ""}
                onClick={() => {
                  setFilter(1);
                }}
              >
                Active
              </label>
              <input type="checkbox" id="Active" />
            </div>
            <div className="item">
              <label
                htmlFor="Completed"
                value={2}
                className={filter === 2 ? "active" : ""}
                onClick={() => {
                  setFilter(2);
                }}
              >
                Completed
              </label>
              <input type="checkbox" id="Completed" />
            </div>
            <div className="item">
              <label
                htmlFor="Archived"
                value={3}
                className={filter === 3 ? "active" : ""}
                onClick={() => {
                  setFilter(3);
                }}
              >
                Archived
              </label>
              <input type="checkbox" id="Archived" />
            </div>
          </div>
          <div className="clearFunction">
            <button onClick={removeDone}>Clear completed</button>
          </div>
        </div>
      </div>
    </>
  );
}
