import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";

const addTask = () => {
  const { getByPlaceholderText } = render(<App />);

  fireEvent.change(getByPlaceholderText("Add Task"), {
    target: { value: "foo" },
  });
  fireEvent.click(screen.getByLabelText("Add Task"));
};

test("renders one column by default", () => {
  render(<App />);

  expect(screen.getByRole("heading")).toBeInTheDocument();
});

test("adds new columns", () => {
  render(<App />);

  const existingColumns = screen.getAllByRole("heading").length;

  fireEvent.click(screen.getByTestId("btn-add-column"));

  expect(screen.getAllByRole("heading")).toHaveLength(existingColumns + 1);
});

test("disables/enables delete based on number of columns", () => {
  render(<App />);

  expect(screen.getByText("Delete")).toBeDisabled();

  fireEvent.click(screen.getByTestId("btn-add-column"));

  screen.getAllByText("Delete").forEach((deleteButton) => {
    expect(deleteButton).toBeEnabled();
  });

  fireEvent.click(screen.getAllByText("Delete")[0]);

  expect(screen.getByText("Delete")).toBeDisabled();
});

test("adds a task to a column", () => {
  addTask();
  expect(screen.getByText("foo")).toBeInTheDocument();
});

test("edits a task in a column", () => {
  addTask();

  fireEvent.click(
    screen
      .getByText("foo")
      .closest(".task")!
      .querySelector('[aria-label="Edit Task"]')!
  );

  const task = screen.getByDisplayValue("foo");

  expect(task).toBeInTheDocument();

  fireEvent.change(task, {
    target: { value: "bla" },
  });
  fireEvent.blur(task);

  expect(screen.getByText("bla")).toBeInTheDocument();
  expect(screen.queryByText("foo")).not.toBeInTheDocument();
});

test("deletes a task in a column", () => {
  addTask();

  fireEvent.click(
    screen
      .getByText("foo")
      .closest(".task")!
      .querySelector('[aria-label="Delete Task"]')!
  );

  expect(screen.queryByText("foo")).not.toBeInTheDocument();
});

test("prevents adding a task if the input's value is whitespace", () => {
  const { getByPlaceholderText } = render(<App />);

  const previousTasks = screen.getAllByLabelText("Edit Task").length;

  fireEvent.change(getByPlaceholderText("Add Task"), {
    target: { value: "  " },
  });
  fireEvent.click(screen.getByLabelText("Add Task"));

  expect(screen.getAllByLabelText("Edit Task")).toHaveLength(previousTasks);
});
