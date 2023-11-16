const { clipboard, ipcRenderer } = require("electron");
const shell = require("electron").shell;
const { getProjects, createTask } = require("./api/todoist-api");
const menuCloseButton = document.querySelector(".menu--close");
const projectElement = document.querySelector("#project");
const formElement = document.querySelector(".task-form");
const appElement = document.querySelector("#app");
const taskAddedPageId = "#task-added-screen";
const doneButton = document.querySelector(`${taskAddedPageId} .done-button`);
const copyButton = document.querySelector(`${taskAddedPageId} .copy-button`);

setup();

function copyToClipboard() {
  const linkElement = document.querySelector(
    `${taskAddedPageId} .task-title--link`
  );
  clipboard.writeText(linkElement.getAttribute("href"));
}

function createTaskLinkElement(text, url) {
  const taskLinkElement = document.createElement("a");
  taskLinkElement.classList.add("task-title--link");
  taskLinkElement.setAttribute("href", url);
  taskLinkElement.setAttribute("target", "_blank");
  taskLinkElement.textContent = text;
  return taskLinkElement;
}

async function setup() {
  const [projects, error] = await getProjects();
  if (error) {
    alert(error);
    return;
  }
  populateProjectMenu(projects);
}

function populateProjectMenu(data) {
  for (let i = 0; i < data.length; i++) {
    project_name = data[i].name;
    project_id = data[i].id;
    optionElement = createOption(project_name, project_id);
    projectElement.appendChild(optionElement);
  }
}

function createOption(value, id) {
  const option = document.createElement("option");
  option.setAttribute("value", value);
  option.textContent = value;
  option.dataset.id = id;
  return option;
}

formElement.addEventListener("submit", async (event) => {
  event.preventDefault();
  const taskNameElement = document.querySelector("#task-name");
  const taskDescriptionElement = document.querySelector("#task-description");
  const taskDueElement = document.querySelector("#due-date");
  const optionElement = projectElement.options[projectElement.selectedIndex];
  const project_id = optionElement.dataset.id;

  const [task, error] = await createTask(
    taskNameElement.value,
    taskDescriptionElement.value,
    project_id,
    taskDueElement.value
  );

  if (error) {
    alert(error);
    return;
  }

  const taskTitleElement = document.querySelector(
    `${taskAddedPageId} .task-title`
  );

  const taskLinkElement = createTaskLinkElement(
    taskNameElement.value,
    task.url
  );
  taskTitleElement.appendChild(taskLinkElement);
  appElement.dataset.state = "task-added-screen";

  ipcRenderer.send("resize", { width: 400, height: 150 });
});

copyButton.addEventListener("click", copyToClipboard);
doneButton.addEventListener("click", () => {
  formElement.reset();
  const taskTitleElement = document.querySelector(
    `${taskAddedPageId} .task-title`
  );
  taskTitleElement.removeChild(taskTitleElement.lastChild);
  appElement.dataset.state = "add-task-screen";
  ipcRenderer.send("resize", { width: 410, height: 500 });
});

menuCloseButton.addEventListener("click", () => {
  ipcRenderer.send("quit-app");
});
