import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SelectPaisPage } from './select-pais.page';

describe('SelectPaisPage', () => {
  let component: SelectPaisPage;
  let fixture: ComponentFixture<SelectPaisPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectPaisPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SelectPaisPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
