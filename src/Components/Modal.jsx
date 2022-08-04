import '../App.css'
export const Modal = (params) => {
  const { name, value } = params.data;

  let a = (
    `<div class="info-content">
      <p class="title">${name}</p>
      <hr/>
      ${value.map((info) => {
        return (
          `<div>
            <p class="subtitle">${Object.keys(info)[0]}</p>
            <p class="paragraph">
              ${Object.values(info)[0]}
            </p>
          </div>`
        )
      })}
    </div>`
  );

  let c = `<div>
      <h4 className='text_content'>Hola desde ${name}</h4>
      ${value.map((info) => {
        return `<div className='text_content'><p><span style='font-weight:bold'>${
          Object.keys(info)[0]
        }: </span><span>${
          Object.values(info)[0]
        } Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </span></p></div><br/>`;
      })}
    </div>`;
  return a.toString();
};
