import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderComponent } from './header/header.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { HttpClientModule } from '@angular/common/http';
import { RealTimeEnergyUsageComponent } from './real-time-energy-usage/real-time-energy-usage.component';
import {
  BrowserAnimationsModule,
  NoopAnimationsModule,
} from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { FloorPlanComponent } from './floor-plan/floor-plan.component';
import { SystemControlsComponent } from './system-controls/system-controls.component';
import { AlertsListComponent } from './alerts-list/alerts-list.component';
import { SolarOverviewComponent } from './solar-overview/solar-overview.component';
import { GridsterModule } from 'angular-gridster2';
import { GridsterComponent, GridsterItemComponent } from 'angular-gridster2';
import { ToolbarModule } from 'primeng/toolbar';
import { MenubarModule } from 'primeng/menubar';
import { TableModule } from 'primeng/table';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ChartModule } from 'primeng/chart';
import { SliderModule } from 'primeng/slider';
import { SidebarModule } from 'primeng/sidebar';
import { DialogModule } from 'primeng/dialog';
import { NgChartsModule } from 'ng2-charts';
import { ButtonModule } from 'primeng/button';
import { TabViewModule } from 'primeng/tabview';
import { TabMenuModule } from 'primeng/tabmenu';
import { CardModule } from 'primeng/card';
import { DragDropModule } from 'primeng/dragdrop';
import { TagModule } from 'primeng/tag';
import { ImageModule } from 'primeng/image';
import { AccordionModule } from 'primeng/accordion';
import { ToastModule } from 'primeng/toast';
import { MessagesModule } from 'primeng/messages';
import { MessageService } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { TooltipModule } from 'primeng/tooltip';
import { MatterportViewerComponent } from './matterport-viewer/matterport-viewer.component';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    HeaderComponent,
    DashboardComponent,
    RealTimeEnergyUsageComponent,
    FloorPlanComponent,
    SystemControlsComponent,
    AlertsListComponent,
    SolarOverviewComponent,
    MatterportViewerComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    GridsterModule,
    GridsterComponent,
    GridsterItemComponent,
    ToolbarModule,
    MenubarModule,
    TableModule,
    ToggleButtonModule,
    ChartModule,
    SliderModule,
    SidebarModule,
    DialogModule,
    NgChartsModule,
    ButtonModule,
    TabViewModule,
    TabMenuModule,
    CardModule,
    DragDropModule,
    TagModule,
    ImageModule,
    AccordionModule,
    ToastModule,
    MessagesModule,
    BadgeModule,
    TooltipModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
  ],
  providers: [MessageService],
  exports: [MatterportViewerComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
