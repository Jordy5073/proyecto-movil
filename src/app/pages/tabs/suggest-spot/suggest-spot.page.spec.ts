import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SuggestSpotPage } from './suggest-spot.page';

describe('SuggestSpotPage', () => {
  let component: SuggestSpotPage;
  let fixture: ComponentFixture<SuggestSpotPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SuggestSpotPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
