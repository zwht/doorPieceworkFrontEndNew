import { Directive, ElementRef, Output, EventEmitter, OnInit, AfterViewInit } from '@angular/core';
/**
 * 解决原生mouserover，mouserout事件多次执行问题，
 * 如dom内部有子元素的情况就会出现这样的问题，
 * 然后添加了zwHover()事件
 */
@Directive({
  selector: '[appZwMouseSet]'
})
export class ZwMouseSetDirective implements OnInit, AfterViewInit {
  @Output()
  zwMouseover = new EventEmitter<any>();
  @Output()
  zwMouseout = new EventEmitter<any>();
  @Output()
  zwHover = new EventEmitter<any>();
  constructor(
    private elementRef: ElementRef
  ) { }
  ngOnInit(): void {
  }
  ngAfterViewInit(): void {
    this.elementRef.nativeElement.addEventListener('mouseover', (e) => {
      if (this.checkHover(e, this.elementRef.nativeElement)) {
        this.zwMouseover.emit(e);
        this.zwHover.emit({
          event: e,
          value: true
        });
      }
    }, false);
    this.elementRef.nativeElement.addEventListener('mouseout', (e) => {
      if (this.checkHover(e, this.elementRef.nativeElement)) {
        this.zwMouseout.emit(e);
        this.zwHover.emit({
          event: e,
          value: false
        });
      }
    }, false);
  }
  contains(parentNode, childNode) {
    if (parentNode.contains) {
      return parentNode !== childNode && parentNode.contains(childNode);
    } else {
      return !!(parentNode.compareDocumentPosition(childNode) & 16);
    }
  }
  checkHover(e, target) {
    if (e.type === 'mouseover') {
      return !this.contains(target, e.relatedTarget || e.fromElement)
        && !((e.relatedTarget || e.fromElement) === target);
    } else {
      return !this.contains(target, e.relatedTarget || e.toElement)
        && !((e.relatedTarget || e.toElement) === target);
    }
  }
}
