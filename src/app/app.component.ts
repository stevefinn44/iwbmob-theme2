import { Component, ViewChild } from '@angular/core';
import { Platform, MenuController, Nav, App, ToastController } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Observable } from 'rxjs/Observable';

import { TabsNavigationPage } from '../pages/tabs-navigation/tabs-navigation';
import { FormsPage } from '../pages/forms/forms';

import { WalkthroughPage } from '../pages/walkthrough/walkthrough';
/* import { SettingsPage } from '../pages/settings/settings';
import { FunctionalitiesPage } from '../pages/functionalities/functionalities'; */
/* import { FirebaseLoginPage } from '../pages/firebase-integration/firebase-login/firebase-login';
import { WordpressMenuPage } from '../pages/wordpress-integration/wordpress-menu/wordpress-menu'; */

import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { HttpClientService } from '../services/httpClientService';
//import { database } from '../../node_modules/firebase/app';
import { UserOptions } from './models/userOptions';
import { AppSettings } from '../services/appSettings';
import { SettingsPage } from '../pages/settings/settings';

import Auth0Cordova from '@auth0/cordova';

@Component({
  selector: 'app-root',
  templateUrl: 'app.html'
})
export class MyApp {

  @ViewChild(Nav) nav: Nav;


  // make WalkthroughPage the root (or first) page
  rootPage: any = WalkthroughPage;
  // rootPage: any = TabsNavigationPage;
  textDir: string = "ltr";

  pages: Array<{title: any, icon: string, component: any}>;
  pushPages: Array<{title: any, icon: string, component: any}>;

  constructor(
    platform: Platform,
    public menu: MenuController,
    public app: App,
    public splashScreen: SplashScreen,
    public statusBar: StatusBar,
    public translate: TranslateService,
    public toastCtrl: ToastController,
    private http: HttpClientService,
    private appSettings: AppSettings
  ) {
    translate.setDefaultLang('en');
    translate.use('en');

    platform.ready().then(() => {

      (window as any).handleOpenURL = (url: string) => {
        Auth0Cordova.onRedirectUri(url);
      }
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      if (this.appSettings.userOptions === null) {
        this.http.get<UserOptions>('UserOptions')
        .subscribe(
          data => {

            this.appSettings.userOptions = data as UserOptions;
            console.log(`Data:${JSON.stringify(this.appSettings.userOptions)}`);
            this.splashScreen.hide();
            this.statusBar.styleDefault();
          },
          error => console.log(`Error: ${JSON.stringify(error)}`)
        );
      } else {
          this.splashScreen.hide();
          this.statusBar.styleDefault();
      }


    });

    this.translate.onLangChange.subscribe((event: LangChangeEvent) =>
      {
        if(event.lang == 'ar')
        {
          platform.setDir('rtl', true);
        }
        else
        {
          platform.setDir('ltr', true);
        }
        Observable.forkJoin(
          this.translate.get('Scan'),
          this.translate.get('Containers'),
          this.translate.get('Search'),
          this.translate.get('Shop'),
          this.translate.get('Preferences')/*,
          this.translate.get('SETTINGS') ,
          this.translate.get('WORDPRESS_INTEGRATION'),
          this.translate.get('FIREBASE_INTEGRATION') */
         /*  this.translate.get('HOME'),
          this.translate.get('FORMS'),
          this.translate.get('FUNCTIONALITIES'),
          this.translate.get('LAYOUTS'),
          this.translate.get('SETTINGS'),
          this.translate.get('WORDPRESS_INTEGRATION'),
          this.translate.get('FIREBASE_INTEGRATION') */
        ).subscribe(data => {
          this.pages = [
            { title: data[0], icon: 'qr-scanner', component: TabsNavigationPage },
            { title: data[1], icon: 'cube', component: TabsNavigationPage },
            { title: data[2], icon: 'search', component: FormsPage },
            { title: data[3], icon: 'pricetags', component: FormsPage }
          ];

          this.pushPages = [
            { title: data[4], icon: 'settings', component: SettingsPage }/*,
            { title: data[4], icon: 'settings', component: SettingsPage } ,
            { title: data[5], icon: 'logo-wordpress', component: WordpressMenuPage },
            { title: data[6], icon: 'flame', component: FirebaseLoginPage } */
          ];
        });
      });

  }


  openPage(page) {

    if (!this.appSettings.userOptions.userOptionsSet) {
      console.log(`NotSet: ${JSON.stringify(this.appSettings.userOptions)}`);
      page = this.pushPages[0];
    }
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    this.nav.setRoot(page.component);
  }

  pushPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // rootNav is now deprecated (since beta 11) (https://forum.ionicframework.com/t/cant-access-rootnav-after-upgrade-to-beta-11/59889)
    this.app.getRootNav().push(page.component);
  }
}
