import './status.scss';

function statusValueTemplate(option:any, props:any) {
  if (option) {
    return <div className={`status-${option.id}`} >{option.name}</div>
  }
};

function statusItemTemplate(option:any) {
  return <div className={`status-${option.id}`} >{option.name}</div>
};

export {statusValueTemplate, statusItemTemplate};
