import { TrendingUp } from "@material-ui/icons";
import { MUIDataTableOptions } from "mui-datatables";

const defaultDatatableOptions: MUIDataTableOptions = {
  serverSide: true,
  responsive: "standard",
  filter: false,
  filterType: "dropdown",
  rowsPerPageOptions: [10, 25, 50, 100],
  textLabels: {
    body: {
      noMatch: "一致するレコードが見つかりません",
      toolTip: "並べ替え",
      columnHeaderTooltip: (column) => `${column.label}`,
    },
    pagination: {
      next: "次へ",
      previous: "前へ",
      rowsPerPage: "表示件数:",
      displayRows: " / ",
    },
    toolbar: {
      search: "検索",
      downloadCsv: "CSVダウンロード",
      print: "印刷",
      viewColumns: "表示設定",
      filterTable: "フィルター",
    },
    filter: {
      all: "すべて",
      title: "フィルター",
      reset: "リセット",
    },
    viewColumns: {
      title: "表示するカラム",
      titleAria: "切り替え",
    },
    selectedRows: {
      text: "件を選択中",
      delete: "削除",
      deleteAria: "選択中のレコードを削除",
    },
  },
};

export default defaultDatatableOptions;
