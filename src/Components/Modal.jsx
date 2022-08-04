export const Modal = (params) => {
  const { name, value } = params.data;

  let c = `<div>
      <h4>Hola desde ${name}</h4>
      ${value.map((info) => {
        return `<div><p><span style='font-weight:bold'>${
          Object.keys(info)[0]
        }: </span><span>${Object.values(info)[0]}</span></p></div><br/>`;
      })}
    </div>`;
  return c.toString();
};
