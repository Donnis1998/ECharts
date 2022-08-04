import "./App.css";
import * as echarts from "echarts";
import { useEffect, useState } from "react";
import { TextBox } from "@bsoftsolution/base-ui.ui.textbox";
import { DropdownList } from "@bsoftsolution/base-ui.ui.drop-down-list";
import { Button } from "@bsoftsolution/base-ui.ui.button";
import {
  CreateModels,
  DeleteModels,
  GetModelByName,
  GetModels,
} from "./Controllers/ApiConnection";
import { TreeOptions } from "./helpers/echart-tree";
function App() {
  const [importModel, setImportModel] = useState(false);
  const [isNewModel, setIsNewModel] = useState(false);

  const [prevNodo, setPrevNodo] = useState("");
  const [currentModel, setCurrentModel] = useState("");
  const [currentNode, setCurrentNode] = useState("");
  const [modeloName, setModeloName] = useState("");
  const [nodo, setNodo] = useState("");
  const [keyValue, setKeyValue] = useState("");
  const [contentValue, setContentValue] = useState("");
  const [listValue, setlistValue] = useState([]);
  const [listData, setListData] = useState([]);
  const [listNode, setListNode] = useState([]);
  const [listAvailableTrees, setListAvailableTrees] = useState([]); //GetListAvailablesTrees()

  useEffect(() => {
    GetModelList();
  }, []);

  useEffect(() => {
    if (listData.length !== 0) {
      var myChart = echarts.init(document.getElementById("main"), undefined, {
        width: 800,
        height: 800,
        locale: "EN",
      });

      //option && myChart.setOption(option);
      myChart.setOption(TreeOptions(listData));
    }
  }, [listData]);

  const handleListValue = () => {
    let aux = [...listValue];
    aux.push({ [keyValue]: contentValue });
    setlistValue(aux);
    setContentValue("");
    setKeyValue("");
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
      let aux_nodes = [...listNode];
      let nodeExist = listNode.filter((data) => data.id === nodo).length;
      if (nodeExist > 0) {
        window.alert(
          "Espere, ya existe un nodo con el mismo nombre, intente con otro nombre por favor."
        );
        return;
      } else {
        aux_nodes.push({ id: nodo, label: nodo });
        setListNode(aux_nodes);
      }

      CheckArray(aux);
    }
  };

  const handleTreeSearch = async (name) => {
    setCurrentModel(name);
    let model = await GetModelByName(name);
    setListData(model);
    GetNodes(model, []).then(() => {
      setListNode(auxNodes);
    });
    CleanForm();
  };

  const DeleteNode = () => {
    let res = window.confirm(
      `Está seguro de eliminar el nodo ${currentNode}, recuerde que también se eliminará todos los hijos contenidos dentro de este nodo.`
    );
    if (res) {
      let list = [...listData];
      //SearchNode(list, currentNode).then(() => setListData(list));
      setListNode([]);
      SearchNode(list, currentNode);
      setListData(list);
      GetNodes(list, []).then(() => {
        setListNode(auxNodes);
      });
      window.alert(`El nodo ${currentNode} se ha eliminado correctamente.`);
    }
  };

  /* Recursive functions */
  const CheckArray = (arreglo) => {
    let aux = [...arreglo];

    arreglo.map((data, index) => {
      if (data.name === prevNodo) {
        aux[index].children.push({
          name: nodo,
          value: listValue,
          collapsed: false,
          children: [],
        });

        return 1;
      } else {
        return CheckArray(data.children);
      }
    });

    setListData(aux);
    setlistValue([]);
    setNodo("");
  };

  var auxNodes;

  const GetNodes = async (arreglo, nodes) => {
    auxNodes = [...nodes];

    //Opcion 1 => funciona un 100% bien
    /* let array_length = arreglo.length;
    if (array_length > 0) {
      arreglo.map((data, index) => {
        auxNodes.push({ id: data.name, label: data.name });
        return GetNodes(data.children, auxNodes);
      });
    } else {
      return 1;
    } */

    //Opcion 2 => funciona 100% bien
    arreglo.map((data) => {
      if (data.children.length === 0) {
        auxNodes.push({ id: data.name, label: data.name });
        return 1;
      } else {
        auxNodes.push({ id: data.name, label: data.name });
        return GetNodes(data.children, auxNodes);
      }
    });
  };

  const SearchNode = (arreglo, nodeToFind) => {
    arreglo.map((data, index) => {
      if (data.name === nodeToFind) {
        arreglo.splice(index, 1);
        return 1;
      } else {
        return SearchNode(data.children, nodeToFind);
      }
    });
  };

  /* Handle Models in Database */
  const GetModelList = async () => {
    let list = await GetModels();
    setListAvailableTrees(list);
  };

  const SaveModel = async () => {
    let data = {
      name: modeloName,
      chart: listData,
    };

    CreateModels(data).then(() => {
      NewModel();
      GetModelList();
    });
  };

  const UpdateModel = async () => {
    let data = {
      name: currentModel,
      chart: listData,
    };

    CreateModels(data).then(() => {
      NewModel();
      GetModelList();
    });
  };

  const DeleteModel = async () => {
    if (currentModel === null || currentModel === "")
      window.alert("Primero debe seleccionar un modelo para eliminarlo.");

    let res = window.confirm(
      `Está seguro de eliminar el modelo ${currentModel}?`
    );

    if (res) {
      DeleteModels(currentModel).then(() => {
        GetModelList();
        NewModel();
      });
    }
  };

  /* Aux */
  const CleanForm = () => {
    setListNode([]);
    setlistValue([]);
    setKeyValue("");
    setContentValue("");
    setModeloName("");
    setNodo("");
  };

  const NewModel = () => {
    setListData([]);
    setListNode([]);
    setlistValue([]);
    setKeyValue("");
    setContentValue("");
    setModeloName("");
    setNodo("");

    setIsNewModel(false);
    setImportModel(false);
  };

  var value = [{ about: "testin information" }, { props: "props information" }];

  /* return (
    <div className="info-content">
      <p className="title">Hola desde Testing</p>
      <hr/>
      {value.map((info) => {
        return (
          <div>
            <p className="subtitle">{Object.keys(info)[0]}</p>
            <p className="paragraph">
              {Object.values(info)[0]}Lorem ipsum dolor sit amet, consectetur
              adipiscing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua.
            </p>
          </div>
        );
      })}
    </div>
  ); */

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-start",
        flexWrap: "wrap",
      }}
    >
      <div
        style={{
          width: 400,
          justifyContent: "center",
          alignContent: "center",
          marginBlock: 20,
          display: "flex",
          flexDirection: "column",
          marginInline: 20,
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
          <Button
            textButton="Nuevo"
            variantType="outline"
            variantName="info"
            style={{ marginBlock: 20 }}
            onClick={() => {
              setImportModel(false);
              setIsNewModel(true);
              NewModel();
            }}
          />

          <Button
            textButton="Importar"
            variantType="outline"
            variantName="sucess"
            style={{ marginBlock: 20 }}
            onClick={() => {
              //setImportModel(!importModel);
              setImportModel(true);
              setIsNewModel(false);
            }}
          />

          <Button
            textButton="Guardar cambios"
            variantType="outline"
            disabled={isNewModel || listData.length === 0 ? true : false}
            variantName="info"
            style={{ marginBlock: 20 }}
            onClick={() => {
              UpdateModel();
            }}
          />
        </div>

        <hr />

        {importModel === true && isNewModel === false && (
          <>
            <p>Seleccione un Modelo</p>

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
                textButton="Eliminar"
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
          </>
        )}

        {/* {listData.length > 0 && ( */}
        {(isNewModel || importModel) && (
          <>
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
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
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
                  change={(data) => {
                    setPrevNodo(data.value);
                    setCurrentNode(data.value);
                  }}
                />

                <Button
                  textButton="Eliminar Nodo"
                  variantType="outline"
                  variantName="danger"
                  disabled={
                    currentModel === "" || currentModel === null ? true : false
                  }
                  width={100}
                  style={{ marginBlock: 20, marginInline: 10 }}
                  onClick={() => {
                    DeleteNode();
                  }}
                />
              </div>
            )}

            <Button
              textButton="Agregar Nodo"
              variantType="outline"
              variantName="primary"
              disabled={
                nodo === "" || (listData.length > 0 && prevNodo === "")
                  ? true
                  : false
              }
              style={{ marginBlock: 20 }}
              onClick={() => {
                handleListData();
              }}
            />

            <hr />

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
              textButton="Guardar como Nuevo Modelo"
              variantType="outline"
              variantName="primary"
              disabled={modeloName === "" ? true : false}
              style={{ marginBlock: 20 }}
              onClick={() => {
                SaveModel();
              }}
            />
          </>
        )}
      </div>
      {listData.length > 0 && (
        <div style={{ overflowX: "scroll", flex: 1 }}>
          <div id="main"></div>
        </div>
      )}
    </div>
  );
}

export default App;
