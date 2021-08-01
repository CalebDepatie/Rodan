import React, { useState, useEffect, useRef } from 'react';
import g from 'guark';

import { ListBox } from 'primereact/listbox';

function Boards(props:any) {
  const [ boardHeads, setBoardHeads ]  = useState([]);
  const [ frags, setFrags ]            = useState([]);
  const [ statuses, setStatuses ]      = useState([]);
  const [ activeBoard, setActiveBoard] = useState('');
  const [ form, setForm ]              = useState<{[key: string]: any}>({});

  useEffect(() => {
    const setupData = async () => {
      const statuses = JSON.parse(await g.call("get_statuses", {})
        .catch(error => {
          console.error('Error Getting Data', error);
          return "";
        }));

      setStatuses(statuses);

      const heads = JSON.parse(await g.call("get_board_heads", {}))
        .catch(error => {
          console.error('Error Getting Data', error);
          return "";
        }));

      setBoardHeads(heads);
    };
    setupData();
  }, []);

  useEffect(() => {

  }, [activeBoard]);

  return (
    <div>
      <div style={{float: "left", width: "30%"}}>
        
      </div>
      <div style={{float: "left", width: "70%"}}>

      </div>
    </div>
  );
};

export default Boards;
