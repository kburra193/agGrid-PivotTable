var AgGrid = require("../../static/lib/ag-grid-community.min");

export default function ($element, layout) {
  // ..paint code here
  var self = this;
  const $$scope = this.$scope;

  $$scope.height = $element.height();
  $$scope.width = $element.width();
  $$scope.qId = layout.qInfo.qId;
  // Check to see if the chart element has already been created
  if (document.getElementById("agGrid")) {
    console.log("exist");
    // check if need to destroy before re-rendering. does AgGrid have a 'destroy' method?
    // and empty it's contents so we can redraw it
    jQuery("#agGrid").empty();
  }

  //dynamic height and width to element
  $$scope.agGridElementStyle = {
    height: $$scope.height + "px",
    width: $$scope.width + "px",
  };

  // get qMatrix data array
  var qMatrix = layout.qHyperCube.qDataPages[0].qMatrix;
  console.log("qMatrix",qMatrix);
  // create a new array that contains the dimension labels
  var qlikDims = layout.qHyperCube.qDimensionInfo;
  console.log("dimensionLabels", qlikDims);

  // create a new array that contains the measure labels
  var qlikMeas = layout.qHyperCube.qMeasureInfo;
  console.log("measureLabels", qlikMeas);

  //agGrid columns map
  var agGridColumns = qlikDims.map((c) => {
    return {
      field: c.qFallbackTitle,
    };
  }).concat(qlikMeas.map(m => {
    return {
      field: m.qFallbackTitle,
    }
  }));

  console.log({ agGridColumns });

  //agGrid rowdata mapping from qlikdata
  var rowData = qMatrix.map(function (d) {
    var data = {};
    // Add the dimensions
    for (var i = 0; i < d.length - 1; i++) {
      data[qlikDims[i].qFallbackTitle] = d[i].qText;
    }
    // Add the measure
    data[qlikMeas[0].qFallbackTitle] = d[d.length - 1].qText;
    console.log("data", data);
    return data;
  });
  console.log("rowData", rowData);

  // let the grid know which columns and what data to use
  const gridOptions = {
    columnDefs: agGridColumns,
    rowData: rowData,
    // default col def properties get applied to all columns
    defaultColDef: { sortable: true, filter: true},
    multiSortKey: 'ctrl',
    onGridReady: (params) => {
      var defaultSortModel = [
        { colId: agGridColumns[0].field, sort: 'asc', sortIndex: 0 },
      ];
  
      params.columnApi.applyColumnState({ state: defaultSortModel });
    },
    rowSelection: 'multiple', // allow rows to be selected
         animateRows: true, // have rows animate to new positions when sorted

         // example event handler
         onCellClicked: params => {
           console.log('cell was clicked', params)
         }
  };

  // var newId = `"#agGrid-${$$scope.qId}"`;
  // console.log("newId",newId);
  const gridDiv = document.querySelector("#agGrid");
  AgGrid.Grid(gridDiv, gridOptions);
}









//add h and width dynamically
//add dynamic qId to id-attr
//hypercube and mapping it to columnDefs and rowData
//Based on property panel and layout - we add more features
