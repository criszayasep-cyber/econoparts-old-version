import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EstatusConexionPage } from './estatus-conexion.page';

describe('EstatusConexionPage', () => {
  let component: EstatusConexionPage;
  let fixture: ComponentFixture<EstatusConexionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EstatusConexionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EstatusConexionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
