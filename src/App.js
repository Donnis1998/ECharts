import "./App.css";
import * as echarts from "echarts";
import { useEffect, useState } from "react";
import { TextBox } from "@bsoftsolution/base-ui.ui.textbox";
import { DropdownList } from "@bsoftsolution/base-ui.ui.drop-down-list";
function App() {
  // initialize the echarts instance
  const [prevNodo, setPrevNodo] = useState("");
  const [nodo, setNodo] = useState("");
  const [keyValue, setKeyValue] = useState("");
  const [contentValue, setContentValue] = useState("");
  const [listValue, setlistValue] = useState([]);
  const [listData, setListData] = useState([]);
  const [listNode, setListNode] = useState([
    /* { id: "bsoft", label: "bsoft" },
    { id: "bsoft.risk", label: "bsoft.risk" }, */
  ]);

  const data = {
    name: "BSoft", //nombre de la etiqueta que se visualizar en el arbol
    value: [
      { content: "Describe all about the modulo general BSoft" },
      { props: "Propiedades acerca de Modulo BSoft" },
    ],
    label: {
      //permite cambiar estulos de la etiqueta de este nodo unicamente
      color: "green",
      size: 20,
    },
    collapsed: true, // hace que el arbol inicie con todas su ramas cerradas
    children: [
      {
        name: "data",
        children: [
          {
            name: "converters",
            children: [
              { name: "Converters", value: 721 },
              { name: "DelimitedTextConverter", value: 4294 },
            ],
          },
          {
            name: "Modulo 2",
            value: [
              { content: "Describe all about the modulo 2" },
              { props: "Propiedades acerca de Modulo 2" },
            ],
            //value: 3322,
          },
        ],
      },
      {
        name: "display",
        children: [
          { name: "DirtySprite", value: 8833 },
          { name: "LineSprite", value: 1732 },
          { name: "RectSprite", value: 3623 },
        ],
      },
      {
        name: "flex",
        children: [{ name: "FlareVis", value: 4116 }],
      },
      {
        name: "query",
        children: [
          { name: "AggregateExpression", value: 1616 },
          { name: "And", value: 1027 },
          { name: "Arithmetic", value: 3891 },
          { name: "Average", value: 891 },
          { name: "BinaryExpression", value: 2893 },
          { name: "Comparison", value: 5103 },
          { name: "CompositeExpression", value: 3677 },
          { name: "Count", value: 781 },
          { name: "DateUtil", value: 4141 },
          { name: "Distinct", value: 933 },
          { name: "Expression", value: 5130 },
          { name: "ExpressionIterator", value: 3617 },
          { name: "Fn", value: 3240 },
          { name: "If", value: 2732 },
          { name: "IsA", value: 2039 },
          { name: "Literal", value: 1214 },
          { name: "Match", value: 3748 },
          { name: "Maximum", value: 843 },
          {
            name: "methods",
            children: [
              { name: "add", value: 593 },
              { name: "and", value: 330 },
              { name: "average", value: 287 },
              { name: "count", value: 277 },
              { name: "distinct", value: 292 },
              { name: "div", value: 595 },
              { name: "eq", value: 594 },
              { name: "fn", value: 460 },
              { name: "gt", value: 603 },
              { name: "gte", value: 625 },
              { name: "iff", value: 748 },
              { name: "isa", value: 461 },
              { name: "lt", value: 597 },
              { name: "lte", value: 619 },
              { name: "max", value: 283 },
              { name: "min", value: 283 },
              { name: "mod", value: 591 },
              { name: "mul", value: 603 },
              { name: "neq", value: 599 },
              { name: "not", value: 386 },
              { name: "or", value: 323 },
              { name: "orderby", value: 307 },
              { name: "range", value: 772 },
              { name: "select", value: 296 },
              { name: "stddev", value: 363 },
              { name: "sub", value: 600 },
              { name: "sum", value: 280 },
              { name: "update", value: 307 },
              { name: "variance", value: 335 },
              { name: "where", value: 299 },
              { name: "xor", value: 354 },
              { name: "x_x", value: 264 },
            ],
          },
          { name: "Minimum", value: 843 },
          { name: "Not", value: 1554 },
          { name: "Or", value: 970 },
          { name: "Query", value: 13896 },
          { name: "Range", value: 1594 },
          { name: "StringUtil", value: 4130 },
          { name: "Sum", value: 791 },
          { name: "Variable", value: 1124 },
          { name: "Variance", value: 1876 },
          { name: "Xor", value: 1101 },
        ],
      },
      {
        name: "scale",
        children: [
          { name: "IScaleMap", value: 2105 },
          { name: "LinearScale", value: 1316 },
          { name: "LogScale", value: 3151 },
          { name: "OrdinalScale", value: 3770 },
          { name: "QuantileScale", value: 2435 },
          { name: "QuantitativeScale", value: 4839 },
          { name: "RootScale", value: 1756 },
          { name: "Scale", value: 4268 },
          { name: "ScaleType", value: 1821 },
          { name: "TimeScale", value: 5833 },
        ],
      },
    ],
  };

  const customComponent2 = (params) => {
    const { name, value } = params.data;

    let c = `<div>
      <h4>Hola desde ${name}</h4>
      ${value.map(info =>{
        return (
          `<div style={{width: 100}}><p><span style='font-weight:bold'>${
            Object.keys(info)[0]
          }: </span><span>${Object.values(info)[0]}Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</span></p></div><br/>`
        )
      })}
    </div>`;


    /* param.data.value.map((info) => {
      message += `<div style='width: 10px, display:flex'><span style='font-weight:bold'>${
        Object.keys(info)[0]
      }: </span><span>${Object.values(info)[0]}</span><br/></div>`;
    }); */

    return c.toString();
  };

  const customComponent = `<div>
      <h4>Hola desde customComponent</h4>
    </div>`;

  const option = {
    title: {
      id: "1",
      show: true,
      text: "BSoft Dependencies",
      subtext: "All dependencies in bsoft",
      link: "https://www.youtube.com/", //Este enlace se activará cuando se de click en el titulo
      target: "blank", //self //blank para abrir en una nueva pestaña
      left: 20, // '20%' // left // center // right
      top: 20, // '20%' // left // center // right
      textStyle: {
        fontSize: 30,
        fontStyle: "normal", // italic // oblique
        fontWeight: "bold", // normal // bolder // lighter // 100, 200, ...
        //width: 50,
        //height: 50,
      },
      subtextStyle: {
        fontSize: 20,
      },
    },
    tooltip: {
      show: true,
      trigger: "item", //axis //none
      triggerOn: "mousemove", //click
      showContent: true, //false
      alwaysShowContent: false,
      //showDelay: 100,
      //hideDelay: 100,
      //zLevel: 2,
      //position:[10, 10],
      renderMode: "html", // richText
      //confine: true,
      ellipsis: '...',
      textStyle: {
        //fontWeight: 'bold'
        with: 100,
        overflow: 'truncate',
        textBorderColor:'#FF3'
      },
      backgroundColor: '#FFF',
      borderColor: '#000',
      borderWidth: 1,
      //width: 100,
      className: "my_tooltip", //Specify the classes for the tooltip root DOM ,
      position: "top",
      formatter: function (param) {
        return customComponent2(param);
        console.log("param", param);
        //param = param[0];

        let message = "";

        param.data.value.map((info) => {
          message += `<div style='width: 10px, display:flex'><span style='font-weight:bold'>${
            Object.keys(info)[0]
          }: </span><span>${Object.values(info)[0]}</span><br/></div>`;
        });

        return `<div>${message}</div>`;

        return [
          "" + param.data.name + '<hr size=1 style="margin: 3px 0">',
          "<span style='font-weight:bold'>Description: </span>" +
            param.data.value.content +
            "<br/>",
          "<span style='font-weight:bold'>Props: </span><span>" +
            param.data.value.props +
            "</span><br/>",
        ].join("");
      },
    },
    series: [
      {
        type: "tree",
        id: 0,
        name: "Dependencies",
        //layout: "radial",
        data: [listData[0]], //[listData[0]],
        top: "10%",
        left: "10%",
        bottom: "10%",
        right: "10%",
        symbolSize: 17,
        edgeShape: "curve", //curve //polyline
        edgeForkPosition: "50%",
        initialTreeDepth: 2,
        lineStyle: {
          width: 2,
        },
        label: {
          backgroundColor: "#fff",
          position: "left",
          verticalAlign: "middle",
          align: "right",
          //show: false
          /* normal: {
            formatter: [
              "The whole box is a {term|Text Block}, with",
              "red border and grey background.",
              "{fragment1|A Text Fragment} {fragment2|Another Text Fragment}",
              "Text fragments can be customized.",
            ].join("\n"),
          }, */
        },
        leaves: {
          label: {
            position: "right",
            verticalAlign: "middle",
            align: "left",
          },
        },
        emphasis: {
          focus: "descendant",
        },
        expandAndCollapse: true,
        animationDuration: 550,
        animationDurationUpdate: 750,
        itemStyle: {
          color: "red",
          bordeAnch: 0.5,
          //borderType: 'dotted'
        },
      },
    ],
  };

  useEffect(() => {
    if (listData.length !== 0) {
      var myChart = echarts.init(document.getElementById("main"), undefined, {
        width: 1000,
        height: 400,
        locale: "EN",
      });

      option && myChart.setOption(option);
    }
  }, [listData]);

  const handleListValue = () => {
    let aux = [...listValue];
    aux.push({ [keyValue]: contentValue });
    setlistValue(aux);
    setContentValue("");
    setKeyValue("");
  };

  const CheckArray = (arreglo) => {
    let aux = [...arreglo];

    arreglo.map((data, index) => {
      if (data.name === prevNodo) {
        //console.log(index + ". Encontró " + data.name + " - " + prevNodo);

        aux[index].children.push({
          name: nodo,
          value: listValue,
          collapsed: true,
          children: [],
        });

        return 1;
      } else {
        //console.log("entro a la recursion");
        return CheckArray(data.children);
      }
    });

    setListData(aux);
    setlistValue([]);
    setNodo("");
  };
  const handleListData = () => {
    let aux = [...listData];
    //console.log("nodo previo", prevNodo);

    //testing -- passed --> la funciion con recursividad funciona bien
    if (listData.length === 0) {
      aux.push({ name: nodo, value: listValue, collapsed: true, children: [] });
      //Como es el primer nodo en registrarse, se envia directanebte a a lista de nodos previos, para que pueda ser seleccionado en futuras ocaciones
      setListNode([{ id: nodo, label: nodo }]);
      setListData(aux);
      setlistValue([]);
      setNodo("");
    } else {
      CheckArray(aux);
      let aux_nodes = [...listNode];
      aux_nodes.push({ id: nodo, label: nodo });
      setListNode(aux_nodes);
    }

    return;
    //functional
    if (listData.length === 0) {
      aux.push({ name: nodo, value: listValue, collapsed: true, children: [] });
      //Como es el primer nodo en registrarse, se envia directanebte a a lista de nodos previos, para que pueda ser seleccionado en futuras ocaciones
      setListNode([{ id: nodo, label: nodo }]);
    } else {
      aux.map((val, index) => {
        console.log(val.name + " - " + prevNodo);
        if (val.name === prevNodo) {
          aux[index].children.push({
            name: nodo,
            value: listValue,
            collapsed: true,
            children: [],
          });
        }
      });

      let aux_nodes = [...listNode];
      aux_nodes.push({ id: nodo, label: nodo });
      setListNode(aux_nodes);
    }

    setListData(aux);
    setlistValue([]);
    setNodo("");
  };

  return (
    <div className="App">
      E-Charts
      <div style={{ width: 300 }}>
        <TextBox
          placeholder="Nombre del nodo"
          value={nodo}
          bsTextbox={true}
          onChange={(data) => {
            setNodo(data.target.value);
          }}
        />
        <h4>Ingrese el contenido</h4>
        <TextBox
          placeholder="Campo del contenido"
          value={keyValue}
          bsTextbox={true}
          onChange={(data) => {
            setKeyValue(data.target.value);
          }}
        />
        <TextBox
          placeholder="Campo del contenido"
          value={contentValue}
          bsTextbox={true}
          onChange={(data) => {
            setContentValue(data.target.value);
          }}
        />
        <button
          onClick={() => {
            handleListValue();
          }}
        >
          Agregar contenido
        </button>

        {listNode.length > 0 && (
          <div style={{ marginBlock: 20, width: 300 }}>
            <DropdownList
              dataSource={listNode}
              fields={{ value: "id", text: "label" }}
              bsTextbox={true}
              allowFiltering={true}
              operator="StartsWith"
              filterBy="label"
              placeholder="Nodo Previo"
              filterBarPlaceholder="Buscar"
              change={(data) => setPrevNodo(data.value)}
            />
          </div>
        )}

        <button
          onClick={() => {
            handleListData();
          }}
        >
          Agregar nodo
        </button>
      </div>
      <p>
        Lista content:
        {listValue.length}
      </p>
      <p>
        Lista Data:
        {JSON.stringify(listData)}
      </p>
      <div id="main"></div>
    </div>
  );
}

export default App;
