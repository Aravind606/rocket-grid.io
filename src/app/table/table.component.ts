import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatCheckbox } from '@angular/material/checkbox';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {

  displayedColumns: string[] = ['id', 'fname', 'lname', 'city', 'country'];
  @ViewChild(MatSort) sort: MatSort;

  tableData: MatTableDataSource<any>;
  isShowDivIf = false;
  tnormal = true;
  tchange = false;
  tableValueSort;
  tableValue;
  nameFilter = [{
    name: "Hilde",
    filtered: false
  },
  {
    name: "Alden",
    filtered: false
  },
  {
    name: "Alyssa",
    filtered: false
  },
  {
    name: "Georg",
    filtered: false
  },
  {
    name: "Bobbee",
    filtered: false
  },
  ];
  countryFilter = [{
    name: "India",
    filtered: false
  },
  {
    name: "Australia",
    filtered: false
  },
  {
    name: "Europe",
    filtered: false
  },
  {
    name: "Mexico",
    filtered: false
  },
  {
    name: "China",
    filtered: false
  },
  ];
  nameDefault = [{
    name: "Hilde",
    filtered: false
  },
  {
    name: "Alden",
    filtered: false
  },
  {
    name: "Alyssa",
    filtered: false
  },
  {
    name: "Georg",
    filtered: false
  },
  {
    name: "Bobbee",
    filtered: false
  },
  ];
  countryDefault = [{
    name: "India",
    filtered: false
  },
  {
    name: "Australia",
    filtered: false
  },
  {
    name: "Europe",
    filtered: false
  },
  {
    name: "Mexico",
    filtered: false
  },
  {
    name: "China",
    filtered: false
  },
  ];

  sortable = [
    {
      name: "id",
      sortable: true,
      sortType: "default"
    },
    {
      name: "First_name",
      sortable: true,
      sortType: "default"
    },
    {
      name: "Last_name",
      sortable: false,
      sortType: "default"
    },
    {
      name: "City",
      sortable: true,
      sortType: "default"
    },
    {
      name: "Country",
      sortable: true,
      sortType: "default"
    }
  ]


  constructor(private httpclient: HttpClient) { }
  ngOnInit() {
    this.httpclient.get(" ../../assets/data.json").subscribe(data => {
      var parsedData = [];
      var resData = JSON.stringify(data);
      parsedData = JSON.parse(resData);
      //newdata = newdata.slice(0, 10)
      var aryData = Array.from(parsedData)
      this.tableValueSort = aryData;
      this.tableValue = parsedData;
    });
    setTimeout(() => {
      this.tableCreation(this.sortable, this.tableValueSort);
    }, 100)

    var lsName = JSON.parse(sessionStorage.getItem("name"));
    var lsCountry = JSON.parse(sessionStorage.getItem("country"));
    var lsSortable = JSON.parse(sessionStorage.getItem("sortOrder"))
    if (lsSortable.length > 0) {
      this.sortable = lsSortable;
      setTimeout(() => {
        this.sortable = lsSortable;
        this.sortable.forEach((item) => {
          if (item.sortType != "default") {
            this.sorting(item.name)
          }
        }, 100)
      })
    }
    if (lsName.length > 0 || lsCountry.length > 0) {

      this.isShowDivIf = !this.isShowDivIf;
      this.tchange = !this.tchange;
      this.tnormal = !this.tnormal
      setTimeout(() => {
        this.nameFilter.forEach(x => {
          lsName.forEach(element => {
            if (x.name == element.name) {
              x.filtered = true
            }
          });
        })
        this.countryFilter.forEach(x => {
          lsCountry.forEach(element => {
            if (x.name == element.name) {
              x.filtered = true
            }
          });
        })
        this.selectedName = lsName;
        this.selectedCountry = lsCountry;
        this.filter(this.tableValue, lsName, lsCountry);
      }, 200);
    }





  }

  tableCreation(sortOpt, tdata) {
    let data = tdata.map(item => {
      return {
        id: item.id,
        First_name: item.First_name,
        Last_name: item.Last_name,
        City: item.City,
        Country: item.Country
      }
    })
    this.tableData = new MatTableDataSource(data);


  }

  sorting(colName) {
    this.sortable.forEach((element) => {

      if (element.name != colName) {
        element.sortType = "default"
      }
      else {
        if (element.sortType == "default") {
          element.sortType = "asc"
          this.sortColumn(colName, "asc")
        }
        else if (element.sortType == "asc") {
          element.sortType = "desc";
          this.sortColumn(colName, "desc")
        }
        else if (element.sortType == "desc") {
          element.sortType = "default";
          this.sortColumn(colName, "default")
        }
      }
    })
    sessionStorage.setItem("sortOrder", JSON.stringify(this.sortable));
  }

  sortColumn(colName, sort) {

    if (sort == "asc") {
      this.ascSort(colName)
    }
    else if (sort == "desc") {
      this.descSort(colName)
    }
    else if (sort == "default") {
      if (this.selectedName.length > 0 || this.selectedCountry.length > 0) {
        this.filter(this.tableValueSort, this.selectedName, this.selectedCountry)
      }
      else {
        this.tableCreation(this.sortable, this.tableValueSort)
      }
    }
  }



  ascSort(colName) {

    console.log("asc", this.sortable)
    function compare_item(a, b) {
      if (a[colName] < b[colName]) {
        return -1;

      } else if (a[colName] > b[colName]) {
        return 1;

      } else {
        return 0;
      }
    }

    console.log(this.tableData.filteredData.sort(compare_item));
    this.tableCreation(this.sortable, this.tableData.filteredData)

  }
  descSort(colName) {
    function compare_item(a, b) {
      if (a[colName] < b[colName]) {
        return 1;

      } else if (a[colName] > b[colName]) {
        return -1;

      } else {
        return 0;
      }
    }

    console.log(this.tableData.filteredData.sort(compare_item));
    this.tableCreation(this.sortable, this.tableData.filteredData)

  }


  toggleDisplayDivIf() {
    this.isShowDivIf = !this.isShowDivIf;
    this.tchange = !this.tchange;
    this.tnormal = !this.tnormal
  }

  selectedName: any = [];
  selectedCountry: any = [];
  filterName(e) {

    if (e.target.checked) {

      this.selectedName.push({ "name": e.target.value, "filtered": e.target.checked })
      this.saveFilterInLs()
      this.filter(this.tableValue, this.selectedName, this.selectedCountry)

    }

    else {
      var index = this.selectedName.findIndex(x => {
        return x.name == e.target.value
      })
      this.selectedName.splice(index, 1);
      this.saveFilterInLs()
      this.filter(this.tableValue, this.selectedName, this.selectedCountry)
    }
    if (this.selectedName.length == 0 && this.selectedCountry.length == 0) {
      this.tableData = new MatTableDataSource(this.tableValue);
      this.tableData.sort = this.sort
    }

  }
  filterCountry(e) {

    if (e.target.checked) {
      this.selectedCountry.push({ "name": e.target.value, "filtered": e.target.checked })
      this.saveFilterInLs()
      this.filter(this.tableValue, this.selectedName, this.selectedCountry)

    }

    else {

      var index = this.selectedCountry.findIndex(x => {
        return x.name == e.target.value
      })
      this.selectedCountry.splice(index, 1);
      this.saveFilterInLs()
      this.filter(this.tableValue, this.selectedName, this.selectedCountry)
    }
    if (this.selectedName.length == 0 && this.selectedCountry.length == 0) {
      this.tableData = new MatTableDataSource(this.tableValue);
    }
  }

  saveFilterInLs() {
    sessionStorage.setItem("name", JSON.stringify(this.selectedName));
    sessionStorage.setItem("country", JSON.stringify(this.selectedCountry));
  }

  filter(totalUser, nameAry, countryAry) {
    var filteredData = totalUser.filter(item => {
      var name = item.First_name;
      var country = item.Country;
      var newaName = [];
      var newCountry = [];
      nameAry.forEach(n => {
        newaName.push(n["name"])
      });
      countryAry.forEach(c => {
        newCountry.push(c["name"]);
      })
      if (nameAry.length > 0 && countryAry.length > 0) {
        var match = newaName.includes(name) && newCountry.includes(country);
        if (match) {
          return item;
        }
      }
      else {
        var match = newaName.includes(name) || newCountry.includes(country);
        if (match) {
          return item;
        }

      }

    })
    this.tableData = new MatTableDataSource(filteredData);
    let filterValue = filteredData.map(item => {
      return {
        id: item.id,
        First_name: item.First_name,
        Last_name: item.Last_name,
        City: item.City,
        Country: item.Country
      }
    })
    this.tableData = new MatTableDataSource(filterValue);
    this.tableData.sort = this.sort
  }


}
