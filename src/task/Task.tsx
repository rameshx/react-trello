import React, {
  ChangeEventHandler,
  Dispatch,
  FC,
  SetStateAction,
  useState,
} from "react";

import { ColumnType, DragData, TaskType } from "../App";

import "./Task.css";

interface TaskProps {
  task: TaskType;
  setColumns: Dispatch<SetStateAction<ColumnType[]>>;
  columnId: string;
  handleDragStart: (arg: DragData) => void;
}

const Task: FC<TaskProps> = ({
  task,
  setColumns,
  columnId,
  handleDragStart,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [taskTitle, setTaskTitle] = useState<string>(task.title);

  const updateTitle: ChangeEventHandler<HTMLInputElement> = ({
    target: { value },
  }) => {
    setTaskTitle(value);
  };

  const handleSave = () => {
    setIsEditing(false);
    setColumns((prev) => {
      return prev.map((x) => {
        if (x.id === columnId) {
          return {
            ...x,
            tasks: x.tasks.map((element) => {
              if (task.id === element.id) {
                return {
                  ...element,
                  title: taskTitle,
                };
              }
              return element;
            }),
          };
        }
        return x;
      });
    });
  };

  const deleteTask = () => {
    setColumns((prev) => {
      return prev.map((x) => {
        if (x.id === columnId) {
          return {
            ...x,
            tasks: x.tasks.filter((element) => task.id !== element.id),
          };
        }
        return x;
      });
    });
  };

  return (
    <div
      className="task"
      draggable
      onDragStart={() =>
        handleDragStart({ taskId: task.id, columnId: columnId })
      }
    >
      <div className="title">
        {isEditing ? (
          <input
            type="text"
            value={taskTitle}
            onChange={updateTitle}
            onBlur={handleSave}
            ref={(input) => input && input.focus()}
          />
        ) : (
          <p>{task.title}</p>
        )}
      </div>

      {!isEditing && (
        <div className="actions">
          <button
            type="button"
            className="btn btn-task-edit"
            onClick={() => setIsEditing(true)}
          >
            I
          </button>
          <button
            type="button"
            className="btn btn-task-delete"
            onClick={deleteTask}
          >
            X
          </button>
        </div>
      )}
    </div>
  );
};

export default Task;
