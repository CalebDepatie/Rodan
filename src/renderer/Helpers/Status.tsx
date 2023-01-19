import './status.scss';

interface StatusOption {
  id: string,
  name: string,
}

function statusValueTemplate(option:StatusOption, props:any) {
  if (option) {
    return <div className={`status-${option.id}`} >{option.name}</div>
  }
};

function statusItemTemplate(option:StatusOption) {
  return <div className={`status-${option.id}`} >{option.name}</div>
};

export {statusValueTemplate, statusItemTemplate};
