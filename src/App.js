import "./App.css";
//import "@bsoftsolution/bsoft-utils.assets.iconography";
import * as echarts from "echarts";
import { useEffect, useState } from "react";
import {
  ButtonComponent as Button,
  SwitchComponent as Switch,
} from "@syncfusion/ej2-react-buttons";
import { TextBoxComponent as TextBox } from "@syncfusion/ej2-react-inputs";
import { DropDownListComponent as DropdownList } from "@syncfusion/ej2-react-dropdowns";

import {
  CreateModels,
  DeleteModels,
  GetModelByName,
  GetModels,
} from "./Controllers/ApiConnection";
import { TreeOptions } from "./helpers/echart-tree";
function App() {
  /* Auxiliares */
  const [importModel, setImportModel] = useState(false);
  const [isNewModel, setIsNewModel] = useState(false);
  const [isUpdatingNode, setIsUpdatingNode] = useState(false);
  const [showNodeForm, setShowNodeForm] = useState(false);
  const [isNewContent, setIsNewContent] = useState(false);
  const [listAvailableTrees, setListAvailableTrees] = useState([]);

  /* Modelo */
  const [currentModel, setCurrentModel] = useState("");
  const [modeloName, setModeloName] = useState("");
  const [listData, setListData] = useState([]);

  /* Nodos */
  const [nodo, setNodo] = useState("");
  const [prevNodo, setPrevNodo] = useState("");
  const [currentNode, setCurrentNode] = useState("");
  const [listNode, setListNode] = useState([]);

  /* Contenido de cada nodo */
  const [indexContent, setIndexContent] = useState(0);
  const [keyValue, setKeyValue] = useState("");
  const [contentValue, setContentValue] = useState("");
  const [listValue, setlistValue] = useState([]);

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

      //eChartId = myChart.id;
      //option && myChart.setOption(option);
      myChart.setOption(TreeOptions(listData));

      myChart.on("click", function (params) {
        console.log("hizo click");
        document
          .querySelector(".my_tooltip")
          .style.removeProperty("pointer-events");
        document
          .querySelector(".my_tooltip")
          .style.removeProperty("white-space");
      });
    }
  }, [listData]);

  /**
   *
   * @description Agrega contenido a un nodo específico mediante una lista de objetos, la misma que será consumida en la función: handleListData
   */
  const handleListValue = () => {
    let aux = [...listValue];
    aux.push({ [keyValue]: contentValue });
    setlistValue(aux);
    CleanNodeContentForm();
    //setContentValue("");
    //setKeyValue("");
  };

  /* Limpiadores */
  const CleanNodeContentForm = () => {
    setContentValue("");
    setKeyValue("");
  };

  const CleanModelForm = () => {
    setNodo("");
    setlistValue([]);
  };

  const UpdateNode = (mode, index = 0) => {
    let list = [...listData];
    SearchNodeUpdate(list, currentNode, mode, index);
    setListData(list);
    setIsNewContent(false);
    setShowNodeForm(false);
    setContentValue("");
    setKeyValue("");
    setIndexContent("");
  };

  /**
   *
   * @description Agrega un nodo y todo su contenido al modelo, también genera una lista de todos los nodos que el usuario podrá utilizar luego para ir aninando el modelo
   */
  const handleListData = () => {
    let aux = [...listData];

    if (listData.length === 0) {
      aux.push({
        name: nodo,
        value: listValue,
        collapsed: false,
        children: [],
      });
      //Como es el primer nodo en registrarse, se envia directamente a lista de nodos previos, para que pueda ser seleccionado al ingresar futuras nodos.
      setListNode([{ id: nodo, label: nodo, value: listValue }]);
      setListData(aux);
      CleanModelForm();
      //setlistValue([]);
      //setNodo("");
    } else {
      let aux_nodes = [...listNode];

      let nodeExist = listNode.filter((data) => data.id === nodo).length;
      if (nodeExist > 0) {
        window.alert(
          "Espere, ya existe un nodo con el mismo nombre, intente con otro nombre por favor."
        );
        return;
      } else {
        aux_nodes.push({ id: nodo, label: nodo, value: listValue });
        setListNode(aux_nodes);
      }

      CheckArray(aux);
    }
  };

  const handleTreeSearch = async (name) => {
    setCurrentModel(name);
    CleanForm();
    let model = await GetModelByName(name);
    setListData(model);
    GetNodes(model, []).then(() => {
      setListNode(auxNodes);
    });
  };

  const DeleteNode = () => {
    if (prevNodo === "" || prevNodo === null) {
      window.alert("Primero debe seleccionar un nodo para eliminarlo.");
      return;
    }

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
      setlistValue([]);
      setContentValue("");
      setKeyValue("");
      setCurrentNode("");
      setPrevNodo("");
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
        auxNodes.push({ id: data.name, label: data.name, value: data.value });
        return 1;
      } else {
        auxNodes.push({ id: data.name, label: data.name, value: data.value });
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

  const SearchNodeUpdate = (arreglo, nodeToFind, mode, index) => {
    arreglo.map((data) => {
      if (data.name === nodeToFind) {
        if (mode === "add") {
          data.value.push({ [keyValue]: contentValue });
        }

        if (mode === "update") {
          data.value[indexContent] = { [keyValue]: contentValue };
        }

        if (mode === "delete") {
          data.value.splice(index, 1);
        }

        if (mode === "change") {
          data.name = nodo;
        }
        return 1;
      } else {
        return SearchNodeUpdate(data.children, nodeToFind, mode, index);
      }
    });
  };

  const CambiarNombreNodo = () => {
    let list = [...listData];
    SearchNodeUpdate(list, currentNode, "change", 0);
    setListData(list);
    GetNodes(list, []).then(() => {
      setListNode(auxNodes);
    });
    setCurrentNode("");
    setPrevNodo("");
    setNodo("");
  };

  /* Handle Models in Database */

  /**
   *
   *  @description Obtiene la lista de Modelos disponibles desde el servidor
   */
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
    if (currentModel === null || currentModel === "") {
      window.alert("Primero debe seleccionar un modelo para eliminarlo.");
      return;
    }

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
    setModeloName("");
    setlistValue([]);
    setKeyValue("");
    setContentValue("");
    setListNode([]);
    setNodo("");
    setPrevNodo(null);
  };

  const NewModel = () => {
    setListData([]);
    setListNode([]);
    setlistValue([]);
    setKeyValue("");
    setContentValue("");
    setModeloName("");
    setNodo("");
    setPrevNodo("");

    /* setIsNewModel(false);
    setImportModel(false); */
  };

  //var value = [{ about: "testin information" }, { props: "props information" }];

  /*return (
    <div className="info-content">
      <p className="title">Hola desde Testing</p>
      <hr/>
      {value.map((info) => {
        return (
          <div>
            <p className="subtitle">{Object.keys(info)[0]}</p>
            <div className="paragraph">
              {Object.values(info)[0]}Lorem ipsum dolor sit amet, consectetur
              adipiscing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur
              adipiscing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur
              adipiscing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua.
            </div>
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
      {/* Formulario General */}
      <div
        style={{
          width: 400,
          //justifyContent: "center",
          alignContent: "center",
          marginBlock: 20,
          display: "flex",
          flexDirection: "column",
          marginInline: 20,
        }}
      >
        {/* Barra de botones */}
        <>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Button
              //textButton="Nuevo"
              content="Nuevo"
              variantType="outline"
              variantName="info"
              style={{ marginBlock: 20 }}
              onClick={() => {
                setImportModel(false);
                setIsNewModel(true);
                setIsUpdatingNode(false);
                NewModel();
              }}
            />

            <Button
              //textButton="Importar"
              content="Importar"
              variantType="outline"
              variantName="success"
              style={{ marginBlock: 20 }}
              onClick={() => {
                //setImportModel(!importModel);
                setImportModel(true);
                setIsNewModel(false);
                NewModel();
              }}
            />

            <Button
              //textButton="Guardar cambios"
              content="Guardar cambios"
              variantType="outline"
              disabled={isNewModel || listData.length === 0 ? true : false}
              variantName="info"
              style={{ marginBlock: 20 }}
              onClick={() => {
                UpdateModel();
              }}
            />
          </div>

          {(isNewModel || importModel) && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
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
                //textButton="Guardar como Nuevo Modelo"
                content="Guardar como Nuevo Modelo"
                variantType="outline"
                variantName="primary"
                disabled={modeloName === "" ? true : false}
                style={{ marginLeft: 10 }}
                onClick={() => {
                  SaveModel();
                }}
              />
            </div>
          )}
        </>
        <hr />

        {importModel === true && isNewModel === false && (
          <>
            <h4>Seleccione un Modelo</h4>

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
                //change={(data) => handleTreeSearch(data.value)}
                onChange={(data) => handleTreeSearch(data.value)}
              />

              <Button
                //textButton="Eliminar"
                content="Eliminar"
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

        {(isNewModel || importModel) && (
          <>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h4>Nodos del Modelo</h4>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >

                {listData.length > 0 && (
                  <div style={{display:'flex', alignItems:'center'}}>
                    <p style={{marginRight: 20}}> Modo edición</p>
                    <Switch
                      checked={isUpdatingNode}
                      /* change={() => {
                        setIsUpdatingNode(!isUpdatingNode);
                        setlistValue([]);
                        setKeyValue("");
                        setContentValue("");
                        setIndexContent("");
                        setCurrentNode("");
                        setPrevNodo("");
                      }} */
                      onChange={() => {
                        setIsUpdatingNode(!isUpdatingNode);
                        setlistValue([]);
                        setKeyValue("");
                        setContentValue("");
                        setIndexContent("");
                        setCurrentNode("");
                        setPrevNodo("");
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {isUpdatingNode === false && (
              <TextBox
                placeholder="Nombre del nuevo nodo"
                variant="success"
                value={nodo}
                bsTextbox={true}
                onChange={(data) => {
                  setNodo(data.value);
                }}
              />
            )}

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
                  placeholder="Seleccione el nodo previo"
                  filterBarPlaceholder="Buscar"
                  /* change={(data) => {
                    if (!isUpdatingNode) {
                      setPrevNodo(data.value);
                      setCurrentNode(data.value);
                    } else {
                      setPrevNodo(data.value);
                      setCurrentNode(data.value);
                      setlistValue(data.itemData.value);
                      setContentValue("");
                      setKeyValue("");
                      setShowNodeForm(false);
                    }
                  }} */
                  onChange={(data) => {
                    if (!isUpdatingNode) {
                      setPrevNodo(data.value);
                      setCurrentNode(data.value);
                    } else {
                      setPrevNodo(data.value);
                      setCurrentNode(data.value);
                      setlistValue(data.itemData.value);
                      setContentValue("");
                      setKeyValue("");
                      setShowNodeForm(false);
                    }
                  }}
                />

                {isUpdatingNode && (
                  <div>
                    {/* <Button
                    textButton="Actualizar Nodo"
                    variantType="outline"
                    variantName="info"
                    disabled={
                      currentNode === "" || currentNode === null ? true : false
                    }
                    width={100}
                    style={{ marginBottom: 5, marginLeft: 10 }}
                    onClick={() => {
                      setIsUpdatingNode(true);

                      //DeleteNode();
                    }}
                  /> */}

                    <Button
                      //textButton="Eliminar Nodo"
                      content="Eliminar Nodo"
                      variantType="outline"
                      variantName="danger"
                      disabled={
                        currentNode === "" || currentNode === null
                          ? true
                          : false
                      }
                      width={100}
                      style={{ marginLeft: 10 }}
                      onClick={() => {
                        DeleteNode();
                      }}
                    />
                  </div>
                )}
              </div>
            )}

            {/* {isUpdatingNode && (prevNodo !== "" || prevNodo != null) && ( */}
            {isUpdatingNode && (
              <>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <TextBox
                    placeholder="Nuevo nombre del nodo"
                    variant="success"
                    value={nodo}
                    bsTextbox={true}
                    onChange={(data) => {
                      setNodo(data.value);
                    }}
                  />

                  <Button
                    //textButton="Cambiar Nombre"
                    content="Cambiar Nombre"
                    disabled={nodo === "" || currentNode === "" ? true : false}
                    variantType="outline"
                    variantName="success"
                    style={{ marginLeft: 10 }}
                    onClick={() => {
                      CambiarNombreNodo();
                    }}
                  />
                </div>

                <div
                  style={{
                    flexDirection: "row",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <h5>Contenido de este nodo</h5>
                  <i
                    style={{ marginInline: 5 }}
                    className="fa-solid fa-add"
                    onClick={() => {
                      if (currentNode === "" || currentNode === null) {
                        window.alert("Seleccione un nodo primero");
                      } else {
                        setShowNodeForm(true);
                        setIsNewContent(true);
                      }
                    }}
                  />
                </div>
                <div>
                  {listValue.map((info, index) => {
                    return (
                      <div className="node-card">
                        <div
                          style={{
                            flexDirection: "row",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <p className="node-subtitle">
                            {Object.keys(info)[0]}
                          </p>
                          <div>
                            <i
                              style={{ marginInline: 5 }}
                              className="fa-solid fa-edit"
                              onClick={() => {
                                setContentValue(Object.values(info)[0]);
                                setKeyValue(Object.keys(info)[0]);
                                setIndexContent(index);
                                setShowNodeForm(true);
                              }}
                            />
                            <i
                              style={{ marginInline: 5 }}
                              className="fa-solid fa-trash"
                              onClick={() => {
                                UpdateNode("delete", index);
                              }}
                            />
                          </div>
                        </div>
                        <p className="node-paragraph">
                          {Object.values(info)[0]}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {showNodeForm === true && (
                  <div>
                    <p>Inserte el nuevo contenido del nodo</p>
                    <TextBox
                      placeholder="Título"
                      style={{ marginInline: 5 }}
                      variant="success"
                      value={keyValue}
                      bsTextbox={true}
                      onChange={(data) => {
                        setKeyValue(data.value);
                      }}
                    />
                    <TextBox
                      placeholder="Descripción"
                      enableMultiline={true}
                      enableClearButton={true}
                      multiLineRow={5}
                      style={{ marginInline: 5, marginTop: 5 }}
                      value={contentValue}
                      variant="success"
                      bsTextbox={true}
                      onChange={(data) => {
                        setContentValue(data.value);
                      }}
                    />
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "flex-start",
                      }}
                    >
                      <Button
                        /* textButton={
                          isNewContent
                            ? "Guardar nuevo contenido"
                            : "Actualizar Contenido"
                        } */
                        content={
                          isNewContent
                            ? "Guardar nuevo contenido"
                            : "Actualizar Contenido"
                        }
                        variantType="outline"
                        variantName="success"
                        disabled={
                          contentValue === "" || keyValue === "" ? true : false
                        }
                        width={100}
                        style={{ marginBlock: 10, marginRight: 15 }}
                        onClick={() => {
                          isNewContent
                            ? UpdateNode("add")
                            : UpdateNode("update");
                        }}
                      />
                      <p>Tamaño de contenido: {listValue.length}</p>
                    </div>
                  </div>
                )}
              </>
            )}

            {isUpdatingNode === false && (
              <>
                <h5>Ingrese información de contenido del nodo</h5>

                <div>
                  <TextBox
                    placeholder="Título"
                    style={{ marginInline: 5 }}
                    variant="success"
                    value={keyValue}
                    bsTextbox={true}
                    onChange={(data) => {
                      setKeyValue(data.value);
                    }}
                  />
                  <TextBox
                    placeholder="Descripción"
                    enableMultiline={true}
                    enableClearButton={true}
                    multiLineRow={5}
                    style={{ marginInline: 5, marginTop: 5 }}
                    value={contentValue}
                    variant="success"
                    bsTextbox={true}
                    onChange={(data) => {
                      setContentValue(data.value);
                    }}
                  />
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "flex-start",
                    }}
                  >
                    <Button
                      //textButton="Add. Info"
                      content="Add. Info"
                      variantType="outline"
                      variantName="success"
                      disabled={
                        contentValue === "" || keyValue === "" ? true : false
                      }
                      width={100}
                      style={{ marginBlock: 10, marginRight: 15 }}
                      onClick={() => {
                        handleListValue();
                      }}
                    />
                    <p>Tamaño de contenido: {listValue.length}</p>
                  </div>
                </div>

                <Button
                  content="Agregar Nodo"
                  textButton="Agregar Nodo"
                  variantType="outline"
                  variantName="primary"
                  disabled={
                    (listData.length <= 0 && nodo === "") ||
                    (listData.length > 0 &&
                      (prevNodo === "" || prevNodo === null || nodo === ""))
                      ? true
                      : false
                  }
                  //disabled={ nodo === "" || prevNodo === "" ? true : false}
                  style={{ marginBlock: 20 }}
                  onClick={() => {
                    handleListData();
                  }}
                />
              </>
            )}
          </>
        )}
      </div>

      {/* Vista del Echart */}
      {listData.length > 0 && (
        <div style={{ overflowX: "scroll", flex: 1 }}>
          <div style={{ position: "relative" }} id="main"></div>
        </div>
      )}
    </div>
  );
}

export default App;
