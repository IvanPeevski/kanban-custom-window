import "smart-webcomponents-react/source/styles/smart.default.css";

import { useRef } from "react";

import { Tabs, TabItem } from "smart-webcomponents-react/tabs";

import { Kanban } from "smart-webcomponents-react/kanban";
import { Window } from "smart-webcomponents-react/window";
import { Input } from "smart-webcomponents-react/input";
import { MultiComboInput } from "smart-webcomponents-react/multicomboinput";
import { NumericTextBox } from "smart-webcomponents-react/numerictextbox";
import { DateTimePicker } from 'smart-webcomponents-react/datetimepicker';
import { Button } from 'smart-webcomponents-react/button';
import { useEffect,useState } from 'react'
import { useDispatch } from 'react-redux'
import { kanban } from '../redux/actions/kanban'
import store from "../redux/store";

export const Kanban1 = () => {

  const dispatch = useDispatch();

  let [kanbanData, setKanbanData] = useState([]);

  useEffect(() => {
      dispatch(kanban())
      .then(() => {
        setKanbanData(store.getState().kanbanReducer.kanban)
      });
  }, []);



  const kanbanRef = useRef();
  const editWindowRef = useRef();

  const textRef = useRef();
  const descriptionRef = useRef();
  const statusRef = useRef();
  const progressRef = useRef();
  const startDateRef = useRef();
  const dueDateRef = useRef();
  const tagsRef = useRef();
  const projectNameRef = useRef();
  const issueTitleRef = useRef();
  const observationRef = useRef();

  const currentTask = useRef(null);

  kanbanData = [
    {
      id: 1,
      text: "Andrew",
      description: "Andrew's task",
      status: "new",
      progress: 0,
      tags: ["bug", "new"],
      projectName: "Project 1",
      issueTitle: "Issue 1",
      observation: "Observation 1",
      startDate: "2021-01-01",
      dueDate: "2021-01-05"
    }
  ]

  const kanbanSettings = {
    //addNewColumn: true,
    allowColumnRemove: true,
    collapsible: true,
    //addNewButton: true,
    editable: true,
    columnActions: false,
    columnEditMode: "menu",
    columnFooter: true,
    columnSummary: true,
    columnColors: true,
    columnColorEntireSurface: true,
    allowColumnEdit: true,
    allowColumnReorder: true,
    textTemplate: function (settings) {
      const data = settings.data, task = settings.task, text = settings.text;
    
    settings.text = `
    <div style="width: 100%;">
      <div><span style="color: blue; font-weight: bold;">REC ID :</span> ${data.id}</div>
      <div><span style="color: blue; font-weight: bold;">Responsible Person :</span> ${data.text}</div>
      <div><span style="color: blue; font-weight: bold;">Recommendation : </span> ${data.description}</div>
    </div>
  `;
  },
  taskUserIcon : false,
    dataSource: kanbanData,
    taskDue: true,
    taskActions: true,
    taskProgress: true,
    taskComments: true,
    users: [
      { id: 0, name: "Andrew", image: "../../images/people/andrew.png" },
      { id: 1, name: "Anne", image: "../../images/people/anne.png" },
      { id: 2, name: "Janet", image: "../../images/people/janet.png" },
      { id: 3, name: "John", image: "../../images/people/john.png" },
      { id: 4, name: "Laura", image: "../../images/people/laura.png" }
    ],
    currentUser: 0,
    columns: [
      { color: "#33B679", label: "New", dataField: "new", allowHide: false },
      { color: "#8E24AA", label: "In progress", dataField: "inProgress" },
      { color: "#039BE5", label: "Blocked", dataField: "blocked" },
      { color: "#DD5347", label: "Closed", dataField: "closed", addNewButton: false }
    ],
    taskCustomFields: [
      {
        label: "Project Name",
        dataField: "projectName",
      }, {
        label: "Issue Title",
        dataField: "issueTitle"
      }, {
        label: "Observation",
        dataField: "observation"
      }
    ]
  }

 
  const statusInputDataSource = kanbanSettings.columns
    .map(c => ({ color: c.color, label: c.label, value: c.dataField }));

  const editWindowOkClick = () => {

    const newData = {
      text: textRef.current.value,
      description: descriptionRef.current.value,
      progress: progressRef.current.value,
      status: statusRef.current.dataSource.find(i => i.label === statusRef.current.value)?.value,
      startDate: startDateRef.current.getDate(),
      dueDate: dueDateRef.current.getDate(),
      tags: tagsRef.current.value
    }

    if (projectNameRef.current.value) { newData.projectName = projectNameRef.current.value }
    if (issueTitleRef.current.value) { newData.issueTitle = issueTitleRef.current.value }
    if (observationRef.current.value) { newData.observation = observationRef.current.value }

    kanbanRef.current.updateTask(currentTask.current.id, newData);

    editWindowRef.current.close()
  }

  const editWindowCancelClick = () => {
    editWindowRef.current.close()
  }

  const onKanbanEditOpening = (e) => {
    if (e.detail.purpose === 'edit') {
      e.preventDefault();

      currentTask.current = e.detail.task.data;

      editWindowRef.current.open()
      
      editWindowRef.current.label = `${currentTask.current.id}`;

      textRef.current.value = currentTask.current.text;
      descriptionRef.current.value = currentTask.current.description;
      statusRef.current.value = currentTask.current.status;
      progressRef.current.value = currentTask.current.progress;
      startDateRef.current.setDate(currentTask.current.startDate);
      dueDateRef.current.setDate(currentTask.current.dueDate);
      tagsRef.current.value = currentTask.current.tags;
      projectNameRef.current.value = currentTask.current.projectName || '';
      issueTitleRef.current.value = currentTask.current.issueTitle || '';
      observationRef.current.value = currentTask.current.observation || '';
    }
  }

  return (
    <div>
      <Kanban ref={kanbanRef} {...kanbanSettings} onOpening={onKanbanEditOpening} id="kanban"></Kanban>
      <Window ref={editWindowRef} id="edit-window" h>
        <div style={{ width: '100%', height: '100%' }}>
          <Tabs id="edit-window-tabs">
            <TabItem label="recommendation">
              <div>
                <div className="editor-label">responsible person</div>
                <Input ref={textRef} className="text-editor editor" readonly></Input>
                <div className="editor-label">recommendation</div>
                <textarea ref={descriptionRef} className="description-editor editor" readOnly></textarea>
                <div className="editor-label">status</div>
                <MultiComboInput
                  ref={statusRef}
                  className="status-editor editor"
                  singleSelect pills colorItems
                  drop-down-button-position="right"
                  animation="advanced"
                  dataSource={statusInputDataSource}
                ></MultiComboInput>
                <div className="editor-label">progress</div>
                <NumericTextBox ref={progressRef} className="editor"
                  min={0} max={100} inputFormat="floatingPoint" showUnit unit="%" animation="advanced" significantDigits={8}
                />
                <div style={{ display: 'flex', gap: '10px' }}>
                  <div className="editor">
                    <div className="editor-label">Revised date</div>
                    <DateTimePicker ref={startDateRef} autoClose calendarButton dropDownAppendTo="body"
                      dropDownDisplayMode="calendar" formatString="d" nullable animation="advanced"></DateTimePicker>
                  </div>
                  <div className="editor">
                    <div className="editor-label">due date</div>
                    <DateTimePicker ref={dueDateRef} autoClose calendarButton dropDownAppendTo="body"
                      dropDownDisplayMode="calendar" formatString="d" nullable animation="advanced"></DateTimePicker>
                  </div>
                </div>
                <div className="editor-label">tags</div>
                <MultiComboInput
                  ref={tagsRef}
                  className="tags-editor editor"
                  selectAll
                  drop-down-button-position="right"
                  animation="advanced"
                />
              </div>
            </TabItem>
            <TabItem label="details">
              <div>
                <div className="editor-label">project name</div>
                <textarea ref={projectNameRef} className="description-editor editor"></textarea>
                <div className="editor-label">issue title</div>
                <textarea ref={issueTitleRef} className="description-editor editor"></textarea>
                <div className="editor-label">observation</div>
                <textarea ref={observationRef} className="description-editor editor"></textarea>
              </div>
            </TabItem>
          </Tabs>
          <div id="edit-window-buttons">
            <Button className="primary edit-window-button" onClick={editWindowOkClick}>Ok</Button>
            <Button className="edit-window-button" onClick={editWindowCancelClick}>Cancel</Button>
          </div>
        </div>
      </Window>
    </div >
  )
}

export default Kanban1;
