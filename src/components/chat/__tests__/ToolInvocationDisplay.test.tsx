import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolInvocationDisplay } from "../ToolInvocationDisplay";

afterEach(() => {
  cleanup();
});

// str_replace_editor - create

test("shows 'Creating' while in progress for create command", () => {
  render(
    <ToolInvocationDisplay
      toolName="str_replace_editor"
      args={{ command: "create", path: "/App.jsx" }}
      state="call"
    />
  );
  expect(screen.getByText("Creating /App.jsx")).toBeDefined();
});

test("shows 'Created' when done for create command", () => {
  render(
    <ToolInvocationDisplay
      toolName="str_replace_editor"
      args={{ command: "create", path: "/components/Card.jsx" }}
      state="result"
    />
  );
  expect(screen.getByText("Created /components/Card.jsx")).toBeDefined();
});

// str_replace_editor - str_replace

test("shows 'Editing' while in progress for str_replace command", () => {
  render(
    <ToolInvocationDisplay
      toolName="str_replace_editor"
      args={{ command: "str_replace", path: "/App.jsx" }}
      state="call"
    />
  );
  expect(screen.getByText("Editing /App.jsx")).toBeDefined();
});

test("shows 'Edited' when done for str_replace command", () => {
  render(
    <ToolInvocationDisplay
      toolName="str_replace_editor"
      args={{ command: "str_replace", path: "/App.jsx" }}
      state="result"
    />
  );
  expect(screen.getByText("Edited /App.jsx")).toBeDefined();
});

// str_replace_editor - insert

test("shows 'Editing' for insert command", () => {
  render(
    <ToolInvocationDisplay
      toolName="str_replace_editor"
      args={{ command: "insert", path: "/utils.js" }}
      state="call"
    />
  );
  expect(screen.getByText("Editing /utils.js")).toBeDefined();
});

// str_replace_editor - view

test("shows 'Reading' while in progress for view command", () => {
  render(
    <ToolInvocationDisplay
      toolName="str_replace_editor"
      args={{ command: "view", path: "/App.jsx" }}
      state="call"
    />
  );
  expect(screen.getByText("Reading /App.jsx")).toBeDefined();
});

test("shows 'Read' when done for view command", () => {
  render(
    <ToolInvocationDisplay
      toolName="str_replace_editor"
      args={{ command: "view", path: "/App.jsx" }}
      state="result"
    />
  );
  expect(screen.getByText("Read /App.jsx")).toBeDefined();
});

// file_manager - delete

test("shows 'Deleting' while in progress for delete command", () => {
  render(
    <ToolInvocationDisplay
      toolName="file_manager"
      args={{ command: "delete", path: "/old-file.jsx" }}
      state="call"
    />
  );
  expect(screen.getByText("Deleting /old-file.jsx")).toBeDefined();
});

test("shows 'Deleted' when done for delete command", () => {
  render(
    <ToolInvocationDisplay
      toolName="file_manager"
      args={{ command: "delete", path: "/old-file.jsx" }}
      state="result"
    />
  );
  expect(screen.getByText("Deleted /old-file.jsx")).toBeDefined();
});

// file_manager - rename

test("shows 'Moving' while in progress for rename command", () => {
  render(
    <ToolInvocationDisplay
      toolName="file_manager"
      args={{ command: "rename", path: "/old.jsx", new_path: "/new.jsx" }}
      state="call"
    />
  );
  expect(screen.getByText("Moving /old.jsx")).toBeDefined();
});

test("shows 'Moved' with both paths when done for rename command", () => {
  render(
    <ToolInvocationDisplay
      toolName="file_manager"
      args={{ command: "rename", path: "/old.jsx", new_path: "/new.jsx" }}
      state="result"
    />
  );
  expect(screen.getByText("Moved /old.jsx to /new.jsx")).toBeDefined();
});

// unknown tool

test("falls back to tool name for unknown tools", () => {
  render(
    <ToolInvocationDisplay
      toolName="unknown_tool"
      args={{}}
      state="result"
    />
  );
  expect(screen.getByText("unknown_tool")).toBeDefined();
});

// partial-call state treated as in-progress

test("treats partial-call state as in-progress", () => {
  render(
    <ToolInvocationDisplay
      toolName="str_replace_editor"
      args={{ command: "create", path: "/App.jsx" }}
      state="partial-call"
    />
  );
  expect(screen.getByText("Creating /App.jsx")).toBeDefined();
});

// missing path

test("handles missing path gracefully", () => {
  render(
    <ToolInvocationDisplay
      toolName="str_replace_editor"
      args={{ command: "create" }}
      state="result"
    />
  );
  expect(screen.getByText("Created")).toBeDefined();
});
