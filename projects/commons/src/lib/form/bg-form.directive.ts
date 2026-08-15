import {
  ChangeDetectorRef,
  Directive,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  inject
} from "@angular/core";
import { MatCheckbox } from "@angular/material/checkbox";
import { MatRadioGroup } from "@angular/material/radio";
import { MatSelect } from "@angular/material/select";
import { ChangeListener, SimpleChanges, UntilDestroy } from "@leobg/commons/utils";
import { tap } from "rxjs/operators";

interface BgFieldDirective<V, E> {
  setValue(value: V | null): void;
  field: keyof E | "";
  config: BgFieldConfig<V, E> | null;
}

export interface BgFieldConfig<V, E> {
  valueGetter?: (entity: E) => V;
  valueSetter?: (value: V, entity: E) => Partial<E>;
}

@Directive({ selector: "[bgForm]" })
export class BgFormDirective<E> implements OnChanges {
  constructor() {}

  @Input() bgForm: E | null = null;
  @Output() bgFormChange = new EventEmitter<E>();

  private fields: BgFieldDirective<any, E>[] = [];

  ngOnChanges(changes: SimpleChanges<BgFormDirective<E>>) {
    if (changes.bgForm) {
      this.setEntityValues(this.bgForm);
    }
  }

  private setEntityValues(entity: E | null) {
    if (entity) {
      this.fields.forEach(<V>(field: BgFieldDirective<V, E>) => {
        const value = this.getFieldValue(entity, field);
        field.setValue(value);
      });
    } else {
      this.fields.forEach(field => field.setValue(null));
    }
  }

  private setFieldValue<V>(entity: E | null, field: BgFieldDirective<V, E>) {
    if (entity) {
      const value = this.getFieldValue(entity, field);
      field.setValue(value);
    } else {
      field.setValue(null);
    }
  }

  private getFieldValue<V>(entity: E, field: BgFieldDirective<V, E>): V | null {
    if (field.config?.valueGetter) {
      return field.config.valueGetter(entity);
    } else if (field.field) {
      return entity[field.field] as any as V;
    }
    return null;
  }

  onValueChange<V>(value: V, field: BgFieldDirective<V, E>) {
    if (this.bgForm) {
      if (field.config?.valueSetter) {
        const patch = field.config.valueSetter(value, this.bgForm);
        this.bgFormChange.emit({
          ...this.bgForm,
          ...patch
        });
      } else if (field.field) {
        this.bgFormChange.emit({
          ...this.bgForm,
          [field.field]: value
        });
      }
    }
  }

  registerField<V>(field: BgFieldDirective<V, E>) {
    this.fields.push(field);
    this.setFieldValue(this.bgForm, field);
  }

  unregisterField<V>(field: BgFieldDirective<V, E>) {
    const index = this.fields.indexOf(field);
    if (index >= 0) {
      this.fields.splice(index, 1);
    }
  }
}

@Directive({ selector: "input[bgField]" })
export class BgInputFieldDirective<V, E> implements OnInit, OnDestroy, BgFieldDirective<V, E> {
  private form = inject<BgFormDirective<E>>(BgFormDirective);
  private cd = inject(ChangeDetectorRef);

  @Input("bgField") field: keyof E | "" = "";
  @Input("bgFieldConfig") config: BgFieldConfig<V, E> | null = null;

  @HostBinding("value")
  viewValue: any = "";

  ngOnInit() {
    this.form.registerField(this);
  }

  ngOnDestroy() {
    this.form.unregisterField(this);
  }

  setValue(value: V | null) {
    if (value) {
      this.viewValue = value || "";
    } else {
      this.viewValue = "";
    }
    // N.B.: senza timeout non si vede la label se il campo è valorizzato all'inizio
    setTimeout(() => this.cd.markForCheck());
  }

  private onValueChange(value: V) {
    this.form.onValueChange(value, this);
  }

  @HostListener("blur", ["$event"])
  onBlur(event: FocusEvent) {
    this.onValueChange((event.target as any).value);
  }

  @HostListener("keyup.enter", ["$event"])
  onKeyupEnter(event: any) {
    this.onValueChange(event.target.value);
  }
}

@Directive({ selector: "mat-select[bgField]" })
@UntilDestroy
export class BgSelectFieldDirective<V, E> implements OnInit, OnDestroy, BgFieldDirective<V, E> {
  private form = inject<BgFormDirective<E>>(BgFormDirective);
  private matSelect = inject(MatSelect, { host: true });

  @Input("bgField") field: keyof E | "" = "";
  @Input("bgFieldConfig") config: BgFieldConfig<V, E> | null = null;

  @ChangeListener()
  private listenToSelectionChange() {
    return this.matSelect.selectionChange.pipe(
      tap(change => this.form.onValueChange(change.value, this))
    );
  }

  ngOnInit() {
    this.form.registerField(this);
    this.listenToSelectionChange();
  }

  ngOnDestroy() {
    this.form.unregisterField(this);
  }

  setValue(value: V | null) {
    this.matSelect.writeValue(value);
  }
}

@Directive({ selector: "mat-radio-group[bgField]" })
@UntilDestroy
export class BgRadioFieldDirective<V, E> implements OnInit, OnDestroy, BgFieldDirective<V, E> {
  private form = inject<BgFormDirective<E>>(BgFormDirective);
  private matRadioGroup = inject(MatRadioGroup, { host: true });

  @Input("bgField") field: keyof E | "" = "";
  @Input("bgFieldConfig") config: BgFieldConfig<V, E> | null = null;

  @ChangeListener()
  private listenToSelectionChange() {
    return this.matRadioGroup.change.pipe(
      tap(change => this.form.onValueChange(change.value, this))
    );
  }

  ngOnInit() {
    this.form.registerField(this);
    this.listenToSelectionChange();
  }

  ngOnDestroy() {
    this.form.unregisterField(this);
  }

  setValue(value: V | null) {
    this.matRadioGroup.writeValue(value);
  }
}

@Directive({ selector: "mat-checkbox[bgField]" })
@UntilDestroy
export class BgCheckboxFieldDirective<E>
  implements OnInit, OnDestroy, BgFieldDirective<boolean, E>
{
  private form = inject<BgFormDirective<E>>(BgFormDirective);
  private matCheckbox = inject(MatCheckbox, { host: true });

  @Input("bgField") field: keyof E | "" = "";
  @Input("bgFieldConfig") config: BgFieldConfig<boolean, E> | null = null;

  @ChangeListener()
  private listenToSelectionChange() {
    return this.matCheckbox.change.pipe(
      tap(change => this.form.onValueChange(change.checked, this))
    );
  }

  ngOnInit() {
    this.form.registerField(this);
    this.listenToSelectionChange();
  }

  ngOnDestroy() {
    this.form.unregisterField(this);
  }

  setValue(value: boolean | null) {
    this.matCheckbox.writeValue(value);
  }
}
