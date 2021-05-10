import React, { useEffect, useState } from "react";
import "./Todo.css";
import "font-awesome/css/font-awesome.min.css";
const axios = require("axios");
export default function Todo(props) {
  const data = props.todo;
  const [checked, setChecked] = useState(data.done);
  const [content, setContent] = useState(data.content);
  const [archived, setArchived] = useState(data.archived);
  const [editMode, setEditMode] = useState(false);
  const [allowed, setAllowed] = useState(true);
  const doneColor = "#5dc2af";
  useEffect(() => {
    if (props.filter === 0) {
      if (archived) {
        setAllowed(false);
      } else {
        setAllowed(true);
      }
    }
    if (props.filter === 1) {
      if (archived || checked) {
        setAllowed(false);
      } else {
        setAllowed(true);
      }
    }
    if (props.filter === 2) {
      if (archived || !checked) {
        setAllowed(false);
      } else {
        setAllowed(true);
      }
    }
    if (props.filter === 3) {
      if (!archived) {
        setAllowed(false);
      } else {
        setAllowed(true);
      }
    }
  }, [props.filter, archived, checked]);
  const handleSubmit = (e) => {
    e.preventDefault();
    setContent(e.target.value);
    setEditMode(false);
  };
  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      handleSubmit(e);
    }
  };
  const handleDelete = (id) => {
    axios
      .put(`${process.env.REACT_APP_API_URL}/todos/${id}`)
      .then((res) => {
        props.childFill(res.data);
        props.callback(data.id);
      })
      .catch((e) => {
        console.error(e.text);
      });
  };
  const handleArchive = (id) => {
    let state = Boolean(archived) !== true ? 1 : 0;
    axios
      .patch(`${process.env.REACT_APP_API_URL}/todos/${id}`, {
        archived: state,
      })
      .then((res) => {
        props.childFill(res.data);
        props.callback(data.id);
        setArchived(!archived);
      })
      .catch((e) => {
        console.error(e.text);
      });
  };
  const doTodo = (id) => {
    let state = Boolean(checked) !== true ? 1 : 0;
    axios
      .patch(`${process.env.REACT_APP_API_URL}/todos/${id}`, {
        done: state,
      })
      .then((res) => {
        props.childFill(res.data);
        props.callback(data.id);
        setChecked(!checked);
      })
      .catch((e) => {
        console.error(e.text);
      });
  };
  return (
    <>
      <li
        data-cat={data.category}
        style={
          ({ display: allowed ? "flex" : "none" },
          {
            display:
              props.catt === data.category || (!props.catt && allowed)
                ? "flex"
                : "none",
          })
        }
        className={archived ? "archived" : ""}
      >
        <div className="input">
          <input
            type="checkbox"
            id={data.id}
            checked={checked}
            onChange={(e) => {
              doTodo(e.target.id);
            }}
          />
          <label
            className="label"
            htmlFor={data.id}
            style={{ borderColor: checked ? doneColor : "#ccc" }}
          >
            <span style={{ visibility: checked ? "visible" : "hidden" }}>
              <i className="fa fa-check"></i>
            </span>
          </label>
        </div>
        <div className="content">
          <div className="form" style={{ display: editMode ? "flex" : "none" }}>
            <form
              onSubmit={(e) => {
                handleSubmit(e);
              }}
            >
              <input
                type="text"
                value={content}
                id={`input${data.id}`}
                onKeyDown={handleKeyDown}
                autoFocus={"e"}
                onChange={(e) => {
                  setContent(e.target.value);
                }}
              />
            </form>
          </div>
          <div
            className={checked ? "outputContent done" : "outputContent"}
            style={{ display: editMode ? "none" : "flex" }}
            onClick={() => {
              setEditMode(true);
              setTimeout(() => {
                document.getElementById(`input${data.id}`).focus();
              }, 10);
            }}
          >
            <h6>{content}</h6>
          </div>
          <div
            className="remove"
            style={{ display: editMode ? "none" : "flex" }}
          >
            <span
              onClick={() => {
                handleDelete(data.id);
              }}
            >
              <i className="fa fa-times"></i>
            </span>
          </div>
          <div
            className="archive"
            style={{ display: editMode ? "none" : "flex" }}
          >
            <span
              onClick={() => {
                handleArchive(data.id);
              }}
            >
              <i className="fa fa-archive"></i>
            </span>
          </div>
        </div>
      </li>
    </>
  );
}
