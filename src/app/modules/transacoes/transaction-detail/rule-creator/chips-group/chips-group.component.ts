import { Component, Input, OnInit, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { IChipGroupPattern, IChipGroupParcialPattern } from './patterns/IChipGroupPattern';
import { ArrayUtils } from '@shared/utils/array.utils';

export class RuleConfig {
  title: string;
  selectable: boolean;
  values: { key: string, value: string, pattern: IChipGroupPattern, label: string }[];
}

class ChipList {
  key: string;
  selectable: boolean;
  fullValue: string;
  chipValue: string[];
  pattern: IChipGroupParcialPattern;
  label: string;
}

@Component({
  selector: 'app-chips-group',
  templateUrl: './chips-group.component.html',
  styleUrls: ['./chips-group.component.scss']
})
export class RuleChipGroupComponent implements OnInit {

  @Input() config: RuleConfig;
  @Output() clicked = new EventEmitter();

  chipLists: ChipList[] = [];
  selecteds: { id: string, positions: number[] }[] = [];
  impositive: boolean[];

  ngOnInit(): void {
    this.init();
  }

  public init() {
    this._parse();
    this.impositive = this.chipLists.map(() => false);
  }

  parcialPattern(pattern: IChipGroupPattern): IChipGroupParcialPattern {
    const treatment = (chip: string) => chip;
    return {
      treatment: pattern.treatment || treatment,
      intersect: pattern.intersect,
      starting: pattern.starting,
      ending: pattern.ending
    };
  }

  getSelect(position: number) {
    return this.impositive[position];
  }

  onDevolve(event: { label: string, isSelected: boolean, position: number }) {
    const id = this.config.values.filter(val => val.label === event.label)[0].key;

    const index = this.selecteds.map(sel => sel.id).indexOf(id);
    if (index < 0) {
      this.selecteds.push({ id, positions: [event.position] });
    } else {
      let positions = this.selecteds[index].positions;
      positions = positions || [];
      if (positions.includes(event.position)) {
        positions.splice(positions.indexOf(event.position), 1);
      } else {
        positions.push(event.position);
      }
      this.selecteds[index].positions = positions;
    }

    this.clicked.emit(this._map());
  }

  forceSelect(id: number) {
    this.impositive[id] = !this.impositive[id];
    const positions = this.impositive[id] ? this.chipLists[id].chipValue.map((chip, position) => position) : [];
    const key = this.chipLists[id].key;
    const index = this.selecteds.map(sel => sel.id).indexOf(key);
    if (index < 0) {
      this.selecteds.push({
        id: key,
        positions
      });
    } else {
      this.selecteds[index].positions = positions;
    }

    const map = this._map();
    this.clicked.emit(map);
  }

  private _map() {
    return this.selecteds.map(sel => {
      const chipList = this.chipLists.filter(cl => cl.key === sel.id)[0];
      const selecteds = sel.positions.map(pos => chipList.chipValue[pos]);
      return {
        title: sel.id,
        selecteds
      };
    })
      .map(item => {
        const chipList = this.chipLists.filter(cl => cl.key === item.title)[0];
        if (item.selecteds.length === chipList.chipValue.length) {
          return {
            title: item.title,
            selecteds: [chipList.fullValue]
          };
        }
        return item;
      });
  }

  private _parse() {
    this.chipLists = this.config.values.map(config => {
      let chipValue = [config.value];

      if (config.pattern.separators.length) {
        chipValue = ArrayUtils.magicSplit(chipValue[0], ...config.pattern.separators).filter(el => el !== ' ');
      }
      if (config.pattern.treatment) {
        chipValue = chipValue.filter(chip => config.pattern.treatment(chip) !== null);
      }
      if (config.pattern.sort) {
        chipValue = config.pattern.sort(chipValue);
      }

      return {
        pattern: this.parcialPattern(config.pattern),
        selectable: this.config.selectable,
        fullValue: config.value,
        label: config.label,
        key: config.key,
        chipValue
      };
    });
  }

}
