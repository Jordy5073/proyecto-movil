import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SpotListPage } from './spot-list.page';

describe('SpotListPage', () => {
  let component: SpotListPage;
  let fixture: ComponentFixture<SpotListPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SpotListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
