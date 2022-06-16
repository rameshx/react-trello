import React, { useState } from "react";

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

function App() {
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

  return (
    <div className="App">
      {columns.map((column) => (
        <Column
          disableDelete={columns.length < 2}
          column={column}
          key={column.id}
          setColumns={setColumns}
        />
      ))}

      <button type="button" className="btn btn-add-column" onClick={addColumn}>
        +
      </button>
    </div>
  );
}

export default App;
