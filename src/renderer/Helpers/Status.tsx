import { Status } from "../Components";

function statusValueTemplate(option:any, props:any) {
  if (option) {
    return <Status id={option.id} name={option.name} colour={option.colour} descrip={option.descrip}  />
  }
};

function statusItemTemplate(option:any) {
  return <Status id={option.id} name={option.name} colour={option.colour} descrip={option.descrip}  />
};

export {statusValueTemplate, statusItemTemplate};
