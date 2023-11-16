const API_KEY = "";
const { projectsEndpoint, tasksEndpoint } = require("./endpoints");

async function getProjects() {
  let result = null;
  let error = null;
  try {
    const response = await fetch(projectsEndpoint, {
      headers: { Authorization: `Bearer ${API_KEY}` },
    });
    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }
    result = await response.json();
  } catch (e) {
    console.log(e);
    error = `Unable to fetch tasks from todoist ${e}`;
  } finally {
    return [result, error];
  }
}

async function createTask(name, description, project_id, due_date) {
  let result = null;
  let error = null;

  const data = {
    content: name,
    description: description,
    project_id: project_id,
    due_string: due_date,
  };

  try {
    const response = await fetch(tasksEndpoint, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }
    result = await response.json();
  } catch (e) {
    console.log(e);
    error = `Unable to create task ${e}`;
  } finally {
    return [result, error];
  }
}

module.exports = {
  getProjects: getProjects,
  createTask: createTask,
};
