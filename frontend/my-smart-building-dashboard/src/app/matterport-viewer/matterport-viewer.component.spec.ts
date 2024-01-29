import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatterportViewerComponent } from './matterport-viewer.component';

describe('MatterportViewerComponent', () => {
  let component: MatterportViewerComponent;
  let fixture: ComponentFixture<MatterportViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatterportViewerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MatterportViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
