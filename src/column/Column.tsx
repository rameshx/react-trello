import React, { Dispatch, FC, SetStateAction, useState } from "react";
import { ColumnType } from "../App";
import Task from "../task/Task";

import "./Column.css";

interface ColumnProps {
  column: ColumnType;
  disableDelete: boolean;
  setColumns: Dispatch<SetStateAction<ColumnType[]>>;
}

const Column: FC<ColumnProps> = ({ column, setColumns, disableDelete }) => {
  const [newTask, setNewTask] = useState("");
  const [columnTitle, setColumnTitle] = useState(column.title);
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const addTask = () => {
    if (!newTask.trim()) return;

    setColumns((prev) => {
      return prev.map((x) => {
        if (x.id === column.id) {
          return {
            ...x,
            tasks: [
              ...x.tasks,
              {
                title: newTask.trim(),
                id: Math.random().toString(),
              },
            ],
          };
        }
        return x;
      });
    });
    setNewTask("");
  };

  const deleteColumn = () => {
    setColumns((prev) => prev.filter((c) => c.id !== column.id));
  };

  const updateColumnTitle = () => {
    setColumns((prev) =>
      prev.map((c) =>
        c.id === column.id
          ? {
              ...c,
              title: columnTitle,
            }
          : c
      )
    );
    setIsEditingTitle(false);
  };

  return (
    <div className="column">
      <div className="column-title" onClick={() => setIsEditingTitle(true)}>
        {isEditingTitle ? (
          <input
            type="text"
            value={columnTitle}
            onChange={({ target: { value } }) => setColumnTitle(value)}
            onBlur={updateColumnTitle}
            ref={(input) => input && input.focus()}
          />
        ) : (
          <h3>{column.title.trim() || "Enter Title"}</h3>
        )}
      </div>

      {column.tasks.map((task) => (
        <Task
          task={task}
          key={task.id}
          columnId={column.id}
          setColumns={setColumns}
        />
      ))}

      <div className="new-task">
        <input
          type="text"
          placeholder="Add Task"
          value={newTask}
          onChange={({ target: { value } }) => setNewTask(value)}
        />
        <button type="button" className="btn" onClick={addTask}>
          +
        </button>
      </div>

      <button
        className="btn btn-delete-column"
        type="button"
        onClick={deleteColumn}
        disabled={disableDelete}
      >
        Delete
      </button>
    </div>
  );
};

export default Column;
