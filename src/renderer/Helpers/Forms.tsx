export const fieldGen = (form: any, setForm:any) =>
  (field: string) => {
    return {
      value: form[field],
      onChange: (e: any) => setForm(curForm => ({...curForm, [field]: e.target.value}))
    };
};

export const fieldValGen = (form: any, setForm:any) =>
  (field: string) => {
    return {
      value: form[field],
      onChange: (e: any) => setForm(curForm => ({...curForm, [field]: e.value}))
    };
};
