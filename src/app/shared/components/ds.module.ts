import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerticalAlignerModule } from './vertical-aligner/vertical-aligner.module';
import { CardModule } from './card/card.module';
import { InfoModule } from './info/info.module';
import { InputModule } from './input/input.module';
import { VerticalAlignerComponent } from './vertical-aligner/vertical-aligner.component';
import { CardComponent } from './card/card.component';
import { InfoComponent } from './info/info.component';
import { InputComponent } from './input/input.component';
import { DatalistModule } from './datalist/datalist.module';
import { DatalistComponent } from './datalist/datalist.component';
import { FieldSetModule } from './fieldset/fieldset.module';
import { FieldSetComponent } from './fieldset/fieldset.component';
import { CommentComponent } from './comment/comment.component';
import { CommentModule } from './comment/comment.module';

@NgModule({
  imports: [
    CommonModule,
    VerticalAlignerModule,
    CardModule,
    InfoModule,
    InputModule,
    DatalistModule,
    FieldSetModule,
    CommentModule
  ],
  exports: [
    VerticalAlignerComponent,
    CardComponent,
    InfoComponent,
    InputComponent,
    DatalistComponent,
    FieldSetComponent,
    CommentComponent
  ]
})
export class DesignSystemModule {}
