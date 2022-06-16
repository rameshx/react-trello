import React, { DragEventHandler, useState } from "react";

import "./App.css";
import Column from "./column/Column";

export interface TaskType {
  id: string;
  title: string;
}

export interface ColumnType {
  id: string;
  title: string;
  tasks: TaskType[];
}

export interface DragData {
  taskId: string;
  columnId: string;
}

function App() {
  const [dragData, setDragData] = useState<DragData>();
  const [columns, setColumns] = useState<ColumnType[]>(() => {
    return [
      {
        title: "Card - 1",
        id: Math.random().toString(),
        tasks: [
          {
            title: "task - 1",
            id: Math.random().toString(),
          },
        ],
      },
    ];
  });

  const addColumn = () => {
    setColumns((prev) => [
      ...prev,
      {
        title: "",
        id: Math.random().toString(),
        tasks: [],
      },
    ]);
  };

  const handleDragStart = (data: DragData) => {
    setDragData(data);
  };

  const handleDragOver: DragEventHandler = (e) => {
    e.preventDefault();
  };

  const handleDrop = (columnId: string) => {
    if (!dragData) return;
    if (dragData.columnId === columnId) return;

    setColumns((prev) => {
      const taskToMove = {
        ...prev
          .find((x) => x.id === dragData.columnId)!
          .tasks.find((t) => t.id === dragData.taskId)!,
      };
      const updatedColumns = prev.map((c) => {
        if (c.id === dragData.columnId) {
          return {
            ...c,
            tasks: c.tasks.filter((t) => t.id !== dragData.taskId),
          };
        }
        if (c.id === columnId) {
          return {
            ...c,
            tasks: [...c.tasks, taskToMove],
          };
        }
        return c;
      });
      return updatedColumns;
    });
  };

  return (
    <div className="App">
      {columns.map((column) => (
        <Column
          disableDelete={columns.length < 2}
          column={column}
          key={column.id}
          setColumns={setColumns}
          handleDragOver={handleDragOver}
          handleDragStart={handleDragStart}
          handleDrop={handleDrop}
        />
      ))}

      <button type="button" className="btn btn-add-column" onClick={addColumn}>
        +
      </button>
    </div>
  );
}

export default App;
