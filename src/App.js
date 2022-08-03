import "./App.css";
import * as echarts from "echarts";
import { useEffect, useState } from "react";
import { TextBox } from "@bsoftsolution/base-ui.ui.textbox";
import { DropdownList } from "@bsoftsolution/base-ui.ui.drop-down-list";
import { Button } from "@bsoftsolution/base-ui.ui.button";
import axios from "axios";
import {
  createNewTree,
  GetListAvailablesTrees,
  GetSavedTree,
  RemoveTree,
  SaveNewTree,
  TreesAvailables,
} from "./data/createJSON";
function App() {
  // initialize the echarts instance
  const [prevNodo, setPrevNodo] = useState("");
  const [currentModel, setCurrentModel] = useState("");
  const [modeloName, setModeloName] = useState("");
  const [nodo, setNodo] = useState("");
  const [keyValue, setKeyValue] = useState("");
  const [contentValue, setContentValue] = useState("");
  const [listValue, setlistValue] = useState([]);
  const [listData, setListData] = useState([]);
  const [listNode, setListNode] = useState([
    /* { id: "bsoft", label: "bsoft" },
    { id: "bsoft.risk", label: "bsoft.risk" }, */
  ]);

  const SERVER = "http://localhost:4000";
  //backend: https://github.com/Donnis1998/back-echarts

  useEffect(() => {
    GetModelList();
  }, []);

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

  const [listAvailableTrees, setListAvailableTrees] = useState([]); //GetListAvailablesTrees()

  const customComponent2 = (params) => {
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

  const option = {
    title: {
      id: "1",
      show: true,
      text: "BSoft Dependencies",
      subtext: "All dependencies in bsoft",
      link: "https://www.youtube.com/", //Este enlace se activará cuando se de click en el titulo
      target: "blank", //self //blank para abrir en una nueva pestaña
      left: 100, // '20%' // left // center // right
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
      ellipsis: "...",
      textStyle: {
        //fontWeight: 'bold'
        with: 100,
        overflow: "truncate",
        textBorderColor: "#FF3",
      },
      backgroundColor: "#FFF",
      borderColor: "#000",
      borderWidth: 1,
      //width: 100,
      className: "my_tooltip", //Specify the classes for the tooltip root DOM ,
      position: "right",
      formatter: function (param) {
        return customComponent2(param);
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
        initialTreeDepth: -1, // 2,
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
          collapsed: false,
          children: [],
        });

        //SaveNewTree("BSoft", aux);
        console.log("lo encontro y lo guardo", aux);
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

  const GetNodes = (arreglo, nodes) => {
    let aux = [...arreglo];
    let auxNodes = [...nodes];
    console.log("nodos que llegan", nodes);

    //funciona un 90% bien
    let array_length = aux.length;
    if (array_length > 0) {
      arreglo.map((data, index) => {
        auxNodes.push({ id: data.name, label: data.name });
        console.log("nodos agregado de " + data.name, auxNodes);
        return GetNodes(data.children, auxNodes);
      });
    } else {
      return 1;
    }

    /* let array_length = aux.length;
    if (array_length > 0) {
      aux.map((data, index) => {
        auxNodes.push({ id: data.name, label: data.name });
        console.log("nodos agregados", auxNodes);

        return GetNodes(data.children, auxNodes);
      });
    } else {
      //return 1;
    } */

    /* ---- 
    aux.map((data, index) => {
      if (data.name === "" || data.name === undefined || data.name === null) {
        return 1;
      } else {
        auxNodes.push({ id: data.name, label: data.name });
        console.log("nodos agregado de " + data.name, auxNodes);

        return GetNodes(data.children, auxNodes);
      }
    });*/

    //setListNode(aux);
  };

  const handleListData = () => {
    let aux = [...listData];

    //testing -- passed --> la funciion con recursividad funciona bien
    if (listData.length === 0) {
      aux.push({
        name: nodo,
        value: listValue,
        collapsed: false,
        children: [],
      });
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

  const handleTreeSearch = async (name) => {
    let res = await axios.get(`${SERVER}/${name}`);

    if (res.status === 200) {
      setListData(res.data);
    } else {
      window.alert(`Ha ocurrido un error al obtener el modelo ${name}`);
    }

    setCurrentModel(name);

    return;
    /* Utilizando LocalStorage */
    let tree = GetSavedTree(name);
    if (tree !== null) {
      setListData(tree);
      GetNodes(tree, []);
      setCurrentModel(name);
      //setListNode([])
    }
  };

  const SaveModel = async () => {
    let data = {
      name: modeloName,
      chart: listData,
    };

    let res = await axios.post(`${SERVER}/register`, data);

    if (res.status === 204) {
      NewModel();
      GetModelList();
      window.alert("El modelo se ha guardado exitosamente.");
    } else {
      window.alert("Ha ocurrido un error al guardar el modelo.");
    }

    return;
    /* Utilizando LocalStorage */
    console.log("se guardara el siguiente modelo " + modeloName, listData);
    SaveNewTree(modeloName, listData);
    NewModel();
    let trees = GetListAvailablesTrees();
    setListAvailableTrees(trees);
  };

  const DeleteModel = async () => {
    if (currentModel === null)
      window.alert("Primero debe seleccionar un modelo para eliminarlo.");

    let res = await axios.delete(`${SERVER}/delete/${currentModel}`);

    if (res.status === 204) {
      NewModel();
      GetModelList();
    } else {
      window.alert("Ha ocurrido un error al eliminar el modelo.");
    }

    return;
    /* Utilziando localstorage */
    RemoveTree(currentModel);
    NewModel();
    let trees = GetListAvailablesTrees();
    setListAvailableTrees(trees);
  };

  const NewModel = () => {
    //setListAvailableTrees([])
    setListData([]);
    setListNode([]);
    setlistValue([]);
    setKeyValue("");
    setContentValue("");
    setModeloName("");
    setNodo("");
  };

  const GetModelList = async () => {
    let res = await axios.get(`${SERVER}/`);

    if (res.status === 200) {
      setListAvailableTrees(res.data);
    } else {
      window.alert("Ha ocurrido un error al obtener la lista de modelos.");
    }
  };
  return (
    <div style={{ display: "flex", justifyContent: "space-around" }}>
      <div
        style={{
          width: 400,
          justifyContent: "center",
          alignContent: "center",
          marginBlock: 20,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <DropdownList
            dataSource={listAvailableTrees}
            fields={{ value: "id", text: "label" }}
            bsTextbox={true}
            allowFiltering={true}
            operator="StartsWith"
            variant="success"
            filterBy="label"
            placeholder="Árboles disponibles"
            filterBarPlaceholder="Buscar"
            change={(data) => handleTreeSearch(data.value)}
          />

          <Button
            textButton="Eliminar modelo"
            variantType="outline"
            variantName="danger"
            disabled={
              currentModel === "" || currentModel === null ? true : false
            }
            width={100}
            style={{ marginBlock: 20, marginInline: 10 }}
            onClick={() => {
              DeleteModel();
            }}
          />
        </div>

        <br />
        <br />

        <h4>Agregar nodos</h4>

        <TextBox
          placeholder="Nombre del nodo"
          variant="success"
          value={nodo}
          bsTextbox={true}
          onChange={(data) => {
            setNodo(data.value);
          }}
        />

        <h5>Ingrese información de contenido del nodo</h5>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <TextBox
            placeholder="Campo"
            style={{ marginInline: 5 }}
            variant="success"
            value={keyValue}
            bsTextbox={true}
            onChange={(data) => {
              setKeyValue(data.value);
            }}
          />
          <TextBox
            placeholder="Información detallada"
            style={{ marginInline: 5 }}
            value={contentValue}
            variant="success"
            bsTextbox={true}
            onChange={(data) => {
              setContentValue(data.value);
            }}
          />
          <Button
            textButton="Add. info"
            variantType="outline"
            variantName="success"
            disabled={contentValue === "" || keyValue === "" ? true : false}
            width={100}
            style={{ marginBlock: 20, marginInline: 10 }}
            onClick={() => {
              handleListValue();
            }}
          />
        </div>
        <p>
          Tamaño de la lista de contenido:
          {listValue.length}
        </p>

        {listNode.length > 0 && (
          <DropdownList
            dataSource={listNode}
            fields={{ value: "id", text: "label" }}
            bsTextbox={true}
            variant="success"
            allowFiltering={true}
            operator="StartsWith"
            filterBy="label"
            placeholder="Nodo Previo"
            filterBarPlaceholder="Buscar"
            change={(data) => setPrevNodo(data.value)}
          />
        )}

        <Button
          textButton="Agregar Nodo"
          variantType="outline"
          variantName="primary"
          disabled={nodo === "" ? true : false}
          style={{ marginBlock: 20 }}
          onClick={() => {
            handleListData();
          }}
        />

        <br />
        <br />

        <TextBox
          placeholder="Nombre del modelo"
          variant="success"
          value={modeloName}
          bsTextbox={true}
          onChange={(data) => {
            setModeloName(data.value);
          }}
        />

        <Button
          textButton="Guardar Modelo"
          variantType="outline"
          variantName="primary"
          disabled={modeloName === "" ? true : false}
          style={{ marginBlock: 20 }}
          onClick={() => {
            SaveModel();
          }}
        />
        <br />
        <br />
        <Button
          textButton="Nuevo Modelo"
          variantType="outline"
          variantName="info"
          style={{ marginBlock: 20 }}
          onClick={() => {
            NewModel();
          }}
        />
      </div>

      {/* <p>
        Lista Data:
        {JSON.stringify(listData)}
      </p> */}
      {listData.length > 0 && <div id="main"></div>}
    </div>
  );
}

export default App;
