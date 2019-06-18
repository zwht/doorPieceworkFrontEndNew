import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import {
  STColumn,
  STComponent,
  STRes,
  STReq,
  STPage,
  STData,
  STColumnButton,
} from '@delon/abc';
import { SFSchema } from '@delon/form';
import { ActivatedRoute, Router } from '@angular/router';
import { ResponseVo } from '@interface/utils/ResponseVo';
import { NzMessageService, NzModalRef, NzModalService } from 'ng-zorro-antd';
import { CodeDataService } from '@shared/services/code-data.service';
import { delay, map } from 'rxjs/operators';
import { ResponsePageVo } from '@interface/utils/ResponsePageVo';

import { PopParamsComponent } from '../popParams/popParams.component';
@Component({
  selector: 'app-door-list',
  templateUrl: './selectDoor.component.html',
  styleUrls: ['./selectDoor.less'],
})
export class SelectDoorComponent implements OnInit {
  title;
  pageSize = 12;
  total = 0;
  page = 1;
  list = [];

  @Input() gxList: any[];
  searchSchema: SFSchema = {
    properties: {
      name: {
        type: 'string',
        title: '名称',
      },
      number: {
        type: 'string',
        title: '编号',
      },
      type: {
        type: 'string',
        title: '类型',
        ui: {
          widget: 'select',
          nzAllowClear: true,
          asyncData: (name: string) => {
            return this.http
              .post(
                './v1/public/code/list',
                {
                  groupId: '291996688304967680',
                },
                { pageNum: 1, pageSize: 1000 },
              )
              .pipe(
                delay(120),
                map((item: ResponsePageVo) => {
                  if (!item.response.data.length) return [];
                  return [
                    {
                      label: '--全部--',
                      value: '1301,1302',
                    },
                  ].concat(
                    item.response.data
                      .filter(obj => {
                        return obj.value < 1350;
                      })
                      .map(obj => {
                        return {
                          label: obj.name,
                          value: obj.value,
                        };
                      }),
                  );
                }),
              );
          },
          width: 200,
        },
      },
    },
  };
  @ViewChild('st') st: STComponent;
  columns: STColumn[] = [
    { title: '序号', index: 'no' },
    { title: '名称', index: 'name' },
    { title: '编号', index: 'number' },
    {
      title: '图片',
      index: 'img',
      type: 'img',
      width: '150px',
      className: 'imgTd',
    },
  ];

  constructor(
    private http: _HttpClient,
    private modal: NzModalRef,
    public activatedRoute: ActivatedRoute,
    private modalService: NzModalService,
  ) {}

  ngOnInit() {
    this.getList();
  }
  _onReuseInit() {}

  search(e) {
    this.getList(e);
  }

  getList(data?) {
    this.http
      .post(
        `./v1/door/list?pageNum=${this.page}&pageSize=${this.pageSize}`,
        data || { type: '1301,1302' },
      )
      .subscribe((res: ResponseVo) => {
        if (res.response) {
          this.total = res.response.pageCount;
          this.list = res.response.data;
        }
      });
  }

  pageChange = e => {
    this.page = e;
    this.getList();
  };

  pageSizeChange = e => {
    this.page = 1;
    this.pageSize = e;
    this.getList();
  };
  goItem(door) {
    const gxIds = door.gxIds.split(','),
      gxValues = door.gxValues.split(',');
    const gxList = [];
    this.gxList.forEach(item => {
      gxIds.forEach((id, i) => {
        if (id === item.id) {
          gxList.push({
            name: item.name,
            price: gxValues[i],
          });
        }
      });
    });
    this.modal.destroy({
      data: {
        type: door.type,
        id: door.id,
        name: door.name,
        unitPrice: door.unitPrice,
        unit: door.unit,
        gxList,
        arithmetic: door.arithmetic ? JSON.parse(door.arithmetic) : {},
      },
    });
  }
  selectItem(door) {
    if (door.gxParams && JSON.parse(door.gxParams).length) {
      const modal = this.modalService.create({
        nzTitle: '填写参数',
        nzWidth: 600,
        nzMaskClosable: false,
        nzContent: PopParamsComponent,
        nzComponentParams: {
          gxList: door,
        },
        nzFooter: null,
      });
      // 打开后回调
      modal.afterOpen.subscribe(() => console.log('[afterOpen] emitted!'));
      // 关闭回调
      modal.afterClose.subscribe(result => {
        if (result) {
          this.goItem(result.data);
        }
      });
    } else {
      this.goItem(door);
    }
  }
}
