import { Component, Inject } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import  {TabsPage} from './pages/tabs/tabs.page';
import { PushService } from 'src/servicios/push.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet, TabsPage],
})
export class AppComponent {
  constructor(private push: PushService) {

  }

  async ngOnInit() {
    await this.push.init();
  }
}
